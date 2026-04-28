// src/data/mapData.js
export const castleLayout = [
  // Fundo (Onde fica o espelho/abertura)
  { id: 'back-wall', pos: [0, 2.5, -8], rot: [0, 0, 0], scale: [4, 5, 0.5] },
  // Paredes Diagonais (Onde ficam os quadros)
  { id: 'diag-left', pos: [-4, 2.5, -4], rot: [0, Math.PI / 4, 0], scale: [5.6, 5, 0.5] },
  { id: 'diag-right', pos: [4, 2.5, -4], rot: [0, -Math.PI / 4, 0], scale: [5.6, 5, 0.5] },
  // Paredes Laterais
  { id: 'side-left', pos: [-6.5, 2.5, 0], rot: [0, Math.PI / 2, 0], scale: [8, 5, 0.5] },
  { id: 'side-right', pos: [6.5, 2.5, 0], rot: [0, Math.PI / 2, 0], scale: [8, 5, 0.5] },
];