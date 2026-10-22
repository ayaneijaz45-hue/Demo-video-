import { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useLoader, useThree } from "@react-three/fiber";
import { staticFile } from "remotion";
import * as THREE from "three";
import { k, useTime } from "./design";

const Camera = ({ t, finale }: { t: number; finale: boolean }) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(
    k(t, 0, 1.8, finale ? -1.9 : 2.6, 0),
    k(t, 0, 2.2, finale ? 0.8 : 1.6, 0.15),
    k(t, 0, 2.3, 6.7, 7.5),
  );
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
  return null;
};
const Coin = ({ t }: { t: number }) => {
  const logo = useLoader(
    THREE.TextureLoader,
    staticFile("brand/models-suite-logo.png"),
  );
  const env = useMemo(() => {
    const w = 256,
      h = 128,
      data = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const stripe =
          Math.exp(-Math.pow((x / w - 0.22) / 0.04, 2)) +
          Math.exp(-Math.pow((x / w - 0.74) / 0.055, 2)) * 0.8;
        const horizon = Math.exp(-Math.pow((y / h - 0.4) / 0.16, 2));
        const i = (y * w + x) * 4;
        data[i] = Math.min(255, 12 + stripe * horizon * 190);
        data[i + 1] = Math.min(255, 20 + stripe * horizon * 235);
        data[i + 2] = Math.min(255, 35 + stripe * horizon * 255);
        data[i + 3] = 255;
      }
    const tx = new THREE.DataTexture(data, w, h);
    tx.mapping = THREE.EquirectangularReflectionMapping;
    tx.colorSpace = THREE.SRGBColorSpace;
    tx.needsUpdate = true;
    return tx;
  }, []);
  logo.colorSpace = THREE.SRGBColorSpace;
  const rotation: [number, number, number] = [
    k(t, 0, 1.6, 0.5, -0.02),
    k(t, 0, 2.1, -0.8, 0.05),
    k(t, 0, 2, -0.32, 0.04),
  ];
  return (
    <group rotation={rotation}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.57, 1.57, 0.25, 96]} />
        <meshStandardMaterial
          color="#91BED8"
          envMap={env}
          envMapIntensity={2.3}
          metalness={0.96}
          roughness={0.19}
        />
      </mesh>
      <mesh position={[0, 0, 0.13]}>
        <circleGeometry args={[1.49, 96]} />
        <meshStandardMaterial
          color="#D9F0FC"
          metalness={0.24}
          roughness={0.27}
          envMap={env}
        />
      </mesh>
      <mesh position={[0, 0, 0.141]}>
        <planeGeometry args={[2.25, 2.25]} />
        <meshBasicMaterial
          map={logo}
          transparent
          alphaTest={0.01}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.11]}>
        <torusGeometry args={[1.55, 0.018, 8, 96]} />
        <meshBasicMaterial color="#7EE7FF" />
      </mesh>
      <mesh position={[0, 0, -0.14]}>
        <circleGeometry args={[1.49, 96]} />
        <meshStandardMaterial
          color="#152B45"
          metalness={0.9}
          roughness={0.25}
          envMap={env}
        />
      </mesh>
    </group>
  );
};

export const BrandObject = ({ finale = false }: { finale?: boolean }) => {
  const t = useTime();
  return (
    <ThreeCanvas
      width={1080}
      height={1050}
      camera={{ fov: 35, position: [0, 0, 7] }}
      dpr={1}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ position: "absolute", top: finale ? 190 : 180, left: 0 }}
    >
      <Camera t={t} finale={finale} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 6]} color="#F5F8FB" intensity={4} />
      <directionalLight position={[-4, 1, 1]} color="#7EE7FF" intensity={3.2} />
      <pointLight position={[1, -1, 3]} color="#8FA7FF" intensity={18} />
      <Coin t={t} />
    </ThreeCanvas>
  );
};
