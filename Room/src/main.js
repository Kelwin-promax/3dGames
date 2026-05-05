import * as THREE from 'three';
// Importa o loader para arquivos GLTF/GLB
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// Importa a imagem como um módulo (Vite gerencia o caminho automaticamente)
import kelwinImg from './assets/KelwinMogger.jpeg';
// O sufixo ?url é necessário para que o Vite retorne o caminho do arquivo .glb
import athleteModel from './models/athlete_blond_female.glb?url';

// Caminho direto do modelo (assumindo que você moveu para a pasta public/models/)
const athleteModelPath = '/models/athlete_blond_female.glb';

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

// --- CARREGAMENTO DO MODELO 3D ---

const player = new THREE.Group();
scene.add(player);

let mixer; // Para controlar as animações do modelo
let actions = {};
let activeAction;

const loader = new GLTFLoader();
loader.load(athleteModel, (gltf) => {
loader.load(athleteModelPath, (gltf) => {
    const model = gltf.scene;
    
    // 1. Aumentamos a escala para um tamanho mais visível (ex: 3x o original)
    model.scale.set(3, 3, 3);
    // 1. Escala aumentada para um tamanho considerável (5x)
    model.scale.set(5, 5, 5);

    // 2. Calculamos a caixa delimitadora para encontrar a base (pés) do modelo
    // Forçamos a atualização da matriz para o cálculo ser exato
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    // Movemos o modelo para cima exatamente o necessário para que a base fique no Y=0 do grupo
    
    // Movemos o modelo internamente para que o ponto Y=0 do grupo player seja exatamente onde estão os pés
    model.position.y = -box.min.y;

    player.add(model);
    // Configuração de Animações
    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
        actions[clip.name.toLowerCase()] = mixer.clipAction(clip);
    });

    // Tenta tocar uma animação idle (parado) inicialmente
    if (actions['idle']) {
        activeAction = actions['idle'];
        activeAction.play();
    } else if (gltf.animations.length > 0) {
        activeAction = mixer.clipAction(gltf.animations[0]);
        activeAction.play();
    }
});

// Ajuste final da posição do grupo 'player' para tocar o chão
player.position.y = -5; 

// 4. Iluminação
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2));
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(0, 5, 5);
scene.add(dirLight);

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

const clock = new THREE.Clock();

// 6. Loop de Animação
function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  const isMoving = keys.w || keys.s || keys.a || keys.d;

  if (mixer) {
      mixer.update(delta);
      
      // Troca simples de animação baseada no movimento
      const targetAction = isMoving ? (actions['run'] || actions['walk']) : actions['idle'];
      
      if (targetAction && activeAction !== targetAction) {
          activeAction.fadeOut(0.2);
          targetAction.reset().fadeIn(0.2).play();
          activeAction = targetAction;
      }
  }

  updateMovement();

  renderer.render(scene, camera);
}
animate();