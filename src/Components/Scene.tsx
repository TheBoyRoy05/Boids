import { useControls } from "leva";
import Boids from "./Boids";
import { useEffect, useState } from "react";
import { DoubleSide } from "three";
import { OrbitControls } from "@react-three/drei";

const Scene = () => {
  const boundaries = useControls(
    "Boundaries",
    {
      debug: true,
      x: { value: 48, min: 0, max: 38 },
      y: { value: 27, min: 0, max: 27 },
      z: { value: 20, min: 0, max: 40 },
    },
    { collapsed: true }
  );

  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  const scaleX = Math.max(0.5, size[0] / 1920);
  const scaleY = Math.max(0.5, size[1] / 1080);

  const responsiveBoundaries = {
    x: boundaries.x * scaleX,
    y: boundaries.y * scaleY,
    z: boundaries.z,
  };

  useEffect(() => {
    let timeout: number | undefined;
    function updateSize() {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSize([window.innerWidth, window.innerHeight]);
      }, 50);
    }
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <>
      <directionalLight position={[2, 0, 0]} intensity={0.8} />
      <ambientLight intensity={0.7} />
      <Boids
        boundaries={{
          x: responsiveBoundaries.x,
          y: responsiveBoundaries.y,
          z: responsiveBoundaries.z,
        }}
      />
      <mesh visible={boundaries.debug}>
        <boxGeometry
          args={[responsiveBoundaries.x, responsiveBoundaries.y, responsiveBoundaries.z]}
        />
        <meshStandardMaterial color="orange" transparent opacity={0.5} side={DoubleSide} />
      </mesh>
      <OrbitControls />
    </>
  );
};

export default Scene;
