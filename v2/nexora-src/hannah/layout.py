"""
Hannah's scene. Shared by make_plate.py and make_rig.py.

Since 2026-11-16 the scene is a real photo of her seated at the reception desk (hannah-seated.png):
the photo itself is the plate, so nothing is painted around her; only her face is animated.
"""
SOURCE = 'hannah-seated.png'          # the scene photo (16:9)
LANDMARKS = 'landmarks-seated.json'   # MediaPipe face points found on it (find-landmarks.html?img=...)
REFERENCE = 'landmarks.json'          # points of her approved portrait: expression sizes were tuned on it
W, H = 1672, 941                      # plate size = photo size
