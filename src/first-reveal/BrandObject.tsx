import { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useLoader, useThree } from "@react-three/fiber";
import { staticFile } from "remotion";
import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { k, useTime } from "./design";
import { logoContours } from "./logoContours";

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
const BrandSculpture = ({ t, finale }: { t: number; finale: boolean }) => {
  const logo = useLoader(
    THREE.TextureLoader,
    staticFile("brand/models-suite-logo.png"),
  );
  const geometry = useMemo(() => {
    const shapes = logoContours.outers.map((points) => {
      const shape = new THREE.Shape();
      const contour = new THREE.CatmullRomCurve3(
        points.map(([x, y]) => new THREE.Vector3(x, y, 0)),
        true,
        "centripetal",
      ).getPoints(Math.max(240, points.length * 3));
      contour.forEach(({ x, y }, i) =>
        i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y),
      );
      shape.closePath();
      return shape;
    });
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.018,
      bevelSegments: 8,
      curveSegments: 48,
    });
    geo.translate(0, 0, -0.1);
    const pos = geo.attributes.position;
    const uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      uv[i * 2] = pos.getX(i) / logoContours.width + 0.5;
      uv[i * 2 + 1] = pos.getY(i) / logoContours.height + 0.5;
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    const smooth = mergeVertices(geo, 0.00001);
    smooth.computeVertexNormals();
    geo.dispose();
    return smooth;
  }, []);
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
    <group rotation={rotation} scale={finale ? 0.8 : 1}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          attach="material-0"
          map={logo}
          alphaTest={0.01}
          alphaToCoverage
          color="white"
          metalness={0.16}
          roughness={0.3}
          envMap={env}
          envMapIntensity={1.2}
        />
        <meshStandardMaterial
          attach="material-1"
          color="#70C9E8"
          metalness={0.45}
          roughness={0.32}
          envMap={env}
          envMapIntensity={1.5}
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
      dpr={2}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ position: "absolute", top: finale ? 70 : 180, left: 0 }}
    >
      <Camera t={t} finale={finale} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 6]} color="#F5F8FB" intensity={4} />
      <directionalLight position={[-4, 1, 1]} color="#7EE7FF" intensity={3.2} />
      <pointLight position={[1, -1, 3]} color="#8FA7FF" intensity={18} />
      <BrandSculpture t={t} finale={finale} />
    </ThreeCanvas>
  );
};
