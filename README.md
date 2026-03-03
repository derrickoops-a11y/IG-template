# Instagram Carousel Previewer

A web tool for previewing Instagram-style carousel posts. Customize the avatar, username, location, caption, comments, and carousel images  then see a live replica of how the post will look on Instagram.

**Live Site:** [https://derrickoops-a11y.github.io/IG-template/](https://derrickoops-a11y.github.io/IG-template/)
## Features
- **Carousel Preview**  Upload multiple images to create a swipeable carousel with 4:5 aspect ratio
- **Post Customization**  Set avatar, username, location, post time, caption, and likes
- **Mock Comments**  Add mock comments to preview engagement
- **Spotify Integration**  Attach a Spotify track link to display music info on the post
- **Image Editing**  Pan, zoom, and crop individual carousel images
- **Dark Mode**  Toggle between light and dark themes
- **Responsive Device Previews**  Switch between Desktop, Phone L, and Phone S frame sizes
## Getting Started

### Online

Visit the live site at [https://derrickoops-a11y.github.io/IG-template/](https://derrickoops-a11y.github.io/IG-template/) — no installation required. Upload your images directly through the browser UI.

### Local Development

#### Prerequisites
- [Python 3](https://www.python.org/downloads/)
- A modern web browser
### Running the App
1. Clone the repository:
   ```bash
   git clone https://github.com/derrickoops-a11y/IG-template.git
   cd IG-template
   ```
2. Start the local server:
   ```bash
   python server.py
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:3001
   ```
> **Note:** The server includes an optional API endpoint (`/api/defaults`) that can load a default avatar and carousel images from local file paths configured in `server.py`. Update `DEFAULT_CAROUSEL_FOLDER` and `DEFAULT_AVATAR_PATH` in `server.py` to point to your own files, or simply upload images through the browser UI.
## Project Structure
| File         | Description                                              |
| ------------ | -------------------------------------------------------- |
| `index.html` | Main HTML page with the control panel and post preview   |
| `style.css`  | Styling with CSS variables for light and dark themes     |
| `script.js`  | Client-side logic for carousel, media handling, and UI   |
| `server.py`  | Python HTTP server for serving files and the defaults API|
## Usage
1. **Upload Images**  Use "Select Files" or "Select Folder" in the control panel to add carousel images.
2. **Customize the Post**  Fill in the username, location, caption, likes, and other fields.
3. **Preview**  The right-hand panel updates in real time to show the Instagram-style post.
4. **Switch Devices**  Use the Desktop / Phone L / Phone S buttons to preview at different widths.
5. **Toggle Theme**  Use the Dark Mode switch to preview in light or dark mode.
## License
This project is provided as-is for personal and educational use.
