import * as React from "react";
import { Setup } from "../Wrapper";
import { Box, useHelper } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { DirectionalLightHelper, CameraHelper } from "three";
import { useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useControls, folder } from "leva";

export default {
  title: "Staging/Lights",
  component: Box,
  decorators: [
    (storyFn, context) => (
      <Setup
        global={context.globals}
        ground={LightsScene.args.ground}
        axes={LightsScene.args.axes}
        grid={LightsScene.args.grid}
        lights={LightsScene.args.lights}
      >
        {" "}
        {storyFn()}
      </Setup>
    ),
  ],
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
  const { top, left, right, bottom, far } = useControls({
    shadowCamera: folder({
      top: {
        value: 5,
        min: 0.5,
        max: 5,
        step: 0.1,
        // onChange: (v) => {
        //   fctCam();
        // },
      },
      bottom: {
        value: -5,
        min: -5,
        max: -0.5,
        step: 0.1,
        // onChange: (v) => {
        //   fctCam();
        // },
      },
      left: {
        value: -5,
        min: -5,
        max: -0.5,
        step: 0.1,
        // onChange: (v) => {
        //   fctCam();
        // },
      },
      right: {
        value: 5,
        min: 0.5,
        max: 5,
        step: 0.1,
        // onChange: (v) => {
        //   fctCam();
        // },
      },
      far: {
        value: 10,
        min: 1,
        max: 50,
        step: 0.1,
        // onChange: (v) => {
        //   fctCam();
        // },
      },
    }),
  });

  const dLightRef = useRef(null);
  const [camHelp, setCamHelp] = useState();
  const shadowCam = useRef();
  // if (dLightRef.current) dLightRef.current.shadow.camera.top = width;
  //currently (as far as i know) there is no drei or fiber elem that represents light's camera
  //so i used the imperative threejs way by extracting the scene element from the useThree hook
  //begin light camera
  const { scene } = useThree();

  //end light camera
  useHelper(dLightRef, DirectionalLightHelper, 1, "blue");
  useHelper(shadowCam, CameraHelper);
  useFrame((gl) => {
    shadowCam.current.updateProjectionMatrix();
  });
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
      >
        <orthographicCamera
          ref={shadowCam}
          attach="shadow-camera"
          top={top}
          left={left}
          right={right}
          bottom={bottom}
          far={far}
        />
      </motion.directionalLight>
    </motion.group>
  );
};

const Template = function LightsScene(...args) {
  // console.log(args[0]);
  // const theme = args[1].globals.theme;

  // console.log(args[0]);
  return (
    <>
      <ambientLight intensity={0.5} color={"white"} />
      <motion.group
        position={[0, 0.5, 0]}
        variants={animateBox}
        animate="animate"
        transition={{ duration: 1, flip: Infinity }}
      >
        <Box position={[0, 0, 0]} scale={0.5} castShadow receiveShadow>
          <meshStandardMaterial color={"red"} metalness={0.9} roughness={1} />
        </Box>
      </motion.group>
      <DLight {...args[0]} />
    </>
  );
};

export const LightsScene = Template.bind();
LightsScene.args = {
  ground: true,
  axes: true,
  grid: true,
  lights: false,
};

LightsScene.parameters = {
  backgrounds: { disable: true },
};

LightsScene.storyName = "Lights";
