module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      '@babel/preset-typescript',
      "nativewind/babel"
    ],

    env: { 
      // production: {
      //   plugins: ['react-native-paper/babel'],  // This seems to break the production build for DropdownPicker.
      // },
    },

    plugins: [["module-resolver", {
      root: ["./"],

      alias: {
        "@": "./",
        "tailwind.config": "./tailwind.config.js"
      }
    }]]
  };
};
