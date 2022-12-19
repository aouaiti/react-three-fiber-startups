import { Sphere, Plane, Environment, SpotLight } from "@react-three/drei";
import { Setup } from "../Wrapper";
import {
  Physics,
  usePlane,
  useSphere,
  useBox,
  Debug,
} from "@react-three/cannon";
import { Suspense, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls, folder } from "leva";

export default {
  title: "3jsJourney/BasicPhysics",
  componenet: Sphere,
  decorators: [
    (storyFn, context) => {
      return (
        <Setup
          ground={context.args.ground}
          controls={context.args.controls}
          global={context.globals}
          lights={context.args.lights}
          axes={context.args.axes}
          fog={context.args.fog}
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
  },
};

const PlaneComponent = () => {
  const [plane] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <>
      <Plane receiveShadow ref={plane} args={[40, 40, 1, 1]}>
        <meshStandardMaterial />
      </Plane>
    </>
  );
};

const SphereComponent = () => {
  const { radius } = useControls("World", {
    Sphere: folder({
      radius: {
        value: 0.5,
        min: 0.1,
        max: 2,
        step: 0.001,
      },
    }),
  });
  const [sphere, api] = useSphere(() => ({
    mass: 1,
    position: [0, 3, 0],
    type: "Dynamic",
    args: [radius],
    friction: 0.1,
    restitution: 0.9,
    mass: 1,
  }));

  return (
    <>
      <mesh castShadow ref={sphere}>
        <sphereBufferGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial metalness={1} roughness={0} />
      </mesh>
    </>
  );
};

const Template = function BasicPhysics(...args) {
  const { gravity } = useControls("World", {
    Physics: folder({
      gravity: { value: [0, -9.81, 0], step: 0.2 },
    }),
  });

  return (
    <>
      <Suspense fallback={null}>
        <Environment preset="sunset" />
      </Suspense>
      <Physics
        allowSleep
        // broadphase="SAP"
        gravity={gravity}
        defaultContactMaterial={{ friction: 0.1, restitution: 0.5 }}
      >
        <Debug color="black" scale={1.1}>
          <SphereComponent />
        </Debug>
        <PlaneComponent />
      </Physics>
    </>
  );
};

export const BasicPhysics = Template.bind();
BasicPhysics.args = {};
BasicPhysics.parameters = { backgrounds: { disable: true } };
