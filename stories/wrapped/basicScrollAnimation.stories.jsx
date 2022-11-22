import { Box } from "@react-three/drei";
import { Setup } from "../Wrapper";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";

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
      >
        {storyFn()}
      </Setup>
    ),
  ],
};

const AnimatedBox = () => {
  const box = useRef(null);
  useFrame((delta) => {
    box.current.rotation.x += 0.01;
    box.current.rotation.y += 0.01;
    // console.log(window.scr);
  });
  return (
    <Box ref={box}>
      <meshStandardMaterial />
    </Box>
  );
};

const Template = function BasicScrollScene(...args) {
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
