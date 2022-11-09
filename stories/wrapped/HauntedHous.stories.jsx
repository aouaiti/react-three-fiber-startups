import { Box, Cone } from "@react-three/drei";
import { CameraHelper } from "three";
import { Setup } from "../Wrapper";
import { useCallback, useRef, useState } from "react";

export default {
  title: "3jsJourney/hauntedHouse",
  component: Box,
  decorators: [
    (storyFn, context) => (
      <Setup
        global={context.globals}
        ground={HauntedHouse.args.ground}
        axes={HauntedHouse.args.axes}
        grid={HauntedHouse.args.grid}
        lights={false}
      >
        {" "}
        {storyFn()}
      </Setup>
    ),
  ],
};

const Template = function HauntedHouse(...args) {
  /////////house
  const House = () => {
    return (
      <>
        <Box args={[4, 2.5, 4]} position-y={1.25} castShadow>
          <meshStandardMaterial />
        </Box>
        <Cone args={[3, 1, 4]} position={[0, 3, 0]} rotation-y={Math.PI / 4}>
          <meshStandardMaterial />
        </Cone>
      </>
    );
  };
  const Lights = () => {
    // const dLight = useRef();
    const [dLight, set] = useState();
    return (
      <>
        <ambientLight intensity={0.3} />
        <directionalLight
          ref={set}
          position={[5, 7, -1]}
          color={"#c9c9c9"}
          intensity={1}
          castShadow
        >
          {dLight && <directionalLightHelper args={[dLight, 5]} />}
        </directionalLight>
      </>
    );
  };
  const Graves = () => {
    const GravesCreator = useCallback(() => {
      const r = Math.random() * Math.PI * 2;
      const s = 6 + Math.random() * 3;
      const rotY = (Math.random() - 0.5) * 0.4;
      const rotX = (Math.random() - 0.5) * 0.4;
      return (
        <Box
          args={[0.5, 0.76, 0.2]}
          position={[Math.sin(r) * s, 0.3, Math.cos(r) * s]}
          rotation-y={rotY}
          rotation-z={rotX}
          castShadow
        >
          <meshStandardMaterial />
        </Box>
      );
    }, []);
    return (
      <>
        {[...new Array(50)].map((_, i) => (
          <GravesCreator key={i} />
        ))}
      </>
    );
  };
  return (
    <>
      <House />
      <Lights />
      <Graves />
    </>
  );
};

export const HauntedHouse = Template.bind({});
HauntedHouse.args = {
  ground: true,
  axes: true,
  grid: true,
  lights: false,
};

HauntedHouse.parameters = {
  backgrounds: { disable: true },
};

HauntedHouse.storyName = "HauntedHouse";
