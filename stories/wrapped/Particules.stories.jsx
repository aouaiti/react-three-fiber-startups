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
  star1: "/particules/8.png",
  star2: "/particules/5.png",
  star3: "/particules/11.png",
  star4: "/particules/9.png",
  star5: "/particules/4.png",
  lense: "/particules/1.png",
  ring1: "/particules/2.png",
  ring2: "/particules/7.png",
  smoke: "/particules/3.png",
  arc: "/particules/6.png",
  heart: "/particules/10.png",
  line1: "/particules/12.png",
  line2: "/particules/13.png",
};

const geometries = {
  fibonacciSphere: "fibonacci sphere",
  stairs: "stairs",
  energy: "energy",
  galaxy: "galaxy",
};

const Fragments = () => {
  const { count, url, size, geometry, branches } = useControls("particles", {
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
    }),
    galaxy: folder({
      branches: {
        value: 3,
        min: 2,
        max: 10,
        step: 1,
        render: (get) => get("particles.props.geometry") === "galaxy",
      },
    }),
  });
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
    if (geometry === "galaxy") {
      for (let i = 0; i < count; i++) {
        // const branches = 4;
        const i3 = i * 3;
        const rdm = ((i % branches) / branches) * Math.PI * 2;
        const radius = Math.random() * 10;
        if (i < 20) console.log(rdm);
        positions[i3] = Math.cos(rdm) * radius;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = Math.sin(rdm) * radius;
        colors[i] = Math.random();
        colors[i + 1] = Math.random();
        colors[i + 2] = Math.random();
      }
    }
  }, [geometry, count, size, url, branches]);
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
        vertexColors
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
