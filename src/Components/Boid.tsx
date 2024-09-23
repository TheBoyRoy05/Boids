import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Vector3 } from "three";

interface BoidProps {
  position: Vector3;
  velocity: Vector3;
  scale: number;
  wanderCircle: boolean;
  wanderRadius: number;
  alignCircle: boolean;
  alignRadius: number;
  avoidCircle: boolean;
  avoidRadius: number;
  cohesionCircle: boolean;
  cohesionRadius: number;
}

const Boid = (props: BoidProps) => {
  const {
    position,
    velocity,
    scale,
    wanderCircle,
    wanderRadius,
    alignCircle,
    alignRadius,
    avoidCircle,
    avoidRadius,
    cohesionCircle,
    cohesionRadius,
  } = props;
  const group = useRef<Group>(null!);

  useFrame(() => {
    const target = group.current.clone(false);
    target.lookAt(group.current.position.clone().add(velocity));
    group.current.quaternion.slerp(target.quaternion, 0.1);
    group.current.position.copy(position);
  });

  return (
    <group {...props} ref={group} position={position}>
      <mesh scale={[scale, 2*scale, scale]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry />
        <meshStandardMaterial color={"blue"} />
      </mesh>

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
