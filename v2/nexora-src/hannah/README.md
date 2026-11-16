# Hannah's face: source files

These files build the picture and the face rig that bring Hannah to life on the welcome screen
(`v2/public/nexora/hannah/`). The website never runs anything in this folder.

| File | What it is |
|---|---|
| `hannah-seated.png` | **The scene**: Hannah seated at the reception desk (1672 × 941). The plate is this photo. |
| `landmarks-seated.json` | 478 face points found on it by Google MediaPipe Face Landmarker (run once). |
| `hannah-portrait.png`, `landmarks.json` | Her approved portrait and its points: her identity reference; the expression sizes in `hannah-face.js` were tuned on it. |
| `canonical_face_model.obj` | MediaPipe's canonical face mesh (Apache License 2.0), used for its triangles. |
| `layout.py` | Which photo is the scene, and its size. |
| `make_plate.py` | Saves the photo as `hannah-plate.jpg` and makes `hannah-avatar.jpg`. Needs Pillow. |
| `make_rig.py` | Builds `hannah-face.json` (points, triangles, pins, scale). No extra packages. |
| `find-landmarks.html` | The page that finds the points (`?img=<file>`). |

## If the scene photo changes

1. Put the new photo here (16:9, face clearly visible, mouth as in the photo) and set `SOURCE`,
   `W`, `H` in `layout.py`.
2. Serve this folder (`python3 -m http.server 8766`), open
   `http://localhost:8766/find-landmarks.html?img=<photo>` in Chrome, and save the JSON after
   `RESULT` as the `LANDMARKS` file.
3. `python3 make_plate.py && python3 make_rig.py`
4. Copy `v2/public/nexora/hannah/` to `nexora/hannah/`, bump `?v=` in `hannah.js`, then `npm run build`.

Check the mouth, blink and brows afterwards with `?welcome&hannahdebug`.
