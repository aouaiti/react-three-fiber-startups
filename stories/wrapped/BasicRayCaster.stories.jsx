import { Box } from "@react-three/drei";
import { Setup } from "../Wrapper";

export default {
  title: "3jsJourney/rayCaster/basicRayCaster",
  component: Box,
  decorators: [
    (storyFn, context) => (
      <Setup
        transparent={context.args.transparent}
        fog={context.args.fog}
        controls={context.args.controls}
        global={context.globals}
        lights={context.args.lights}
        axes={context.args.axes}
        grid={context.args.grid}
        ground={context.args.ground}
      >
        {storyFn()}
      </Setup>
    ),
  ],
};

const Template = function basicRayCaster(...args) {
  console.log(args[0]);
  return (
    <>
      <Box></Box>
    </>
  );
};

export const BasicRayCaster = Template.bind();
BasicRayCaster.args = {};
BasicRayCaster.parameters = { backgrounds: { disable: true } };
