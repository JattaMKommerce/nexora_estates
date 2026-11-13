import { preloadPbr } from '../three/textures.js';
import { STYLE_TEX } from './styleData.js';
import { preloadModels } from './Furniture.jsx';

/** Warm the interior's textures, models and code while the visitor is still on the building. */
export function prefetchInterior() {
  preloadPbr(STYLE_TEX);
  preloadModels();
  import('./InteriorScene.jsx');
}
