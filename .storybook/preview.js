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
      items: ["dark", "light"],
      // showName: true,
    },
  },
};

export const decorators = [
  (Story, context) => {
    const theme = context.globals.theme === "light" ? "white" : "#000";
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
