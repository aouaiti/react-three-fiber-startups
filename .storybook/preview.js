export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // backgrounds: {
  //   default: "dark",
  //   values: [
  //     {
  //       name: "dark",
  //       value: "#030303",
  //     },
  //     {
  //       name: "light",
  //       value: "#fff",
  //     },
  //   ],
  // },
};

export const globalTypes = {
  containerSize: {
    //...
  },
  theme: {
    name: "Theme",
    description: "Global theme",
    defaultValue: "dark",
    toolbar: {
      icon: "lightning",
      items: ["dark", "light", "transparent"],
      // showName: true,
    },
  },
};

export const decorators = [
  (Story, context) => {
    const theme =
      context.globals.theme === "light"
        ? "#fff"
        : context.globals.theme === "dark"
        ? "#030303"
        : "transparent";
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          background: `${theme}`,
        }}
      >
        <Story />
      </div>
    );
  },
];

// All stories expect a theme arg
export const argTypes = {
  ground: {
    name: "ground",
    defaultValue: true,
    description: "display ground",
    control: { type: "boolean" },
  },
  controls: {
    name: "controls",
    defaultValue: true,
    description: "activate controls",
    control: { type: "boolean" },
  },
  axes: {
    name: "axes",
    defaultValue: true,
    description: "display axis",
    control: { type: "boolean" },
  },
  grid: {
    name: "grid",
    defaultValue: true,
    description: "display grid",
    control: { type: "boolean" },
  },
  lights: {
    name: "lights",
    defaultValue: true,
    description: "display lights",
    control: { type: "boolean" },
  },
  fog: {
    name: "fog",
    defaultValue: true,
    description: "display fog",
    control: { type: "boolean" },
  },
};

// The default value of the theme arg to all stories
// export const args = { theme: "light" };
