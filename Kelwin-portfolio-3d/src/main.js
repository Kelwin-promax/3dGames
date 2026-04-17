import * as THREE from 'three';
// Importa a imagem como um módulo (Vite gerencia o caminho automaticamente)
import kelwinImg from './assets/KelwinMogger.jpeg';

// 1. Cena e Câmera
const scene = new THREE.Scene();

// Ajuste de Estilo para preencher a tela toda
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// 2. Criando a "Caixa" (Mundo)
const roomGeometry = new THREE.BoxGeometry(20, 10, 20);
const roomMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, side: THREE.BackSide }); 
// 'BackSide' faz com que a textura apareça por dentro da caixa
const room = new THREE.Mesh(roomGeometry, roomMaterial);
scene.add(room);

// --- CRIAÇÃO DO PERSONAGEM ESTILO STEVE ---

// 1. O Grupo Principal (este será o novo 'player' para movimentação)
const player = new THREE.Group();
scene.add(player);

// Materiais (Cores básicas estilo Steve para teste)
const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac }); // Pele
const blueShirtMat = new THREE.MeshStandardMaterial({ color: 0x00a86b }); // Camiseta
const darkBluePantsMat = new THREE.MeshStandardMaterial({ color: 0x0000cd }); // Calça
const hairMat = new THREE.MeshStandardMaterial({ color: 0x3f2413 }); // Cabelo/Tênis

// --- CONFIGURAÇÃO DA TEXTURA ---
const textureLoader = new THREE.TextureLoader();
const kelwinFaceTexture = textureLoader.load(kelwinImg);
// NearestFilter mantém os pixels nítidos (estilo Minecraft)
kelwinFaceTexture.magFilter = THREE.NearestFilter;
const faceMat = new THREE.MeshStandardMaterial({ map: kelwinFaceTexture });

// 2. CORPO (Tronco)
const torsoGeo = new THREE.BoxGeometry(1, 1.5, 0.5); // L:1, A:1.5, P:0.5
const torso = new THREE.Mesh(torsoGeo, blueShirtMat);
torso.position.y = 1.75; // Altura do centro do tronco
player.add(torso); // Corpo é filho do grupo player

// 3. CABEÇA
// Ordem: Direita, Esquerda, Topo, Fundo, Frente, Costas
const headMaterials = [
    skinMat, // +X (Direita)
    skinMat, // -X (Esquerda)
    skinMat, // +Y (Topo)
    skinMat, // -Y (Fundo)
    faceMat, // +Z (Frente)
    skinMat  // -Z (Costas)
];

const headGeo = new THREE.BoxGeometry(1, 1, 1);
const head = new THREE.Mesh(headGeo, headMaterials);
head.position.y = 1.25; 
torso.add(head);

// 4. BRAÇOS
const armGeo = new THREE.BoxGeometry(0.5, 1.5, 0.5);
// Braço Direito
const armR = new THREE.Group();
armR.position.set(-0.75, 0.75, 0); // Posição do ombro
torso.add(armR);
const armRMesh = new THREE.Mesh(armGeo, skinMat);
armRMesh.position.y = -0.75; // Desloca para o pivot ficar no topo
armR.add(armRMesh);

// Braço Esquerdo
const armL = new THREE.Group();
armL.position.set(0.75, 0.75, 0); // Posição do ombro
torso.add(armL);
const armLMesh = new THREE.Mesh(armGeo, skinMat);
armLMesh.position.y = -0.75;
armL.add(armLMesh);

// 5. PERNAS
const legGeo = new THREE.BoxGeometry(0.5, 1.5, 0.5);
// Perna Direita
const legR = new THREE.Group();
legR.position.set(-0.25, -0.75, 0); // Posição do quadril
torso.add(legR);
const legRMesh = new THREE.Mesh(legGeo, darkBluePantsMat);
legRMesh.position.y = -0.75;
legR.add(legRMesh);

// Perna Esquerda
const legL = new THREE.Group();
legL.position.set(0.25, -0.75, 0); // Posição do quadril
torso.add(legL);
const legLMesh = new THREE.Mesh(legGeo, darkBluePantsMat);
legLMesh.position.y = -0.75;
legL.add(legLMesh);

// Ajuste final da posição do grupo 'player' para tocar o chão
// Como o chão da sua caixa está em -5, ajustamos para que as pernas encostem nele
player.position.y = -4.5; 

// 4. Iluminação
const light = new THREE.PointLight(0xffffff, 100);
light.position.set(0, 3, 0);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// Posicione a câmera em um local alto e afastado para ver a caixa toda
camera.position.set(0, 5, 12); 
camera.lookAt(0, 1, 0); // Olha um pouco acima do chão

// 5. Sistema de Controle por Teclado
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    ' ': false
};

window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

const speed = 0.1;
const wallLimit = 9.0; // 10 - 1.0 (considerando a largura total de 2 unidades do personagem)

function updateMovement() {
    let moveDirection = new THREE.Vector3(0, 0, 0);
    let isMoving = false;

    // 1. Define a direção desejada baseada nas teclas
    if (keys.w) { moveDirection.z -= 1; isMoving = true; }
    if (keys.s) { moveDirection.z += 1; isMoving = true; }
    if (keys.a) { moveDirection.x -= 1; isMoving = true; }
    if (keys.d) { moveDirection.x += 1; isMoving = true; }

    if (isMoving) {
        // 2. Normaliza a direção (para não andar mais rápido na diagonal)
        moveDirection.normalize();

        // 3. Rotação: Faz o personagem olhar para onde vai
        // Criamos um ponto alvo temporário para onde ele deve olhar
        const targetPosition = player.position.clone().add(moveDirection);
        player.lookAt(targetPosition);

        // 4. Calcula a próxima posição
        let nextX = player.position.x + moveDirection.x * speed;
        let nextZ = player.position.z + moveDirection.z * speed;

        // 5. Verificação de Colisão (A "Caixa")
        if (nextX < wallLimit && nextX > -wallLimit) {
            player.position.x = nextX;
        }
        if (nextZ < wallLimit && nextZ > -wallLimit) {
            player.position.z = nextZ;
        }
    }
}

// Ajuste de redimensionamento da janela
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Função para animar os membros do Steve (Lógica será adicionada no próximo passo)
function animateSteve(t) {
    // Amplitude do movimento (o quão longe o braço/perna vai)
    const amplitude = 0.6; 

    // Braços em oposição
    armR.rotation.x = Math.sin(t) * amplitude;
    armL.rotation.x = -Math.sin(t) * amplitude;

    // Pernas em oposição aos braços
    legR.rotation.x = -Math.sin(t) * amplitude;
    legL.rotation.x = Math.sin(t) * amplitude;
}

let time = 0; // Defina fora do loop animate

// 6. Loop de Animação
function animate() {
  requestAnimationFrame(animate);
  
  // Incrementa o tempo se houver movimento
  if (keys.w || keys.s || keys.a || keys.d) {
      time += 0.15; // Velocidade da animação
  } else {
      // Suavemente reseta a pose quando parado usando lerp do Three.js
      time = THREE.MathUtils.lerp(time, 0, 0.1);
  }

  updateMovement();
  animateSteve(time); // Nova função de animação

  renderer.render(scene, camera);
}
animate();