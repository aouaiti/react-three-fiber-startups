import { Box } from "@react-three/drei";
import { Setup } from "../Wrapper";

export default {
  title: "3jsJourney/BasicPhysics",
  componenet: Box,
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
};

const Template = function BasicPhysics(...args) {
  return (
    <>
      <Box></Box>
    </>
  );
};

export const BasicPhysics = Template.bind();
BasicPhysics.args = {};
BasicPhysics.parameters = { backgrounds: { disable: true } };
