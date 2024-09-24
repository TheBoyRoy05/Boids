import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import Arrow from "./Arrow";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useControls } from "leva";

type BoidType = {
  position: Vector3;
  velocity: Vector3;
  alignment: Vector3;
  avoidance: Vector3;
  cohesion: Vector3;
  steering: Vector3;
};

interface BoidProps {
  boid: BoidType;
  scale: number;
  wanderCircle: boolean;
  wanderRadius: number;
  alignCircle: boolean;
  alignRadius: number;
  avoidCircle: boolean;
  avoidRadius: number;
  cohesionCircle: boolean;
  cohesionRadius: number;
  showVelocity: boolean;
  showSteering: boolean;
  model: string;
}

const Boid = (props: BoidProps) => {
  const {
    boid,
    scale,
    wanderCircle,
    wanderRadius,
    alignCircle,
    alignRadius,
    avoidCircle,
    avoidRadius,
    cohesionCircle,
    cohesionRadius,
    showVelocity,
    showSteering,
    model,
  } = props;
  const group = useRef<Group>(null!);
  const [relVelocity, setRelVelocity] = useState(new Vector3());
  const [relSteering, setRelSteering] = useState(new Vector3());

  const { scene } = useGLTF(`/src/assets/spaceship.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  useFrame(() => {
    const target = group.current.clone(false);
    target.lookAt(group.current.position.clone().add(boid.velocity));
    group.current.quaternion.slerp(target.quaternion, 0.1);
    group.current.position.copy(boid.position);

    setRelVelocity(new Vector3(0, 0, 1).multiplyScalar(boid.velocity.length()));
    setRelSteering(boid.steering.clone().applyQuaternion(target.quaternion.invert()));
  });

  const materialProps = useControls(
    "Glass",
    {
      thickness: { value: 5, min: 0, max: 20 },
      roughness: { value: 0, min: 0, max: 1, step: 0.1 },
      clearcoat: { value: 1, min: 0, max: 1, step: 0.1 },
      clearcoatRoughness: { value: 0, min: 0, max: 1, step: 0.1 },
      transmission: { value: 1, min: 0.9, max: 1, step: 0.01 },
      ior: { value: 1.25, min: 1, max: 2.3, step: 0.05 },
      envMapIntensity: { value: 25, min: 0, max: 100, step: 1 },
      color: "#000000",
    },
    { collapsed: true }
  );

  return (
    <group {...props} ref={group} position={boid.position}>
      {model == "SpaceShip" ? (
        <primitive
          object={clone}
          scale={scale * 0.32}
          rotation={[0, Math.PI / 2, 0, Math.PI / 2]}
        />
      ) : (
        <mesh scale={[scale, 2 * scale, scale]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry />
          {model == "Glass Cone" ? (
            <meshPhysicalMaterial {...materialProps} />
          ) : (
            <meshStandardMaterial color={"blue"} />
          )}
        </mesh>
      )}

      {showVelocity && (
        <Arrow origin={new Vector3(0, 0, 0)} direction={relVelocity} color={"white"} />
      )}
      {showSteering && (
        <Arrow
          origin={showVelocity ? relVelocity : new Vector3(0, 0, 0.03)}
          direction={relSteering}
          length={1}
          color={"red"}
          thickness={0.05}
        />
      )}

      <mesh visible={wanderCircle}>
        <sphereGeometry args={[wanderRadius, 32]} />
        <meshBasicMaterial color={"red"} wireframe />
      </mesh>

      <mesh visible={alignCircle}>
        <sphereGeometry args={[alignRadius, 32]} />
        <meshBasicMaterial color={"green"} wireframe />
      </mesh>

      <mesh visible={avoidCircle}>
        <sphereGeometry args={[avoidRadius, 32]} />
        <meshBasicMaterial color={"blue"} wireframe />
      </mesh>

      <mesh visible={cohesionCircle}>
        <sphereGeometry args={[cohesionRadius, 32]} />
        <meshBasicMaterial color={"yellow"} wireframe />
      </mesh>
    </group>
  );
};

export default Boid;
