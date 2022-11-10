import { Box, Cone, Plane, useHelper, useTexture } from "@react-three/drei";
import {
  CameraHelper,
  RepeatWrapping,
  PointLightHelper,
  LinearEncoding,
  BufferAttribute,
} from "three";
import { Setup } from "../Wrapper";
import { useCallback, useRef, useState, useEffect } from "react";

export default {
  title: "3jsJourney/hauntedHouse",
  component: Box,
  decorators: [
    (storyFn, context) => (
      <Setup
        global={context.globals}
        ground={HauntedHouse.args.ground}
        axes={HauntedHouse.args.axes}
        grid={HauntedHouse.args.grid}
        lights={false}
      >
        {" "}
        {storyFn()}
      </Setup>
    ),
  ],
};

const Template = function HauntedHouse(...args) {
  /////////house
  const House = () => {
    return (
      <>
        <Box args={[4, 2.5, 4]} position-y={1.25} castShadow>
          <meshStandardMaterial />
        </Box>
        <Cone args={[3, 1, 4]} position={[0, 3, 0]} rotation-y={Math.PI / 4}>
          <meshStandardMaterial />
        </Cone>
      </>
    );
  };
  const Lights = () => {
    const [dLight, set] = useState();
    const shadowCam = useRef();
    useHelper(shadowCam, CameraHelper);
    console.log(dLight);
    return (
      <>
        <ambientLight intensity={0.3} />
        <directionalLight
          ref={set}
          position={[5, 7, -1]}
          color={"#c9c9c9"}
          intensity={1}
          // castShadow
          shadow-mapSize-height={256}
          shadow-mapSize-width={256}
        >
          {dLight && <directionalLightHelper args={[dLight, 1]} />}
          {/* <orthographicCamera
            ref={shadowCam}
            attach="shadow-camera"
            top={10}
            left={-10}
            right={10}
            bottom={-10}
            far={15}
          /> */}
        </directionalLight>
      </>
    );
  };
  const Graves = () => {
    const GravesCreator = useCallback(() => {
      const r = Math.random() * Math.PI * 2;
      const s = 6 + Math.random() * 3;
      const rotY = (Math.random() - 0.5) * 0.4;
      const rotX = (Math.random() - 0.5) * 0.4;
      return (
        <Box
          args={[0.5, 0.76, 0.2]}
          position={[Math.sin(r) * s, 0.3, Math.cos(r) * s]}
          rotation-y={rotY}
          rotation-z={rotX}
          castShadow
        >
          <meshStandardMaterial />
        </Box>
      );
    }, []);
    return (
      <>
        {[...new Array(50)].map((_, i) => (
          <GravesCreator key={i} />
        ))}
      </>
    );
  };
  const Floor = () => {
    return (
      <mesh receiveShadow>
        <cylinderBufferGeometry args={[10, 5, 0, 32]} position={[0, 5, 0]} />
        <meshStandardMaterial />
      </mesh>
    );
  };
  const Door = () => {
    const pLight = useRef();
    const door = useRef();
    const shadowCam = useRef();
    useHelper(shadowCam, CameraHelper);
    useEffect(() => {
      door.current.geometry.setAttribute(
        "uv2",
        new BufferAttribute(door.current.geometry.attributes.uv.array, 2)
      );
    }, [door]);
    useHelper(pLight, PointLightHelper, 1);
    const textures = useTexture({
      alphaMap: "/textures/door/alpha.jpg",
      aoMap: "/textures/door/ambientOcclusion.jpg",
      map: "/textures/door/color.jpg",
      displacementMap: "/textures/door/height.jpg",
      metalnessMap: "/textures/door/metalness.jpg",
      normalMap: "/textures/door/normal.jpg",
      roughnessMap: "/textures/door/roughness.jpg",
    });
    return (
      <>
        <Plane ref={door} args={[2, 2, 32, 32]} position={[0, 1, 2.1]}>
          <meshStandardMaterial
            {...textures}
            transparent
            displacementScale={[0.2]}
            normalMap-encoding={LinearEncoding}
            // aoMapIntensity={[2]}
            // wireframe={true}
          />
        </Plane>
        <pointLight
          ref={pLight}
          position={[0, 2, 3]}
          intensity={[1]}
          color={"yellow"}
          decay={[1]}
          castShadow
        >
          <perspectiveCamera ref={shadowCam} attach="shadow-camera" far={10} />
        </pointLight>
      </>
    );
  };
  return (
    <>
      <House />
      <Lights />
      <Graves />
      <Floor />
      <Door />
    </>
  );
};

export const HauntedHouse = Template.bind({});
HauntedHouse.args = {
  ground: true,
  axes: true,
  grid: true,
  lights: false,
};

HauntedHouse.parameters = {
  backgrounds: { disable: true },
};

HauntedHouse.storyName = "HauntedHouse";
