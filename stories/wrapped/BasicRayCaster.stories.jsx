import { Box } from "@react-three/drei";
import { Setup } from "../Wrapper";
import { Vector3 } from "three";
import { useEffect, useState } from "react";
import { motion } from "framer-motion-3d";

export default {
  title: "3jsJourney/rayCaster/basicRayCaster",
  component: Box,
  decorators: [
    (storyFn, context) => {
      return (
        <Setup
          transparent={context.args.transparent}
          fog={context.args.fog}
          controls={context.args.controls}
          global={context.globals}
          lights={context.args.lights}
          axes={context.args.axes}
          grid={context.args.grid}
          ground={context.args.ground}
        >
          {storyFn()}
        </Setup>
      );
    },
  ],
};

const boxAnimation = {
  init: {
    y: -2,
  },
  animate: {
    y: 2,
  },
};

const Template = function basicRayCaster(...args) {
  const [ray, setRay] = useState(null);
  const [box, setBox] = useState(null);
  useEffect(() => {
    if (!ray || !box) return;
    console.log(ray.ray.direction);
    const intersect = ray.intersectObject(box);
    console.log(intersect);
  }, [box, ray]);
  return (
    <>
      <motion.group
        variants={boxAnimation}
        initial="init"
        animate="animate"
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      >
        <Box ref={setBox} />
      </motion.group>
      <raycaster
        ref={setRay}
        ray={[new Vector3(-3, 0, 0), new Vector3(1, 0, 0)]}
      />
    </>
  );
};

export const BasicRayCaster = Template.bind();
BasicRayCaster.args = {};
BasicRayCaster.parameters = { backgrounds: { disable: true } };
