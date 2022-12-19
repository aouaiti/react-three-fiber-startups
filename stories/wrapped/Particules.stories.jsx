import { Setup } from "../Wrapper";
import { Box, useTexture } from "@react-three/drei";
import { DynamicDrawUsage, AdditiveBlending, Vector3, Color } from "three";
import { useRef, Suspense, useEffect } from "react";
import { useControls, folder } from "leva";
import { useFrame } from "@react-three/fiber";

export default {
  title: "3jsJourney/particules/basicParticules",
  componenet: Box,
  decorators: [
    (storyFn, context) => (
      <Setup
        global={context.globals}
        ground={context.args.ground}
        axes={context.args.axes}
        grid={context.args.grid}
        cameraPosition={new Vector3(10, 10, 10)}
        controls={context.args.controls}
        fog={context.args.fog}
        lights={context.args.lights}
      >
        {storyFn()}
      </Setup>
    ),
  ],
  argTypes: {
    fog: {
      name: "fog",
      defaultValue: false,
      description: "display fog",
      control: { type: "boolean" },
    },
  },
};

const urls = {
  star1: "/particles/8.png",
  star2: "/particles/5.png",
  star3: "/particles/11.png",
  star4: "/particles/9.png",
  star5: "/particles/4.png",
  lense: "/particles/1.png",
  ring1: "/particles/2.png",
  ring2: "/particles/7.png",
  smoke: "/particles/3.png",
  arc: "/particles/6.png",
  heart: "/particles/10.png",
  line1: "/particles/12.png",
  line2: "/particles/13.png",
};

const geometries = {
  galaxy: "galaxy",
  fibonacciSphere: "fibonacci sphere",
  stairs: "stairs",
  energy: "energy",
};

const Fragments = ({ arg }) => {
  const {
    count,
    url,
    size,
    geometry,
    branches,
    angle,
    rfactor,
    centering,
    insideColor,
    outsideColor,
  } = useControls("particles", {
    props: folder({
      count: {
        value: 20000,
        min: 100,
        max: 20000,
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
        value: 10,
        min: 2,
        max: 10,
        step: 1,
        render: (get) => get("particles.props.geometry") === "galaxy",
      },
      angle: {
        value: 0.6,
        min: -2,
        max: 2,
        step: 0.1,
        render: (get) => get("particles.props.geometry") === "galaxy",
      },
      rfactor: {
        value: 0.1,
        min: 0,
        max: 0.2,
        step: 0.01,
        render: (get) => get("particles.props.geometry") === "galaxy",
      },
      centering: {
        value: 1,
        min: 1,
        max: 6,
        step: 1,
        render: (get) => get("particles.props.geometry") === "galaxy",
      },
      insideColor: {
        value: "#fff",
        label: "inside color",
        render: (get) => get("particles.props.geometry") === "galaxy",
      },
      outsideColor: {
        value: "#fff",
        label: "outside color",
        render: (get) => get("particles.props.geometry") === "galaxy",
      },
    }),
  });
  //   const count = 5000;
  const points = useRef();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians
  const iCol = new Color(insideColor);
  const oCol = new Color(outsideColor);
  useEffect(() => {
    if (geometry === "stairs") {
      for (let i = 0; i < count * 3; i += 3) {
        const rdm = Math.random();
        positions[i] = Math.cos(rdm * Math.PI * 2) * 3 + Math.random() * 3;
        positions[i + 1] = (rdm - 0.5) * 15;
        positions[i + 2] = Math.sin(rdm * Math.PI * 2) * 3 + Math.random() * 3;
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
        const radius = Math.pow(Math.random(), 2) * 10;
        // const radius = Math.random()* 10;
        const a = angle * radius;
        // randomize tentacles' width and height while widening the center
        const randomX =
          ((Math.pow(Math.random(), centering) *
            rfactor *
            Math.abs(radius - 10)) /
            2) *
          (Math.random() < 0.5 ? -1 : 1);
        const randomY =
          (Math.pow(Math.random(), centering) *
            0.5 *
            (Math.random() < 0.5 ? -1 : 1) *
            Math.abs(radius - 10)) /
          5;
        const randomZ =
          ((Math.pow(Math.random(), centering) *
            rfactor *
            Math.abs(radius - 10)) /
            2) *
          (Math.random() < 0.5 ? -1 : 1);
        //position
        positions[i3] = Math.cos(rdm + a) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(rdm + a) * radius + randomZ;
        // color
        const mixColor = iCol.clone();
        mixColor.lerp(oCol, radius / 10);
        colors[i3] = mixColor.r;
        colors[i3 + 1] = mixColor.g;
        colors[i3 + 2] = mixColor.b;
      }
    }
  }, [
    geometry,
    count,
    size,
    url,
    branches,
    angle,
    rfactor,
    centering,
    insideColor,
    outsideColor,
    arg,
  ]);
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
  console.log(args[0]);
  return (
    <Suspense>
      <Fragments arg={args[0]} />
    </Suspense>
  );
};

export const Particules = Template.bind();
Particules.args = {
  ground: false,
  axes: true,
  grid: false,
};

Particules.parameters = {
  backgrounds: { disable: true },
};

Particules.storyName = "Particules";

// tornadoo
// if (geometry === "galaxy") {
//     for (let i = 0; i < count; i++) {
//       // const branches = 4;
//       const i3 = i * 3;
//       const rdm = ((i % branches) / branches) * Math.PI * 2;
//       const radius = Math.random() * 10;
//       const a = angle * radius;
//       positions[i3] = Math.cos(rdm + a) * radius;
//       positions[i3 + 1] = rdm + radius; //////////////////////// here
//       positions[i3 + 2] = Math.sin(rdm + a) * radius;
//       colors[i] = Math.random();
//       colors[i + 1] = Math.random();
//       colors[i + 2] = Math.random();
//     }
//   }

// fire
// if (geometry === "galaxy") {
//     for (let i = 0; i < count; i++) {
//       // const branches = 4;
//       const i3 = i * 3;
//       const rdm = ((i % branches) / branches) * Math.PI * 2;
//       const radius = Math.random() * 10;
//       const a = angle * radius;
//       positions[i3] = Math.cos(rdm + a) * radius;
//       positions[i3 + 1] = rdm * radius; //////////////////////// here
//       positions[i3 + 2] = Math.sin(rdm + a) * radius;
//       colors[i] = Math.random();
//       colors[i + 1] = Math.random();
//       colors[i + 2] = Math.random();
//     }
//   }
