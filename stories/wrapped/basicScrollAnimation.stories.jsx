import { Box, PerspectiveCamera, Stars } from "@react-three/drei";
import { Setup } from "../Wrapper";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect, useCallback, useState } from "react";
import {
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  useVelocity,
} from "framer-motion";
import { Vector3 } from "three";
import { motion } from "framer-motion-3d";

export default {
  title: "scollAnimation/basic",
  componenet: Box,
  decorators: [
    (storyFn, context) => (
      <Setup
        global={context.globals}
        fog={false}
        dom={true}
        transparent={true}
        controls={false}
        cameraPosition={new Vector3(0, 0, -4)}
      >
        {storyFn()}
      </Setup>
    ),
  ],
};

const AnimatedBox = () => {
  const cam = useRef(null);
  const [sectionNumber, setSectionNumber] = useState(0);
  const { scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const velocity = useVelocity(scrollYProgress);
  const springV = useSpring(velocity, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const box1 = useRef(null);
  const box2 = useRef(null);
  const box3 = useRef(null);
  const wheelEvent = useCallback(
    (e) => {
      const s = scrollYProgress.get();
      if (s < 0.11 && sectionNumber !== 0) {
        setSectionNumber(0);
      }
      if (s >= 0.88 && sectionNumber !== 2) {
        setSectionNumber(2);
      }
      if (s >= 0.43 && s < 0.57 && sectionNumber !== 1) {
        setSectionNumber(1);
      }
      console.log(sectionNumber);
    },
    [sectionNumber]
  );
  useEffect(() => {
    window.addEventListener("scroll", wheelEvent);
    return () => window.removeEventListener("scroll", wheelEvent);
  }, [wheelEvent]);
  const boxArr = [box1, box2, box3];
  useFrame((delta) => {
    const s = spring.get();
    const velo = springV.get() / 5;
    boxArr.map((x, i) => {
      x.current.rotation.x += 0.011 + velo;
      x.current.rotation.y += 0.022 + velo;
    });
    cam.current.position.y = s * -12;
  });
  const boxScale = {
    initial: {
      scale: 1,
    },
    animate: {
      scale: 1.2,
    },
  };

  const boxMaterial = {
    initial: (x) => ({ color: x[0] }),
    animate: (x) => ({ color: x[1] === sectionNumber ? "#ffffff" : x[0] }),
  };
  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault position={[0, 0, 6]} />

      <motion.mesh
        variants={boxScale}
        initial="initial"
        animate="animate"
        transition={{
          duration: 0.5,
          repeat: sectionNumber === 2 ? 3 : 0,
          repeatType: "mirror",
        }}
        ref={box1}
        custom={0}
        position={[1, 0, 0]}
      >
        <motion.meshStandardMaterial
          variants={boxMaterial}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            repeat: sectionNumber === 0 ? 3 : 0,
            repeatType: "mirror",
          }}
          custom={["#ff0000", 0]}
        />
        <boxBufferGeometry />
      </motion.mesh>

      <motion.mesh
        variants={boxScale}
        initial="initial"
        animate="animate"
        transition={{
          duration: 0.5,
          repeat: sectionNumber === 2 ? 3 : 0,
          repeatType: "mirror",
        }}
        ref={box2}
        custom={1}
        position={[-1, -6, 0]}
      >
        <motion.meshStandardMaterial
          variants={boxMaterial}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            repeat: sectionNumber === 1 ? 3 : 0,
            repeatType: "mirror",
          }}
          custom={["#0000ff", 1]}
        />
        <boxBufferGeometry />
      </motion.mesh>

      <motion.mesh
        variants={boxScale}
        initial="initial"
        animate="animate"
        transition={{
          duration: 0.5,
          repeat: sectionNumber === 2 ? 3 : 0,
          repeatType: "mirror",
        }}
        ref={box3}
        custom={2}
        position={[1, -12, 0]}
      >
        <motion.meshStandardMaterial
          variants={boxMaterial}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            repeat: sectionNumber === 2 ? 3 : 0,
            repeatType: "mirror",
          }}
          custom={["#00ff00", 2]}
        />
        <boxBufferGeometry />
      </motion.mesh>

      <Stars />
    </>
  );
};

const Template = function BasicScrollScene(...args) {
  args[1].globals.theme = "black";
  //   console.log(args[1]);
  return (
    <>
      <AnimatedBox />
    </>
  );
};
export const BasicScrollScene = Template.bind();
BasicScrollScene.args = {
  ground: true,
  axes: true,
  grid: true,
  lights: true,
};
BasicScrollScene.parameters = {
  backgrounds: { disable: true },
};
