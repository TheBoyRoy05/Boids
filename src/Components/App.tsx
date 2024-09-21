import { Canvas } from "@react-three/fiber"
import Boids from "./Boids"

const App = () => {
  return (
    <Canvas>
      <directionalLight position={[2, 0, 0]} intensity={0.8}/>
      <ambientLight  intensity={0.7}/>
      <Boids />
    </Canvas>
  )
}

export default App