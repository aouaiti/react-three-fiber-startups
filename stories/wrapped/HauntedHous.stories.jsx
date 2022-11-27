import { Box, Cone, Plane, useHelper, useTexture } from "@react-three/drei";
import {
  CameraHelper,
  RepeatWrapping,
  PointLightHelper,
  LinearEncoding,
  BufferAttribute,
  DirectionalLightHelper,
} from "three";
import { Setup } from "../Wrapper";
import { useCallback, useRef, useState, useEffect, use } from "react";
import { useFrame } from "@react-three/fiber";

export default {
  title: "3jsJourney/scenes/hauntedHouse",
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
    const walls = useRef();
    useEffect(() => {
      walls.current.geometry.setAttribute(
        "uv2",
        new BufferAttribute(walls.current.geometry.attributes.uv.array, 2)
      );
    }, [walls]);
    const textures = useTexture({
      aoMap: "/textures/bricks/ambientOcclusion.jpg",
      map: "/textures/bricks/color.jpg",
      normalMap: "/textures/bricks/normal.jpg",
      roughnessMap: "/textures/bricks/roughness.jpg",
    });
    return (
      <>
        <Box ref={walls} args={[4, 2.5, 4]} position-y={1.25} castShadow>
          <meshStandardMaterial
            {...textures}
            normalMap-encoding={LinearEncoding}
          />
        </Box>
        <Cone args={[3, 1, 4]} position={[0, 3, 0]} rotation-y={Math.PI / 4}>
          <meshStandardMaterial color={"firebrick"} />
        </Cone>
      </>
    );
  };
  const Lights = () => {
    const dLight = useRef();
    const shadowCam1 = useRef();
    useHelper(shadowCam1, CameraHelper);
    useHelper(dLight, DirectionalLightHelper);
    console.log(dLight);
    return (
      <>
        <ambientLight intensity={0.12} />
        <directionalLight
          ref={dLight}
          position={[0, 4, -2]}
          color={"#287ba5"}
          intensity={0.2}
          // castShadow
          shadow-mapSize-height={256}
          shadow-mapSize-width={256}
        >
          {/* <orthographicCamera
            ref={shadowCam1}
            attach='shadow-camera'
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
      const s = 4 + Math.random() * 3;
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
          <meshStandardMaterial color={"gray"} />
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
    const floor = useRef();
    useEffect(() => {
      floor.current.geometry.setAttribute(
        "uv2",
        new BufferAttribute(floor.current.geometry.attributes.uv.array, 2)
      );
    }, [floor]);
    const textures = useTexture({
      aoMap: "textures/grass/ambientOcclusion.jpg",
      map: "textures/grass/color.jpg",
      normalMap: "textures/grass/normal.jpg",
      roughnessMap: "textures/grass/roughness.jpg",
    });
    for (let x in textures) {
      textures[x].repeat.set(8, 8);
      textures[x].wrapS = RepeatWrapping;
      textures[x].wrapT = RepeatWrapping;
    }
    return (
      <mesh ref={floor} receiveShadow rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[20, 20]} />
        <meshStandardMaterial
          {...textures}
          normalMap-encoding={LinearEncoding}
        />
      </mesh>
    );
  };
  const Door = () => {
    const pLight = useRef();
    useEffect(() => {
      if (!pLight) return;
      pLight.current.shadow.camera.far = 10;
    }, [pLight]);
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
          args={["#ff7d46", 1, 7]}
          shadow-mapSize-height={256}
          shadow-mapSize-width={256}
          castShadow
        >
          {/* <perspectiveCamera ref={shadowCam} attach='shadow-camera' far={10} /> */}
        </pointLight>
      </>
    );
  };
  const Ghosts = () => {
    const g1 = useRef();
    const g2 = useRef();
    const g3 = useRef();
    useHelper(g1, PointLightHelper);
    useHelper(g2, PointLightHelper);
    useHelper(g3, PointLightHelper);
    useFrame((delta) => {
      // console.log(delta.clock.elapsedTime);
      const cl = delta.clock.elapsedTime;
      g1.current.position.x = Math.sin(cl) * (5 + Math.sin(cl * 3));
      g1.current.position.z = Math.cos(cl) * (5 + Math.sin(cl * 3));
      g2.current.position.x = Math.sin(-cl * 2) * (6 + Math.sin(cl * 5));
      g2.current.position.z = Math.cos(-cl * 2) * (6 + Math.sin(cl * 3));
      g3.current.position.x = Math.sin(cl) * 4 + Math.sin(cl * 7);
      g3.current.position.z = Math.cos(cl) * 4;
      g3.current.position.y = Math.abs(Math.sin(cl) * 2);
    });
    return (
      <>
        <pointLight castShadow ref={g1} args={["blue", 1, 3]} position-y={1} />
        <pointLight castShadow ref={g2} args={["green", 1, 3]} position-y={1} />
        <pointLight castShadow ref={g3} args={["red", 1, 3]} />
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
      <Ghosts />
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
