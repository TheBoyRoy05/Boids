import { useControls } from "leva"

const Boid = () => {
  const { color } = useControls({ color: "blue" })

  return (
    <mesh scale={[1, 2, 1]}>
      <coneGeometry />
      <meshStandardMaterial color={color}/>
    </mesh>
  )
}

export default Boid