import {
  Box,
  PerspectiveCamera,
  Stars,
  useTexture,
  Center,
} from "@react-three/drei";
import { Setup } from "../Wrapper";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useCallback, useState } from "react";
import {
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  useVelocity,
} from "framer-motion";
import { NearestFilter, Vector3 } from "three";
import { motion } from "framer-motion-3d";

export default {
  title: "3jsJourney/scrollAnimation/basicScrollAnimation",
  componenet: Box,
  decorators: [
    (storyFn, context) => {
      return (
        <Setup
          global={context.globals}
          fog={false}
          dom={true}
          transparent={true}
          controls={false}
          cameraPosition={new Vector3(0, 0, -3)}
        >
          {storyFn()}
        </Setup>
      );
    },
  ],
};

const Material = ({ color, section, sectionNumber }) => {
  const boxMaterial = {
    initial: (x) => ({ color: x[0] }),
    animate: (x) => ({ color: x[1] === sectionNumber ? "#ffffff" : x[0] }),
  };
  // const textures = useTexture({
  //   gradientMap: "/textures/gradient/3.jpg",
  // });
  const texture = useTexture("/textures/gradient/3.jpg", (texture) => {
    texture.magFilter = NearestFilter;
  });
  return (
    <motion.meshToonMaterial
      gradientMap={texture}
      variants={boxMaterial}
      initial="initial"
      animate="animate"
      transition={{
        duration: 0.5,
        repeat: sectionNumber === section ? 1 : 0,
        repeatType: "mirror",
      }}
      custom={[color, section]}
    />
  );
};

const AnimatedBox = () => {
  const cam = useRef(null);
  const group = useRef(null);
  const [sectionNumber, setSectionNumber] = useState(0);
  const { scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const velocity = useVelocity(scrollYProgress);
  const springV = useSpring(velocity, {
    stiffness: 30,
    damping: 10,
    mass: 3,
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
  let previousTime = 0;
  useFrame((delta) => {
    const elapsedTime = delta.clock.elapsedTime;
    const diff = elapsedTime - previousTime;
    previousTime = elapsedTime;
    // console.log(diff);
    const fps = delta.clock.oldTime - delta.clock.elapsedTime;
    const s = spring.get();
    const velo = springV.get();
    boxArr.map((x, i) => {
      x.current.rotation.x = fps * 0.001 + velo * 5;
      x.current.rotation.y = fps * 0.0015 + velo * 5;
    });
    // cam.current.rotation.y = multiplier * -delta.mouse.x;
    // cam.current.rotation.x = multiplier * delta.mouse.y;
    const springX = delta.mouse.x;
    const springY = delta.mouse.y;
    group.current.position.x += (springX - group.current.position.x) * 0.1;
    group.current.position.y += (springY - group.current.position.y) * 0.1;

    cam.current.position.y = s * -12;
  });
  const boxScale = {
    initial: {
      scale: 1,
    },
    animate: (x) => ({
      scale: x === sectionNumber ? 1.2 : 1,
    }),
  };
  const margin = 0.5;
  const { width, height } = useThree((state) => state.viewport);
  return (
    <>
      <group ref={group}>
        <PerspectiveCamera ref={cam} makeDefault position={[0, 0, 6]} />
      </group>
      <Center center position={[width / 7 + margin, 0, 0]}>
        <motion.mesh
          variants={boxScale}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            repeat: sectionNumber === 0 ? 3 : 0,
            repeatType: "mirror",
          }}
          ref={box1}
          custom={0}
          position={[1, 0, 0]}
        >
          <Material color="#ff0000" section={0} sectionNumber={sectionNumber} />
          <cylinderBufferGeometry args={[0.5, 0.5, 1, 32]} />
        </motion.mesh>
      </Center>

      <Center center position={[-width / 3.5 + margin, -6, 0]}>
        <motion.mesh
          variants={boxScale}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            repeat: sectionNumber === 1 ? 3 : 0,
            repeatType: "mirror",
          }}
          ref={box2}
          custom={1}
          position={[-1, -6, 0]}
        >
          <Material color="#0000ff" section={1} sectionNumber={sectionNumber} />
          <torusBufferGeometry args={[0.6, 0.2, 16, 100]} />
        </motion.mesh>
      </Center>
      <Center center position={[width / 7 + margin, -12, 0]}>
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
          <Material color="#00ff00" section={2} sectionNumber={sectionNumber} />
          <torusKnotBufferGeometry args={[0.5, 0.15, 64, 100]} />
        </motion.mesh>
      </Center>
      <Stars />
    </>
  );
};

const Template = function BasicScrollScene(...args) {
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
