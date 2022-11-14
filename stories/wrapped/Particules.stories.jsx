import { Setup } from "../Wrapper";
import { Box, useTexture } from "@react-three/drei";
import { DynamicDrawUsage, AdditiveBlending } from "three";
import { useRef, Suspense } from "react";

export default {
  title: "Particules/general",
  componenet: Box,
  decorators: [
    (storyFn, context) => (
      <Setup
        global={context.globals}
        ground={Particules.args.ground}
        axes={Particules.args.axes}
        grid={Particules.args.grid}
        fog={false}
      >
        {storyFn()}
      </Setup>
    ),
  ],
};

const Fragments = () => {
  const count = 5000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }
  const textures = useTexture({
    map: "/particules/9.png",
    alphaMap: "/particules/9.png",
  });
  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          usage={DynamicDrawUsage}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
          usage={DynamicDrawUsage}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        size={0.4}
        sizeAttenuation={true}
        transparent
        {...textures}
        vertexColors
        depthWrite={false}
        // blending={AdditiveBlending}
      />
    </points>
  );
};

const Template = function Particules(...args) {
  console.log(args);
  return (
    <Suspense>
      {/* <Box></Box> */}
      <Fragments />
    </Suspense>
  );
};

export const Particules = Template.bind();
Particules.args = {
  ground: false,
  axes: true,
  grid: true,
};

Particules.parameters = {
  backgrounds: { disable: true },
};

Particules.storyName = "Particules";
