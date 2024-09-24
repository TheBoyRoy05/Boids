# Boids Simulation

Boids are a simple but fascinating simulation of flocking behavior, first introduced by Craig Reynolds in 1986. The idea is to simulate the collective movement of birds, fish, or other animals that naturally flock together in groups. The term "boid" comes from the word "bird," but it applies to any entity that behaves in this collective, flock-like manner.

## Significance

Boids are an elegant demonstration of how complex, lifelike group behavior can emerge from simple rules applied to individual agents. Despite the simplicity of the underlying algorithm, boids can simulate realistic movements such as swarming, avoiding obstacles, and following leaders. The cool part is that no central control is needed; each boid only follows a few simple rules to interact with its neighbors.

## The Algorithm

The Boids algorithm is based on three fundamental rules:
1. **Alignment**: Boids try to match the direction and speed of nearby boids.
2. **Avoidance**: Boids avoid collisions with other boids.
3. **Cohesion**: Boids steer towards the average position of nearby boids.

When these rules are combined, boids form cohesive, dynamic groups that move fluidly through space. This simulation allows for interesting variations in behavior depending on how much weight is given to each rule.

In this project, we've extended the algorithm with additional features like mouse attraction, steering forces, and 3D controls, allowing you to explore and tweak the behavior of the boids interactively using the Leva controls panel.

## Features
The `Boids` component includes the following features:

### Boundary Settings
- `debug`: Determines whether or not to show the bounding box.
- `x`, `y`, `z`: Determines the size of the bounding box.
- `AURA_X`, `AURA_Y`, `AURA_Z`: Numeric values defining the boundaries in each axis direction.
- `FREEDOM`: A boolean value indicating if boids have freedom to move beyond boundaries.

### General Settings
- `PAUSE`: A boolean value indicating if the simulation is paused.
- `NUM_BOIDS`: A numeric value representing the number of boids in the simulation.
- `SCALE`: A numeric value defining the scale of the boids.
- `MIN_SPEED`, `MAX_SPEED`: Numeric values defining the minimum and maximum speeds of the boids.
- `MAX_STEERING`: A numeric value representing the maximum steering of the boids.
- `MODEL`: A string value representing the model type of the boids.

### Boid Rules
- `threeD`: A boolean value indicating whether the simulation is in 3D.
- `ALIGNMENT`, `AVOIDANCE`, `COHESION`: Boolean values representing different rules for boid behavior.

### Wander
- `WANDER_CIRCLE`: A boolean value determining if boids move in a circular wander pattern.
- `WANDER_RADIUS`: A numeric value defining the strength of the wander behavior.

### Alignment
- `ALIGN_CIRCLE`: Determines if each boid should show the sphere in which they check alignment.
- `ALIGN_RADIUS`: A numeric value defining the radius for alignment.
- `ALIGN_STRENGTH`: A numeric value representing the strength of alignment behavior.

### Avoidance
- `AVOID_CIRCLE`: Determines if each boid should show the sphere in which they check avoidance.
- `AVOID_RADIUS`: A numeric value defining the radius for avoidance behavior.
- `AVOID_STRENGTH`: A numeric value representing the strength of avoidance behavior.

### Cohesion
- `COHESION_CIRCLE`: Determines if each boid should show the sphere in which they check cohesion.
- `COHESION_RADIUS`: A numeric value defining the radius for cohesion behavior.
- `COHESION_STRENGTH`: A numeric value representing the strength of cohesion behavior.

### Mouse
- `MOUSE_ATTRACTION`: A dropdown with options `"Always"`, `"Click"`, and `"Never"`, controlling when the boids are attracted to the mouse cursor: 
  - `"Always"` makes boids continuously follow the mouse
  - `"Click"` only attracts them when the mouse is clicked
  - `"Never"` disables mouse attraction
- `MOUSE_STRENGTH`: A numeric value which adjusts the strength of the boids' attraction to the mouse.

### Arrows
- `SHOW_VELOCITY`: A boolean value that, when enabled, displays arrows showing the velocity of each boid.
- `SHOW_STEERING`: A boolean value that, when enabled, displays arrows showing the current steering force being applied to each boid.

## Usage
To use the `Boids` component, ensure you have the necessary dependencies installed and import the component into your application. You can then customize the boid behavior and appearance by adjusting the control settings provided.

## Dependencies
The `Boids` component relies on the following dependencies:
- `three`: A library for 3D graphics rendering.
- `leva`: A library for creating adjustable UI controls.
- `@react-three/fiber`: A library for creating 3D scenes in React.

## File Structure
- `Scene.tsx`: Renders the 3D scene for displaying the boids.
- `Boids.tsx`: Contains the main logic for simulating boid behavior.
- `Boid.tsx`: Defines the individual boid entity.

Feel free to explore and modify the `Boids` component to suit your specific requirements.

Happy Flocking!

<p align="center"><img src="./src/assets/Boids_Demo.gif" alt="Boids Demo" width="600"/></p>