import { Box } from "@react-three/drei";
import { Setup } from "../Wrapper";
import { Vector3 } from "three";
import { useState, useEffect } from "react";
import { motion } from "framer-motion-3d";
import { isEqual } from "lodash";
import { useFrame } from "@react-three/fiber";

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
  argTypes: {
    ground: {
      name: "ground",
      defaultValue: false,
      description: "display ground",
      control: { type: "boolean" },
    },
    fog: {
      name: "fog",
      defaultValue: false,
      description: "display fog",
      control: { type: "boolean" },
    },
    grid: {
      name: "grid",
      defaultValue: false,
      description: "display grid",
      control: { type: "boolean" },
    },
  },
};

const boxAnimation = {
  init: {
    y: -2,
  },
  animate: {
    y: 2,
  },
};

const useMemoizedState = (initialValue, box) => {
  const [state, _setState] = useState(initialValue);

  const setState = (newState) => {
    _setState((prev) => {
      if (!isEqual(newState, prev)) {
        if (prev?.length !== newState?.length) {
          console.log(newState.length ? newState : "not intersected");
          if (newState.length) newState[0].object.material.color.set("#f00");
          return newState;
        }
        return prev;
      } else {
        box.material.color.set("#00f");
        return prev;
      }
    });
  };
  return [state, setState];
};

const Template = function basicRayCaster(...args) {
  const [ray, setRay] = useState(null);
  const [box, setBox] = useState(null);
  const [_, setIntersect] = useMemoizedState(null, box);
  const [position, setPosition] = useState(null);
  const [direction, setDirection] = useState(null);
  useEffect(() => {
    setPosition(new Vector3(-3, 0, 0));
    setDirection(new Vector3(1, 0, 0));
  }, []);
  const Framing = () => {
    useFrame((delta) => {
      if (!ray || !box) return;
      // box.material.color.set("#00f");
      setIntersect(ray.intersectObject(box));
    });
    return null;
  };
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
      <raycaster ref={setRay} ray={[position, direction]} />
      <Framing />
    </>
  );
};

export const BasicRayCaster = Template.bind();
BasicRayCaster.args = {};
BasicRayCaster.parameters = { backgrounds: { disable: true } };
