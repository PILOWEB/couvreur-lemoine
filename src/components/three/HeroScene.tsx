import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ascension, lerp, smoothstep } from '@/lib/ascension';
import { COULEUR_ACCENT } from '@/config/site.config';

/* =============================================================================
   Portion de toiture procédurale : rangs d'ardoises légèrement irrégulières,
   faîtage zinc. Matériau mat, lumière rasante chaude. Aucune texture chargée :
   tout est géométrie + couleurs, donc le poids est celui de Three.js seul.
   La caméra suit la souris avec amortissement, et s'élève avec l'ascension :
   contre-plongée (t = 0) → quasi-zénithal (t = 1). La lumière passe du doré
   du matin au bleu de fin de journée sur le même intervalle.
   ============================================================================= */

const COLS = 22, ROWS = 14;
const SLATE_W = 0.34, SLATE_H = 0.56, SLATE_T = 0.018, OVERLAP = 0.5;
const PITCH = 0.62; // pente en radians (~35°)

const seeded = (s: number) => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };

function Slates() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = COLS * ROWS;

  const { matrices, colors } = useMemo(() => {
    const r = seeded(7);
    const m = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];
    const colors = new Float32Array(count * 3);
    const base = new THREE.Color('#4a525b');
    let i = 0;
    for (let row = 0; row < ROWS; row++) {
      const off = (row % 2) * (SLATE_W / 2);
      for (let col = 0; col < COLS; col++) {
        const x = (col - COLS / 2) * SLATE_W + off + (r() - 0.5) * 0.012;
        const y = row * SLATE_H * OVERLAP + (r() - 0.5) * 0.01;
        m.position.set(x, y, row * SLATE_T * 0.9 + (r() - 0.5) * 0.004);
        m.rotation.set((r() - 0.5) * 0.03, (r() - 0.5) * 0.02, (r() - 0.5) * 0.025);
        m.updateMatrix();
        matrices.push(m.matrix.clone());
        const l = 0.8 + r() * 0.45;
        const c = base.clone().multiplyScalar(l);
        colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
        i++;
      }
    }
    return { matrices, colors };
  }, [count]);

  return (
    <instancedMesh
      ref={(el) => {
        if (!el || mesh.current) return;
        mesh.current = el;
        const c = new THREE.Color();
        matrices.forEach((mat, i) => {
          el.setMatrixAt(i, mat);
          el.setColorAt(i, c.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]));
        });
        el.instanceMatrix.needsUpdate = true;
        if (el.instanceColor) el.instanceColor.needsUpdate = true;
      }}
      args={[undefined, undefined, count]}
    >
      <boxGeometry args={[SLATE_W - 0.012, SLATE_H, SLATE_T]} />
      <meshStandardMaterial roughness={0.92} metalness={0.05} />
    </instancedMesh>
  );
}

function Ridge() {
  return (
    <group position={[0, ROWS * SLATE_H * OVERLAP - 0.1, 0.16]}>
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[COLS * SLATE_W + 0.4, 0.14, 0.12]} />
        <meshStandardMaterial color="#7d8890" roughness={0.55} metalness={0.6} />
      </mesh>
      {/* joints debout du faîtage */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[(i - 4) * 0.9, 0.08, 0]}>
          <boxGeometry args={[0.03, 0.04, 0.14]} />
          <meshStandardMaterial color="#5c666d" roughness={0.5} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Roof() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    // suivi souris amorti, asymétrique : rapide vers la cible, lent au retour
    const tx = pointer.y * 0.06, ty = pointer.x * 0.12;
    const k = 1 - Math.pow(0.001, dt);
    g.rotation.x += (tx - g.rotation.x) * k * 0.6;
    g.rotation.y += (ty - g.rotation.y) * k * 0.6;
  });
  return (
    <group ref={group} position={[1.6, 0, 0]} rotation={[0, -0.42, 0]} scale={0.9}>
      <group rotation={[-PITCH, 0, 0]} position={[0, -1.6, 0]}>
        <Slates />
        <Ridge />
        {/* volige sous les ardoises, pour fermer la géométrie vue de biais */}
        <mesh position={[0, ROWS * SLATE_H * OVERLAP * 0.5, -0.02]}>
          <planeGeometry args={[COLS * SLATE_W + 0.6, ROWS * SLATE_H * OVERLAP + 0.8]} />
          <meshStandardMaterial color="#1e2126" roughness={1} />
        </mesh>
      </group>
    </group>
  );
}

const DAWN = new THREE.Color('#ffd9a8'), DUSK = new THREE.Color('#9fb3c8');
const SKY_DAWN = new THREE.Color('#e8c9a0'), SKY_DUSK = new THREE.Color('#3b4a5c');
const ACCENT = new THREE.Color(COULEUR_ACCENT);

function Rig() {
  const { camera, scene } = useThree();
  const sun = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.HemisphereLight>(null);
  const t = useRef(0);
  const target = useRef(0);

  useEffect(() => ascension.subscribe((v) => { target.current = v; }), []);

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.002, dt);
    t.current += (target.current - t.current) * k;
    const s = smoothstep(t.current);

    // Caméra : contre-plongée → quasi-zénithal. Elle monte et bascule.
    const radius = lerp(6.5, 7.5, s);
    const elev = lerp(0.12, 1.32, s); // angle d'élévation en radians
    camera.position.set(0, Math.sin(elev) * radius - 1.2, Math.cos(elev) * radius);
    camera.lookAt(0, lerp(0.4, 0.9, s), 0);

    // Lumière : rasante dorée du matin → haute et bleutée du soir
    const sunLight = sun.current;
    if (sunLight) {
      sunLight.position.set(lerp(-6, 2, s), lerp(1.2, 8, s), lerp(4, 2, s));
      sunLight.color.copy(DAWN).lerp(DUSK, s);
      sunLight.intensity = lerp(3.2, 1.8, s);
    }
    if (fill.current) {
      fill.current.color.copy(SKY_DAWN).lerp(SKY_DUSK, s);
      fill.current.intensity = lerp(1.3, 1.6, s);
    }
    if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(SKY_DAWN).lerp(SKY_DUSK, s);
  });

  return (
    <>
      <hemisphereLight ref={fill} args={['#e8c9a0', '#3a2a20', 0.9]} />
      <directionalLight ref={sun} position={[-6, 1.2, 4]} intensity={2.6} />
      {/* touche terre cuite depuis le bas, comme un reflet de tuiles voisines */}
      <pointLight position={[3, -2, 3]} color={ACCENT} intensity={0.35} distance={10} />
    </>
  );
}

export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ fov: 32, near: 0.1, far: 40, position: [0, -0.4, 6.5] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ scene }) => { scene.fog = new THREE.Fog('#e8c9a0', 7, 16); }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden
    >
      <Rig />
      <Roof />
    </Canvas>
  );
}
