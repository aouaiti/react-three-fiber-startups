import { Setup } from "../Wrapper";
import { Box, useTexture } from "@react-three/drei";
import { DynamicDrawUsage, AdditiveBlending } from "three";
import { useRef, Suspense } from "react";
import * as THREE from "three";
import { useControls, folder } from "leva";

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

const urls = {
  model1: "/particules/1.png",
  model2: "/particules/2.png",
  model3: "/particules/3.png",
  model4: "/particules/4.png",
  model5: "/particules/5.png",
  model6: "/particules/6.png",
  model7: "/particules/7.png",
  model8: "/particules/8.png",
  model9: "/particules/9.png",
  model10: "/particules/10.png",
  model11: "/particules/11.png",
  model12: "/particules/12.png",
  model13: "/particules/13.png",
};

const Fragments = () => {
  const [{ count, url, size, colorize }, set] = useControls(
    "particles",
    () => ({
      props: folder({
        count: {
          value: 10000,
          min: 100,
          max: 10000,
          step: 100,
        },
        url: {
          options: urls,
        },
        size: {
          value: 0.2,
          min: 0.1,
          max: 1,
          step: 0.01,
        },
        colorize: true,
      }),
    })
  );
  //   const count = 5000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }
  const textures = useTexture({
    map: url,
    alphaMap: url,
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
        size={size}
        sizeAttenuation={true}
        transparent
        {...textures}
        vertexColors={colorize}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
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
