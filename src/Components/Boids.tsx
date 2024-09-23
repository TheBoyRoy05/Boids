import { Plane, Raycaster, Vector2, Vector3 } from "three";
import Boid from "./Boid";
import { useControls } from "leva";
import { useEffect, useMemo, useRef } from "react";
import { randFloat } from "three/src/math/MathUtils.js";
import { useFrame, useThree } from "@react-three/fiber";

interface BoidsProps {
  boundaries: {
    x: number;
    y: number;
    z: number;
  };
}

const Boids = ({ boundaries }: BoidsProps) => {
  const { camera } = useThree();
  const raycaster = useRef(new Raycaster());
  const mouse = useRef(new Vector2());

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { PAUSE, NUM_BOIDS, SCALE, MIN_SPEED, MAX_SPEED, MAX_STEERING } = useControls(
    "General settings",
    {
      PAUSE: { value: false },
      NUM_BOIDS: { value: 100, min: 1, max: 100 },
      SCALE: { value: 0.6, min: 0.1, max: 1 },
      MIN_SPEED: { value: 0.1, min: 0, max: 10, step: 0.1 },
      MAX_SPEED: { value: 1.4, min: 0, max: 10, step: 0.1 },
      MAX_STEERING: { value: 0.3, min: 0, max: 1, step: 0.01 },
    },
    { collapsed: true }
  );

  const { threeD, ALIGNEMENT, AVOIDANCE, COHESION } = useControls(
    "Boid Rules",
    {
      threeD: { value: true },
      ALIGNEMENT: { value: true },
      AVOIDANCE: { value: true },
      COHESION: { value: true },
    },
    { collapsed: true }
  );

  const { FREEDOM, AURA_X, AURA_Y, AURA_Z } = useControls(
    "Boundary Settings",
    {
      FREEDOM: { value: false },
      AURA_X: { value: 1, min: 1, max: 10, step: 1 },
      AURA_Y: { value: 1, min: 1, max: 10, step: 1 },
      AURA_Z: { value: 1, min: 1, max: 10, step: 1 },
    },
    { collapsed: true }
  );

  const { WANDER_RADIUS, WANDER_CIRCLE } = useControls(
    "Wander",
    {
      WANDER_CIRCLE: false,
      WANDER_RADIUS: { value: 2, min: 1, max: 10, step: 1 },
    },
    { collapsed: true }
  );

  const { ALIGN_RADIUS, ALIGN_STRENGTH, ALIGN_CIRCLE } = useControls(
    "Alignment",
    {
      ALIGN_CIRCLE: false,
      ALIGN_RADIUS: { value: 4, min: 0, max: 10, step: 0.1 },
      ALIGN_STRENGTH: { value: 2, min: 0, max: 10, step: 1 },
    },
    { collapsed: true }
  );

  const { AVOID_RADIUS, AVOID_STRENGTH, AVOID_CIRCLE } = useControls(
    "Avoidance",
    {
      AVOID_CIRCLE: false,
      AVOID_RADIUS: { value: 2, min: 0, max: 10 },
      AVOID_STRENGTH: { value: 2, min: 0, max: 10, step: 1 },
    },
    { collapsed: true }
  );

  const { COHESION_RADIUS, COHESION_STRENGTH, COHESION_CIRCLE } = useControls(
    "Cohesion",
    {
      COHESION_CIRCLE: false,
      COHESION_RADIUS: { value: 5, min: 0, max: 10 },
      COHESION_STRENGTH: { value: 3, min: 0, max: 10, step: 1 },
    },
    { collapsed: true }
  );

  const { MOUSE_ATTRACTION, MOUSE_STRENGTH } = useControls(
    "Mouse Attraction",
    {
      MOUSE_ATTRACTION: false,
      MOUSE_STRENGTH: { value: 1, min: 0, max: 10, step: 1 },
    },
    { collapsed: true }
  );

  const boids = useMemo(() => {
    return Array.from({ length: NUM_BOIDS }).map(() => ({
      position: new Vector3(
        randFloat(-boundaries.x / 2, boundaries.x / 2),
        randFloat(-boundaries.y / 2, boundaries.y / 2),
        threeD ? randFloat(-boundaries.z / 2, boundaries.z / 2) : 0
      ),
      velocity: new Vector3(0, 0, 0),
      wander: randFloat(0, Math.PI * 2),
      horizWander: randFloat(0, Math.PI * 2),
    }));
  }, [NUM_BOIDS, boundaries, threeD]);

  useFrame((_, delta) => {
    for (let i = 0; i < boids.length; i++) {
      const boid = boids[i];

      const limits = new Vector3();
      const wander = new Vector3();
      const horizWander = new Vector3();
      const alignment = new Vector3();
      const avoidance = new Vector3();
      const cohesion = new Vector3();
      const steering = new Vector3();

      // WANDER
      boid.wander += randFloat(-0.05, 0.05);
      wander.set(Math.cos(boid.wander), Math.sin(boid.wander), 0);
      wander.normalize();
      wander.multiplyScalar(WANDER_RADIUS);

      horizWander.set(Math.cos(boid.horizWander), 0, Math.sin(boid.horizWander));
      horizWander.normalize();
      horizWander.multiplyScalar(WANDER_RADIUS);

      if (MOUSE_ATTRACTION) {
        const intersection = new Vector3();
        const plane = new Plane(new Vector3(0, 0, 1), 0);
        raycaster.current.setFromCamera(mouse.current, camera);
        raycaster.current.ray.intersectPlane(plane, intersection);

        const diff = intersection.sub(boid.position);
        diff.normalize();
        diff.multiplyScalar(MOUSE_STRENGTH);
        steering.add(diff);
      }

      // LIMITS
      if (Math.abs(boid.position.x) + AURA_X > boundaries.x / 2) {
        limits.x = -boid.position.x;
        boid.wander += Math.PI;
      }
      if (Math.abs(boid.position.y) + AURA_Y > boundaries.y / 2) {
        limits.y = -boid.position.y;
        boid.wander += Math.PI;
      }
      if (Math.abs(boid.position.z) + AURA_Z > boundaries.z / 2) {
        limits.z = -boid.position.z;
        boid.horizWander += Math.PI;
      }

      limits.normalize();
      limits.multiplyScalar(50);

      let totalCohesion = 0;

      // Loop through all boids
      for (let j = 0; j < boids.length; j++) {
        if (j === i) continue; // Skip the current boid

        const other = boids[j];
        const distance = boid.position.distanceTo(other.position);

        // ALIGNEMENT
        if (distance > 0 && distance < ALIGN_RADIUS) {
          const copy = other.velocity.clone();
          copy.normalize();
          copy.divideScalar(distance);
          alignment.add(copy);
        }

        // AVOID
        if (distance > 0 && distance < AVOID_RADIUS) {
          const diff = boid.position.clone().sub(other.position);
          diff.normalize();
          diff.divideScalar(distance);
          avoidance.add(diff);
        }

        // COHESION
        if (distance > 0 && distance < COHESION_RADIUS) {
          cohesion.add(other.position);
          totalCohesion++;
        }
      }

      // APPLY FORCES
      steering.add(wander);
      if (!FREEDOM) steering.add(limits);
      if (threeD) steering.add(horizWander);

      if (ALIGNEMENT) {
        alignment.normalize();
        alignment.multiplyScalar(ALIGN_STRENGTH);
        steering.add(alignment);
      }

      if (AVOIDANCE) {
        avoidance.normalize();
        avoidance.multiplyScalar(AVOID_STRENGTH);
        steering.add(avoidance);
      }

      if (COHESION && totalCohesion > 0) {
        cohesion.divideScalar(totalCohesion);
        cohesion.sub(boid.position);
        cohesion.normalize();
        cohesion.multiplyScalar(COHESION_STRENGTH);
        steering.add(cohesion);
      }

      steering.clampLength(0, MAX_STEERING * delta);
      if (!PAUSE) {
        boid.velocity.add(steering);
        boid.velocity.clampLength(MIN_SPEED / 10, MAX_SPEED / 10);
        boid.position.add(boid.velocity);
      }
    }
  });

  return (
    <>
      {boids.map((boid, index) => (
        <Boid
          key={index}
          position={boid.position}
          velocity={boid.velocity}
          scale={SCALE}
          wanderCircle={WANDER_CIRCLE}
          wanderRadius={WANDER_RADIUS}
          alignCircle={ALIGN_CIRCLE}
          alignRadius={ALIGN_RADIUS}
          avoidCircle={AVOID_CIRCLE}
          avoidRadius={AVOID_RADIUS}
          cohesionCircle={COHESION_CIRCLE}
          cohesionRadius={COHESION_RADIUS}
        />
      ))}
    </>
  );
};

export default Boids;
