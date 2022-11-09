import * as React from "react";
import { Setup } from "../Wrapper";
import { Box, useHelper } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { DirectionalLightHelper, CameraHelper } from "three";
import { useRef, useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
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

const DLight = ({ top, left, right, bottom }) => {
  const { widtht, widthl, widthr, widthb } = useControls({
    camera: folder({
      widtht: {
        value: 5,
        min: 1,
        max: 5,
        step: 0.5,
        // onChange: (v) => {
        //   fctCam();
        // },
      },
      widthb: {
        value: -5,
        min: -5,
        max: -1,
        step: 0.5,
        // onChange: (v) => {
        //   fctCam();
        // },
      },
      widthl: {
        value: -5,
        min: -5,
        max: -1,
        step: 0.5,
        // onChange: (v) => {
        //   fctCam();
        // },
      },
      widthr: {
        value: 5,
        min: 1,
        max: 5,
        step: 0.5,
        // onChange: (v) => {
        //   fctCam();
        // },
      },
    }),
  });

  const dLightRef = useRef(null);
  const [camHelp, setCamHelp] = useState();
  // if (dLightRef.current) dLightRef.current.shadow.camera.top = width;
  //currently (as far as i know) there is no drei or fiber elem that represents light's camera
  //so i used the imperative threejs way by extracting the scene element from the useThree hook
  //begin light camera
  const { scene } = useThree();

  useEffect(() => {
    scene.remove(camHelp);
    dLightRef.current.shadow.camera.far = 7;
    dLightRef.current.shadow.camera.top = widtht;
    dLightRef.current.shadow.camera.left = widthl;
    dLightRef.current.shadow.camera.right = widthr;
    dLightRef.current.shadow.camera.bottom = widthb;
    setCamHelp(new THREE.CameraHelper(dLightRef.current.shadow.camera));
    console.log(camHelp);
    if (camHelp?.parent) camHelp.parent.remove(camHelp);
    scene.add(camHelp);
    console.log(scene);
    return () => scene.remove(camHelp);
  }, [widtht, widthb, widthr, widthl, dLightRef]);

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
      <ambientLight intensity={0.5} color={"white"} />
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
