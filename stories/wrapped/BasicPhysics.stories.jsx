import { Sphere, Plane } from "@react-three/drei";
import { Setup } from "../Wrapper";
import { Physics, usePlane, useSphere, Debug } from "@react-three/cannon";

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
      <Plane ref={plane} args={[40, 40, 1, 1]}></Plane>
    </>
  );
};

const SphereComponent = () => {
  const [sphere] = useSphere(() => ({
    mass: 1,
    position: [0, 3, 0],
    radius: 0.5,
  }));
  return (
    <>
      <Sphere ref={sphere}>
        {/* <sphereBufferGeometry args={[0.5, 32, 16]} /> */}
        <meshStandardMaterial metalness={0.7} roughness={0.1} />
      </Sphere>
    </>
  );
};

const Template = function BasicPhysics(...args) {
  return (
    <>
      <Physics>
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
