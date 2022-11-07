import * as React from "react";
import { Setup } from "../Wrapper";
import { Box, SpotLight, useHelper } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { PointLightHelper } from "three";
import { useRef } from "react";

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

const Lighteu = () => {
  const pLightRef = useRef(null);
  useHelper(pLightRef, PointLightHelper, 1, "red");
  return (
    <motion.group
      animate={{ type: "tween", rotateY: Math.PI * 2 }}
      transition={{ duration: 4, loop: Infinity, ease: "linear" }}
    >
      <motion.pointLight
        ref={pLightRef}
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
      <Lighteu />
    </>
  );
};

export const LightsScene = Template.bind({});
LightsScene.args = { ground: true, axes: true, grid: true };

LightsScene.parameters = {
  backgrounds: { disable: true },
};

LightsScene.storyName = "Lights";
