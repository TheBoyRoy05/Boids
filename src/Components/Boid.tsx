import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group, Vector3 } from "three";
import Arrow from "./Arrow";

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
  } = props;
  const group = useRef<Group>(null!);
  const [relVelocity, setRelVelocity] = useState(new Vector3());
  const [relSteering, setRelSteering] = useState(new Vector3());

  useFrame(() => {
    const target = group.current.clone(false);
    target.lookAt(group.current.position.clone().add(boid.velocity));
    group.current.quaternion.slerp(target.quaternion, 0.1);
    group.current.position.copy(boid.position);

    setRelVelocity(new Vector3(0, 0, 1).multiplyScalar(boid.velocity.length()));
    setRelSteering(boid.steering.clone().applyQuaternion(target.quaternion.invert()));
  });

  return (
    <group {...props} ref={group} position={boid.position}>
      <mesh scale={[scale, 2 * scale, scale]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry />
        <meshStandardMaterial color={"blue"} />
      </mesh>

      {showVelocity && (
        <Arrow origin={new Vector3(0, 0, 0)} direction={relVelocity} color={"white"} />
      )}
      {showSteering && <Arrow
        origin={showVelocity ? relVelocity: new Vector3(0, 0, 0.03)}
        direction={relSteering}
        length={1}
        color={"red"}
        thickness={0.05}
      />}

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
