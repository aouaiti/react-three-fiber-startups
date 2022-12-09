import * as React from "react";
import { Vector3, PCFSoftShadowMap } from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Plane } from "@react-three/drei";
import styles from "./wrapper.module.css";

export const Setup = ({
  transparent = false,
  dom = false,
  children,
  ground,
  global,
  axes,
  grid,
  fog = true,
  cameraFov = 75,
  cameraPosition = new Vector3(4.5, 2.5, 4.5),
  controls = true,
  lights = true,
  ...restProps
}) => {
  const theme = global.theme === "light" ? "#fff" : "#121212";
  const fogtheme = global.theme === "light" ? "#87CEEB" : "#000";

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100vh",
          position: "fixed",
          // background: "#000",
        }}
      >
        <Canvas
          gl={{ alpha: true }}
          shadows
          camera={{ position: cameraPosition, fov: cameraFov }}
          {...restProps}
        >
          {children}
          {lights && (
            <>
              <ambientLight intensity={0.3} />
              <pointLight castShadow intensity={1} position={[0, 6, 0]} />
            </>
          )}
          {fog && <fog attach="fog" args={[theme, 1, 15]} />}
          {ground && (
            <Plane
              position={[0, -0.001, 0]}
              rotation-x={-Math.PI / 2}
              args={[200, 200, 1, 1]}
              receiveShadow
            >
              <meshStandardMaterial color={theme} wireframe={false} />
            </Plane>
          )}
          {axes && <axesHelper args={[10]} />}
          {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[20, 20]} />
      <meshBasicMaterial attach="material" color="#121212" />
    </mesh> */}
          {grid && <gridHelper args={[30, 30]} position={[0, 0.1, 0]} />}
          {controls && <OrbitControls makeDefault />}
        </Canvas>
      </div>
      {dom && (
        <div>
          <div className={styles.section1}>
            <p className={styles.text}>Section 1</p>
          </div>
          <div className={styles.section2}>
            <p className={styles.text}>Section 2</p>
          </div>
          <div className={styles.section3}>
            <p className={styles.text}>Section 3</p>
          </div>
        </div>
      )}
    </>
  );
};
