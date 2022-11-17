import { Setup } from "../Wrapper";
import { Box, useTexture } from "@react-three/drei";
import { DynamicDrawUsage, AdditiveBlending } from "three";
import { useRef, Suspense, useEffect } from "react";
import { useControls, folder } from "leva";
import { useFrame } from "@react-three/fiber";

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

const geometries = {
  geometry1: "fibonacci sphere",
  geometry2: "stairs",
  geometry3: "energy",
};

const Fragments = () => {
  const [{ count, url, size, colorize, geometry }, set] = useControls(
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
        geometry: {
          options: geometries,
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
  const points = useRef();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians
  useEffect(() => {
    if (geometry === "stairs") {
      for (let i = 0; i < count * 3; i += 3) {
        const rdm = Math.random();
        positions[i] = Math.cos(rdm * Math.PI * 2) * (3 + Math.random() * 3);
        positions[i + 1] = (rdm - 0.5) * 15;
        positions[i + 2] =
          Math.sin(rdm * Math.PI * 2) * (3 + Math.random() * 3);
        colors[i] = Math.random();
        colors[i + 1] = Math.random();
        colors[i + 2] = Math.random();
      }
    }
    if (geometry === "fibonacci sphere") {
      for (let i = 0; i < count * 3; i += 3) {
        // const rdm = Math.random();
        const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
        const radius = Math.sqrt(1 - y * y); // radius at y
        const theta = phi * i; // golden angle increment
        positions[i] = Math.cos(theta) * radius * 10;
        positions[i + 1] = y * 10;
        positions[i + 2] = Math.sin(theta) * radius * 10;
        colors[i] = Math.random();
        colors[i + 1] = Math.random();
        colors[i + 2] = Math.random();
      }
    }
    if (geometry === "energy") {
      for (let i = 0; i < count * 3; i += 3) {
        const rdm = Math.random();
        positions[i] = Math.cos(rdm * Math.PI * 2) * (3 + Math.random() * 3);
        positions[i + 1] = Math.tan(rdm * Math.PI * 2);
        positions[i + 2] =
          Math.sin(rdm * Math.PI * 2) * (3 + Math.random() * 3);
        colors[i] = Math.random();
        colors[i + 1] = Math.random();
        colors[i + 2] = Math.random();
      }
    }
  }, [geometry, count, size, url, colorize]);
  const textures = useTexture({
    map: url,
    alphaMap: url,
  });
  useFrame(() => {
    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.geometry.attributes.color.needsUpdate = true;
  });
  return (
    <points ref={points}>
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
        blending={AdditiveBlending}
      />
    </points>
  );
};

const Template = function Particules(...args) {
  console.log(args);
  return (
    <Suspense>
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
