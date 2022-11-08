import * as React from "react";
import { Setup } from "../Wrapper";
import { Box, SpotLight, useHelper } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { DirectionalLightHelper, CameraHelper } from "three";
import { useRef, useEffect, useCallback, useState } from "react";
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
    top: {
      name: "top",
      defaultValue: 5,
      description: "display stars",
      control: { type: "range", min: 1, max: 5, step: 0.01 },
    },
    left: {
      name: "left",
      defaultValue: -5,
      description: "display stars",
      control: { type: "range", min: -5, max: -1, step: 0.01 },
    },
    right: {
      name: "right",
      defaultValue: 5,
      description: "display stars",
      control: { type: "range", min: 1, max: 5, step: 0.01 },
    },
    bottom: {
      name: "bottom",
      defaultValue: -5,
      description: "display stars",
      control: { type: "range", min: -5, max: -1, step: 0.01 },
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

const DLight = ({ top, left, right, bottom }) => {
  const dLightRef = useRef(null);
  const [camHelp, setCamHelp] = useState();
  //currently (as far as i know) there is no drei or fiber elem that represents light's camera
  //so i used the imperative threejs way by extracting the scene element from the useThree hook
  //begin light camera
  const { scene } = useThree();
  // dLightRef.current.shadow.camera.top = 1;
  useEffect(() => {
    if (!dLightRef) return;
    // console.log(dLightRef.current.shadow.camera);
    setCamHelp(new THREE.CameraHelper(dLightRef.current?.shadow?.camera));
  }, [dLightRef]);
  useEffect(() => {
    // if (camHelp) return;
    dLightRef.current.shadow.camera.far = 7;
    dLightRef.current.shadow.camera.top = top;
    dLightRef.current.shadow.camera.left = left;
    dLightRef.current.shadow.camera.right = right;
    dLightRef.current.shadow.camera.bottom = bottom;
    setCamHelp(new THREE.CameraHelper(dLightRef.current.shadow.camera));
    scene.add(camHelp);
    console.log(camHelp);
    //TODO fix infinite renders
    return () => scene.remove(camHelp);
  }, [top, left, right, camHelp]);

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
        initial='init'
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

  // console.log(args[0]);
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
        animate='animate'
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

export const LightsScene = Template.bind({});
LightsScene.args = {
  ground: true,
  axes: true,
  grid: true,
  top: 5,
  left: -5,
  right: 5,
  bottom: -5,
};

LightsScene.parameters = {
  backgrounds: { disable: true },
};

LightsScene.storyName = "Lights";
