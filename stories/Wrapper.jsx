import * as React from "react";
import { Vector3 } from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Plane } from "@react-three/drei";

export const Setup = ({
  children,
  ground,
  global,
  axes,
  grid,
  cameraFov = 75,
  cameraPosition = new Vector3(1.5, 0.5, 1.5),
  controls = true,
  lights = true,
  ...restProps
}) => {
  const theme = global.theme === "light" ? "#fff" : "#121212";
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        // background: "#000",
      }}
    >
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: cameraFov }}
        {...restProps}
      >
        {children}
        {lights && (
          <>
            <ambientLight intensity={0.8} />
            <pointLight intensity={1} position={[0, 6, 0]} />
          </>
        )}
        <fog attach="fog" args={[theme, 0, 40]} />
        {ground && (
          <Plane
            position={[0, -0.1, 0]}
            rotation-x={-Math.PI / 2}
            args={[100, 100, 1, 1]}
            receiveShadow
          >
            <meshStandardMaterial color={theme} wireframe={false} />
          </Plane>
        )}
        {axes && <axesHelper />}
        {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[20, 20]} />
      <meshBasicMaterial attach="material" color="#121212" />
    </mesh> */}
        {/* {grid && <gridHelper args={[30, 30]} position={[0, -0.001, 0]} />} */}
        {controls && <OrbitControls makeDefault />}
      </Canvas>
    </div>
  );
};
