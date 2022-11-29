import * as React from "react";
import { Setup } from "../Wrapper";
import { Stars } from "@react-three/drei";

export default {
  title: "3jsJourney/staging/basicSetup",
  component: Stars,
  decorators: [
    (storyFn, context) => (
      <Setup
        global={context.globals}
        ground={context.args.ground}
        axes={context.args.axes}
        grid={context.args.grid}
        controls={context.args.controls}
        fog={context.args.fog}
        lights={context.args.lights}
      >
        {" "}
        {storyFn()}
      </Setup>
    ),
  ],
  argTypes: {
    stars: {
      name: "stars",
      defaultValue: true,
      description: "display stars",
      control: { type: "boolean" },
    },
    fog: {
      name: "fog",
      defaultValue: true,
      description: "display fog",
      control: { type: "boolean" },
    },
  },
};

const Template = function StarsScene(...args) {
  console.log(args[0]);
  // const theme = args[1].globals.theme;
  return <>{args[0].stars && <Stars />}</>;
};

export const StarsA = Template.bind({});
StarsA.args = {
  ground: true,
  axes: true,
  grid: true,
  stars: true,
};

StarsA.parameters = {
  backgrounds: { disable: true },
};
// StarsA.propTypes = {
//   stars: PropTypes.bool,
// };
// StarsA.defaultProps = {
//   stars: false,
// };

StarsA.storyName = "Basic setup";
