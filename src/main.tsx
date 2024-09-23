import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Scene from "./Components/Scene.tsx";
import "./index.css";
import { Leva } from "leva";
import { Canvas } from "@react-three/fiber";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Leva />
    <Canvas camera={{position: [0, 0, -30], fov: 45}}>
      <Scene />
    </Canvas>
  </StrictMode>
);
