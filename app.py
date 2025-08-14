import os
from flask import Flask, render_template, send_from_directory, url_for, redirect
from PIL import Image
from PIL.ExifTags import TAGS

# --- Configuration ---
PHOTO_FOLDER = './photos'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__, template_folder='static')

# --- Helper Functions ---
def get_sorted_images():
    """Scans the photo folder and returns a sorted list of valid image filenames."""
    try:
        all_files = os.listdir(PHOTO_FOLDER)
        image_names = sorted([f for f in all_files if f.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS])
        return image_names
    except FileNotFoundError:
        print(f"WARNING: The '{PHOTO_FOLDER}' directory was not found.")
        return []

def get_exif_data(filename):
    """Extracts relevant EXIF data from an image file."""
    try:
        image_path = os.path.join(PHOTO_FOLDER, filename)
        img = Image.open(image_path)
        exif_data_raw = img._getexif()
        
        exif_data = {}
        if exif_data_raw:
            for tag_id, value in exif_data_raw.items():
                tag = TAGS.get(tag_id, tag_id)
                exif_data[tag] = value

        # --- NEW DATA EXTRACTION ---
        # Get camera manufacturer and model
        make = exif_data.get('Make', '').strip().title()
        model = exif_data.get('Model', 'N/A').strip()
        
        # Get lens model (this tag can vary, so we check a common one)
        lens_model = exif_data.get('LensModel', 'N/A').strip()

        # Format the specific data we want
        aperture = exif_data.get('FNumber')
        shutter_speed = exif_data.get('ExposureTime')

        return {
            'Focal Length': f"{int(exif_data.get('FocalLength', 0))}mm", # ADD THIS LINE
            'ISO': exif_data.get('ISOSpeedRatings', 'N/A'),
            'Aperture': f"f/{aperture}" if aperture else 'N/A',
            'Shutter Speed': f"1/{int(1/shutter_speed)}" if shutter_speed and shutter_speed < 1 else f"{shutter_speed}s" if shutter_speed else 'N/A',
            'Make': make,
            'Model': model,
            'Lens Model': lens_model
        }
    except Exception as e:
        print(f"Could not read EXIF data for {filename}: {e}")
        return {
            'ISO': 'N/A', 'Aperture': 'N/A', 'Shutter Speed': 'N/A',
            'Make': '', 'Model': 'N/A', 'Lens Model': 'N/A'
        }

# --- Routes ---
@app.route('/photos/<path:filename>')
def serve_photo(filename):
    """Serves a photo from the 'photos' directory."""
    return send_from_directory(PHOTO_FOLDER, filename)

@app.route('/')
def home():
    """Redirects to the first image in the gallery."""
    images = get_sorted_images()
    if not images:
        return "No images found in the 'photos' folder.", 404
    # Redirect to the view for the first image
    return redirect(url_for('view_image', filename=images[0]))

@app.route('/view/<path:filename>')
def view_image(filename):
    """Displays a single image with its metadata and navigation links."""
    images = get_sorted_images()
    if filename not in images:
        return "Image not found.", 404

    # Find current image index for navigation
    current_index = images.index(filename)
    
    # Determine previous and next images, with wrap-around
    prev_index = (current_index - 1) % len(images)
    next_index = (current_index + 1) % len(images)
    
    prev_image = images[prev_index]
    next_image = images[next_index]

    # Get metadata for the current image
    metadata = get_exif_data(filename)
    
    return render_template(
        'template.html', 
        current_image=filename,
        prev_image=prev_image,
        next_image=next_image,
        metadata=metadata
    )

# --- Run the App ---
if __name__ == '__main__':
    app.run(debug=True)