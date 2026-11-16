/**
 * Hannah 3D Avatar Controller
 * Three.js + GLTFLoader
 * 
 * Features:
 * - PBR material tuning matching Hannah's approved reference portrait (strawberry-blonde/caramel hair, cream sweater, hazel eyes)
 * - Complete 72-blendshape facial rig (Oculus visemes + Apple ARKit)
 * - Procedural natural animations: eye blinking, micro-saccades, breathing, subtle head tilt
 * - Emotional states: Idle, Listening, Thinking, Speaking, Greeting/Happy, Interrupted
 * - High-fidelity real-time viseme lip-sync engine
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class HannahAvatarController {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.modelUrl = options.modelUrl || '/hannah/hannah.glb';
    this.onLoadComplete = options.onLoadComplete || (() => {});
    this.onVisemeUpdate = options.onVisemeUpdate || (() => {});

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.avatar = null;
    this.headMesh = null;
    this.teethMesh = null;
    this.neckBone = null;
    this.headBone = null;

    // Morph target caches
    this.morphDict = {};
    this.currentWeights = {};
    this.targetWeights = {};

    // Animation state
    this.state = 'idle'; // 'idle' | 'listening' | 'thinking' | 'speaking' | 'greeting' | 'interrupted'
    this.clock = new THREE.Clock();

    // Procedural timers
    this.nextBlinkTime = 2.0;
    this.blinkDuration = 0.16;
    this.blinkTimer = 0;
    this.isBlinking = false;

    this.nextSaccadeTime = 3.0;
    this.saccadeTimer = 0;
    this.targetEyeX = 0;
    this.targetEyeY = 0;
    this.currentEyeX = 0;
    this.currentEyeY = 0;

    this.activeViseme = 'viseme_sil';
    this.visemeWeight = 0;
    this.mouthOpenWeight = 0;

    this.init();
  }

  init() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || 500;

    // Scene setup
    this.scene = new THREE.Scene();

    // Camera setup - framed for portrait bust view
    this.camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 50);
    this.camera.position.set(0, 1.48, 1.05);
    this.camera.lookAt(0, 1.43, 0);

    // Renderer setup with tone mapping & anti-aliasing
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Studio 3-Point Lighting Setup
    this.setupLighting();

    // Window resize handler
    window.addEventListener('resize', () => this.onWindowResize());

    // Load Model
    this.loadModel();

    // Start render loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // 1. Soft Warm Ambient
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.95);
    this.scene.add(ambientLight);

    // 2. Key Light (Soft Warm Studio Light, upper front-right)
    const keyLight = new THREE.DirectionalLight(0xffedd8, 1.75);
    keyLight.position.set(0.65, 2.1, 1.4);
    this.scene.add(keyLight);

    // 3. Fill Light (Soft Cool-tinted Fill from left)
    const fillLight = new THREE.DirectionalLight(0xdce7ff, 0.85);
    fillLight.position.set(-0.75, 1.6, 1.1);
    this.scene.add(fillLight);

    // 4. Back / Rim Light (Warm Golden highlights on hair and silhouette)
    const rimLight = new THREE.DirectionalLight(0xffdfa8, 1.5);
    rimLight.position.set(0, 2.3, -1.2);
    this.scene.add(rimLight);

    // 5. Subtle Eye Catchlight Point Light
    const catchLight = new THREE.PointLight(0xffffff, 0.5, 3);
    catchLight.position.set(0, 1.5, 0.8);
    this.scene.add(catchLight);
  }

  loadModel() {
    const loader = new GLTFLoader();

    loader.load(
      this.modelUrl,
      (gltf) => {
        this.avatar = gltf.scene;

        // Position avatar so head and upper chest are perfectly framed
        this.avatar.position.set(0, 0, 0);
        this.avatar.rotation.y = 0;

        // Traverse avatar meshes and bones
        this.avatar.traverse((child) => {
          if (child.isBone) {
            const name = child.name.toLowerCase();
            if (name.includes('neck')) this.neckBone = child;
            if (name.includes('head')) this.headBone = child;
          }

          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Cache morph targets if head or teeth
            if (child.morphTargetDictionary) {
              if (child.name === 'Wolf3D_Head' || child.name.toLowerCase().includes('head')) {
                this.headMesh = child;
                this.morphDict = child.morphTargetDictionary;
                for (const key of Object.keys(this.morphDict)) {
                  this.currentWeights[key] = 0;
                  this.targetWeights[key] = 0;
                }
              }
              if (child.name === 'Wolf3D_Teeth' || child.name.toLowerCase().includes('teeth')) {
                this.teethMesh = child;
              }
            }

            // Material customisation to match approved portrait
            this.tuneMaterial(child);
          }
        });

        this.scene.add(this.avatar);

        // Set natural friendly resting expression
        this.setExpression('idle');

        this.onLoadComplete();
      },
      undefined,
      (err) => {
        console.error('[HannahAvatar] Error loading avatar model:', err);
      }
    );
  }

  tuneMaterial(mesh) {
    if (!mesh.material) return;
    const name = mesh.name.toLowerCase();

    // 1. Hair: Strawberry blonde / warm caramel golden tone
    if (name.includes('hair')) {
      mesh.material = mesh.material.clone();
      mesh.material.color = new THREE.Color('#9f6e3c');
      mesh.material.roughness = 0.58;
      mesh.material.metalness = 0.05;
    }

    // 2. Outfit Top: Warm cream / off-white ribbed knit sweater
    else if (name.includes('outfit') || name.includes('top')) {
      mesh.material = mesh.material.clone();
      mesh.material.color = new THREE.Color('#f5f2ea');
      mesh.material.roughness = 0.88;
      mesh.material.metalness = 0.0;
    }

    // 3. Eyes: Hazel / green iris tint with glossy cornea
    else if (name.includes('eye')) {
      mesh.material = mesh.material.clone();
      if (!name.includes('cornea')) {
        mesh.material.color = new THREE.Color('#648b6f'); // Hazel-green iris
      }
      mesh.material.roughness = 0.08;
      mesh.material.metalness = 0.1;
    }

    // 4. Head & Body: Natural warm peachy undertone
    else if (name.includes('head') || name.includes('body')) {
      mesh.material = mesh.material.clone();
      mesh.material.color = new THREE.Color('#ffe2d1');
      mesh.material.roughness = 0.6;
      mesh.material.metalness = 0.02;
    }
  }

  setExpression(state) {
    this.state = state;

    // Reset baseline expression morphs
    this.setMorph('mouthSmileLeft', 0);
    this.setMorph('mouthSmileRight', 0);
    this.setMorph('browInnerUp', 0);
    this.setMorph('browDownLeft', 0);
    this.setMorph('browDownRight', 0);

    switch (state) {
      case 'idle':
        // Gentle resting smile, relaxed brows
        this.setMorph('mouthSmileLeft', 0.22);
        this.setMorph('mouthSmileRight', 0.22);
        break;

      case 'listening':
        // Attentive, slight head engagement, warm pleasant gaze
        this.setMorph('mouthSmileLeft', 0.25);
        this.setMorph('mouthSmileRight', 0.25);
        this.setMorph('browInnerUp', 0.2);
        break;

      case 'thinking':
        // Contemplative gaze, subtle brow furrow
        this.setMorph('mouthSmileLeft', 0.08);
        this.setMorph('mouthSmileRight', 0.08);
        this.setMorph('browInnerUp', 0.18);
        this.setMorph('browDownLeft', 0.12);
        this.setMorph('browDownRight', 0.12);
        break;

      case 'speaking':
        // Animated expression
        this.setMorph('mouthSmileLeft', 0.25);
        this.setMorph('mouthSmileRight', 0.25);
        this.setMorph('browInnerUp', 0.15);
        break;

      case 'greeting':
      case 'happy':
        // Warm, welcoming broad smile
        this.setMorph('mouthSmileLeft', 0.58);
        this.setMorph('mouthSmileRight', 0.58);
        this.setMorph('browInnerUp', 0.1);
        break;

      case 'interrupted':
        // Surprised / attentive instant stop
        this.setMorph('mouthSmileLeft', 0.15);
        this.setMorph('mouthSmileRight', 0.15);
        this.setMorph('browInnerUp', 0.42);
        this.closeMouthInstantly();
        break;
    }
  }

  setViseme(visemeName, weight = 1.0, openWeight = 0.5) {
    // Clear all other active visemes
    const visemes = [
      'viseme_aa', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U',
      'viseme_PP', 'viseme_FF', 'viseme_TH', 'viseme_DD', 'viseme_kk',
      'viseme_CH', 'viseme_SS', 'viseme_nn', 'viseme_RR'
    ];

    for (const v of visemes) {
      if (v === visemeName) {
        this.setMorph(v, weight);
      } else {
        this.setMorph(v, 0);
      }
    }

    if (visemeName === 'viseme_sil') {
      this.closeMouthInstantly();
    } else {
      this.setMorph('mouthOpen', openWeight * 0.7);
      this.setMorph('jawOpen', openWeight * 0.5);
    }

    this.activeViseme = visemeName;
    this.visemeWeight = weight;
    this.mouthOpenWeight = openWeight;

    this.onVisemeUpdate({
      viseme: visemeName,
      weight,
      mouthOpen: openWeight
    });
  }

  closeMouthInstantly() {
    const visemes = [
      'viseme_aa', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U',
      'viseme_PP', 'viseme_FF', 'viseme_TH', 'viseme_DD', 'viseme_kk',
      'viseme_CH', 'viseme_SS', 'viseme_nn', 'viseme_RR',
      'mouthOpen', 'jawOpen'
    ];
    for (const v of visemes) {
      this.targetWeights[v] = 0;
    }
  }

  setMorph(name, targetValue) {
    if (this.morphDict[name] !== undefined) {
      this.targetWeights[name] = Math.max(0, Math.min(1, targetValue));
    }
  }

  updateMorphs(delta) {
    if (!this.headMesh) return;

    const lerpSpeed = 18.0 * delta;

    for (const [name, target] of Object.entries(this.targetWeights)) {
      const idx = this.morphDict[name];
      if (idx !== undefined) {
        const current = this.currentWeights[name] || 0;
        const next = THREE.MathUtils.lerp(current, target, Math.min(lerpSpeed, 1.0));
        this.currentWeights[name] = next;

        this.headMesh.morphTargetInfluences[idx] = next;
        if (this.teethMesh && this.teethMesh.morphTargetDictionary[name] !== undefined) {
          const teethIdx = this.teethMesh.morphTargetDictionary[name];
          this.teethMesh.morphTargetInfluences[teethIdx] = next;
        }
      }
    }
  }

  updateProceduralAnimations(delta, elapsed) {
    // 1. Natural Blinking
    this.blinkTimer += delta;
    if (!this.isBlinking && this.blinkTimer >= this.nextBlinkTime) {
      this.isBlinking = true;
      this.blinkTimer = 0;
      this.nextBlinkTime = 3.2 + Math.random() * 2.8; // Blink every 3.2 to 6 seconds
    }

    if (this.isBlinking) {
      const progress = this.blinkTimer / this.blinkDuration;
      if (progress <= 1.0) {
        // Smooth sine blink curve
        const blinkAmount = Math.sin(progress * Math.PI);
        this.setMorph('eyeBlinkLeft', blinkAmount);
        this.setMorph('eyeBlinkRight', blinkAmount);
      } else {
        this.isBlinking = false;
        this.setMorph('eyeBlinkLeft', 0);
        this.setMorph('eyeBlinkRight', 0);
      }
    }

    // 2. Eye Saccades (Micro-Movements)
    this.saccadeTimer += delta;
    if (this.saccadeTimer >= this.nextSaccadeTime) {
      this.saccadeTimer = 0;
      this.nextSaccadeTime = 2.0 + Math.random() * 3.0;

      // Small natural micro-glances
      if (this.state === 'thinking') {
        this.targetEyeX = 0.25;
        this.targetEyeY = 0.35;
      } else {
        this.targetEyeX = (Math.random() - 0.5) * 0.18;
        this.targetEyeY = (Math.random() - 0.5) * 0.12;
      }
    }

    this.currentEyeX = THREE.MathUtils.lerp(this.currentEyeX, this.targetEyeX, delta * 6.0);
    this.currentEyeY = THREE.MathUtils.lerp(this.currentEyeY, this.targetEyeY, delta * 6.0);

    // Apply eye morphs
    if (this.currentEyeX > 0) {
      this.setMorph('eyeLookOutRight', this.currentEyeX);
      this.setMorph('eyeLookInLeft', this.currentEyeX);
      this.setMorph('eyeLookOutLeft', 0);
      this.setMorph('eyeLookInRight', 0);
    } else {
      this.setMorph('eyeLookOutLeft', -this.currentEyeX);
      this.setMorph('eyeLookInRight', -this.currentEyeX);
      this.setMorph('eyeLookOutRight', 0);
      this.setMorph('eyeLookInLeft', 0);
    }

    if (this.currentEyeY > 0) {
      this.setMorph('eyeLookUpLeft', this.currentEyeY);
      this.setMorph('eyeLookUpRight', this.currentEyeY);
      this.setMorph('eyeLookDownLeft', 0);
      this.setMorph('eyeLookDownRight', 0);
    } else {
      this.setMorph('eyeLookDownLeft', -this.currentEyeY);
      this.setMorph('eyeLookDownRight', -this.currentEyeY);
      this.setMorph('eyeLookUpLeft', 0);
      this.setMorph('eyeLookUpRight', 0);
    }

    // 3. Subtle Breathing & Head Sway
    if (this.headBone || this.neckBone) {
      const breath = Math.sin(elapsed * 1.6) * 0.012;
      const swayX = Math.sin(elapsed * 0.8) * 0.015;
      const swayY = Math.cos(elapsed * 0.6) * 0.015;

      let targetRotX = breath;
      let targetRotY = swayY;
      let targetRotZ = swayX;

      if (this.state === 'listening') {
        // Attentive tilt
        targetRotZ += 0.04;
        targetRotX -= 0.02;
      } else if (this.state === 'thinking') {
        // Thinking tilt
        targetRotZ -= 0.035;
        targetRotY += 0.05;
        targetRotX += 0.03;
      } else if (this.state === 'speaking') {
        // Cadence nod
        const speechNod = Math.sin(elapsed * 4.5) * 0.02;
        targetRotX += speechNod;
      }

      if (this.neckBone) {
        this.neckBone.rotation.x = THREE.MathUtils.lerp(this.neckBone.rotation.x, targetRotX * 0.5, delta * 3.0);
        this.neckBone.rotation.y = THREE.MathUtils.lerp(this.neckBone.rotation.y, targetRotY * 0.5, delta * 3.0);
        this.neckBone.rotation.z = THREE.MathUtils.lerp(this.neckBone.rotation.z, targetRotZ * 0.5, delta * 3.0);
      }
      if (this.headBone) {
        this.headBone.rotation.x = THREE.MathUtils.lerp(this.headBone.rotation.x, targetRotX * 0.7, delta * 4.0);
        this.headBone.rotation.y = THREE.MathUtils.lerp(this.headBone.rotation.y, targetRotY * 0.7, delta * 4.0);
        this.headBone.rotation.z = THREE.MathUtils.lerp(this.headBone.rotation.z, targetRotZ * 0.7, delta * 4.0);
      }
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    this.updateMorphs(delta);
    this.updateProceduralAnimations(delta, elapsed);

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    if (!this.canvas || !this.camera || !this.renderer) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
