import os
from flask import Flask, render_template, send_from_directory

# --- Configuration ---
# Note: The 'photos' folder must be in the same directory as this app.py file.
PHOTO_FOLDER = './photos' 
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# --- App Initialization ---
# We tell Flask to look for the template in the 'static' folder
# because that's where you've chosen to place template.html
app = Flask(__name__, template_folder='static')

# --- Helper Function ---
def is_allowed_file(filename):
    """Checks if a filename has an allowed extension."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- Routes ---
@app.route('/photos/<path:filename>')
def serve_photo(filename):
    """
    This route is necessary to serve the actual image files from the '/photos' directory,
    which is not served by default.
    """
    return send_from_directory(PHOTO_FOLDER, filename)

@app.route('/')
def gallery():
    """
    This is the main route. It scans the photos folder, sorts the filenames,
    and renders the template.
    """
    try:
        # Get list of files in the photo folder
        all_files = os.listdir(PHOTO_FOLDER)
        # Filter the list to include only allowed image types
        image_names = [file for file in all_files if is_allowed_file(file)]
        # Sort the images by name
        image_names.sort()
    except FileNotFoundError:
        # If the 'photos' directory doesn't exist, return an empty list
        image_names = []
        print(f"WARNING: The '{PHOTO_FOLDER}' directory was not found.")

    # Render the webpage, passing the list of image names to the template
    return render_template('template.html', images=image_names)

# --- Run the App ---
if __name__ == '__main__':
    app.run(debug=True)