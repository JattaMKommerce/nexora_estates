/**
 * Recommended interior schemes (plain data, no three.js, so the interface can list them without
 * loading the 3D bundle). They are styling suggestions shown on the illustrative layout: the UI
 * states that furniture and finishes are not part of the residence unless the developer says so.
 */
export const STYLES = [
  {
    id: 'warm',
    name: 'Warm Contemporary',
    blurb: 'Wide oak floorboards, linen upholstery and warm white walls.',
    swatch: ['#c9b08c', '#efe9e1', '#cbb9a0'],
    floor: { living: ['woodfloor', '#f4ece2', 2.4], bedroom: ['woodfloor', '#f4ece2', 2.4], wet: ['marble', '#ffffff', 2.0], deck: ['concrete', '#d8d1c6', 2.4] },
    wall: '#efe9e1',
    tiles: ['wallTiles', '#f6f1ea', 1.7],
    sheer: '#f3eee6',
    drape: '#b9a68c',
    fabric: ['linen', '#c6b298'],
    fabric2: ['linen', '#8a7b6a'],
    wood: ['oak', '#ffffff'],
    cabinet: '#ebe6de',
    counter: [null, '#ebe6df'],
    dark: '#2b2724',
    metal: '#b08d57',
    rug: ['cotton', '#d8c9b3'],
    bedding: '#f3eee6',
    throw: '#9b7d5c'
  },
  {
    id: 'nordic',
    name: 'Nordic Light',
    blurb: 'Pale timber, soft greys and crisp black details.',
    swatch: ['#e6dccd', '#f6f6f3', '#bfc3c4'],
    floor: { living: ['laminate', '#fff8ef', 2.0], bedroom: ['laminate', '#fff8ef', 2.0], wet: ['marble', '#f7f5f2', 2.0], deck: ['concrete', '#dcd7cf', 2.4] },
    wall: '#f6f6f3',
    tiles: ['wallTiles', '#ffffff', 1.7],
    sheer: '#fbfbf9',
    drape: '#c9cccb',
    fabric: ['linen', '#c3c6c6'],
    fabric2: ['cotton', '#e3e1dc'],
    wood: ['oak', '#fbf4ea'],
    cabinet: '#f4f3f0',
    counter: [null, '#f2f1ee'],
    dark: '#1c1d1f',
    metal: '#1e1f21',
    rug: ['cotton', '#e8e4dd'],
    bedding: '#fbfaf7',
    throw: '#6f7477'
  },
  {
    id: 'luxe',
    name: 'Luxe Marble',
    blurb: 'Marble living areas, herringbone bedrooms, walnut and deep velvet.',
    swatch: ['#2f4b40', '#e2dbd1', '#6b4b33'],
    floor: { living: ['marble', '#ffffff', 2.4], bedroom: ['herringbone', '#e9dccd', 1.6], wet: ['marble', '#f4efe8', 1.6], deck: ['concrete', '#cfc7bb', 2.4] },
    wall: '#e3dcd2',
    tiles: ['marble', '#f4efe8', 1.6],
    sheer: '#efe8dc',
    drape: '#365447',
    fabric: ['velvet', '#365447'],
    fabric2: ['velvet', '#b39467'],
    wood: ['walnut', '#ffffff'],
    cabinet: '#2c2a27',
    counter: [null, '#34312e'],
    dark: '#151517',
    metal: '#c6a46a',
    rug: ['cotton', '#cbbfae'],
    bedding: '#efe8de',
    throw: '#365447'
  }
];

export const STYLE_TEX = ['laminate', 'herringbone', 'marble', 'terrazzo', 'linen', 'cotton', 'velvet', 'oak', 'walnut', 'concrete', 'woodfloor', 'plaster', 'wallTiles'];

export const styleById = (id) => STYLES.find((s) => s.id === id) || STYLES[0];
