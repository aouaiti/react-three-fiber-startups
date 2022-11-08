import * as React from "react";
import { Setup } from "../Wrapper";
import { Box, SpotLight, useHelper } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { DirectionalLightHelper, CameraHelper } from "three";
import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default {
  title: "Staging/Lights",
  component: SpotLight,
  decorators: [
    (storyFn, context) => (
      <Setup
        global={context.globals}
        ground={LightsScene.args.ground}
        axes={LightsScene.args.axes}
        grid={LightsScene.args.grid}
      >
        {" "}
        {storyFn()}
      </Setup>
    ),
  ],
  argTypes: {
    stars: {
      name: "Lights",
      defaultValue: true,
      description: "display stars",
      control: { type: "boolean" },
    },
  },
};

const animateSpot = {
  init: {
    x: -3,
  },
  animate: {
    x: 3,
    transition: {
      x: {
        duration: 5,
      },
    },
  },
};

const animateBox = {
  animate: {
    rotateX: 3.14 * 2,
    rotateY: 3.14 * 2,
  },
};

const DLight = () => {
  const dLightRef = useRef(null);
  //currently (as far as i know) there is no drei or fiber elem that represents light's camera
  //so i used the imperative threejs way by extracting the scene element from the useThree hook
  //begin light camera
  const { scene } = useThree();
  useEffect(() => {
    if (!dLightRef) return;
    scene.add(new THREE.CameraHelper(dLightRef.current?.shadow?.camera));
  }, [dLightRef]);
  //end light camera
  useHelper(dLightRef, DirectionalLightHelper, 5, "blue");
  // useFrame((state) => console.log(state));
  return (
    <motion.group
      animate={{ type: "tween", rotateY: Math.PI * 2 }}
      transition={{ duration: 4, loop: Infinity, ease: "linear" }}
    >
      <motion.directionalLight
        ref={dLightRef}
        position={[-4, 1, 0]}
        variants={animateSpot}
        initial="init"
        // animate="animate"
        castShadow
        // animate={{ x: 4 }}
        transition={{ duration: 6 }}
      />
    </motion.group>
  );
};

const Template = function LightsScene(...args) {
  // console.log(args[0]);
  // const theme = args[1].globals.theme;

  console.log(args[0]);
  return (
    <>
      {/* <motion.group
        variants={animateSpot}
        initial="init"
        animate="animate"
        transition={{ duration: 5 }}
      >
        <SpotLight position={[1, 2, 1]} castShadow />
      </motion.group> */}
      <ambientLight intensity={0.5} color={"blue"} />
      {/* <hemisphereLight arg={[0x0f0, 0x0f0, 3]} /> */}
      <motion.group
        position={[0.5, 0.5, 0.5]}
        variants={animateBox}
        animate="animate"
        transition={{ duration: 1, flip: Infinity }}
      >
        <Box position={[0, 0, 0]} scale={0.5} castShadow receiveShadow>
          <meshStandardMaterial color={"red"} metalness={0.9} roughness={1} />
        </Box>
      </motion.group>
      <DLight />
    </>
  );
};

export const LightsScene = Template.bind({});
LightsScene.args = { ground: true, axes: true, grid: true };

LightsScene.parameters = {
  backgrounds: { disable: true },
};

LightsScene.storyName = "Lights";
