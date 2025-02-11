module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
      '@babel/preset-typescript',
    ],
    env: { 
      // production: {
      //   plugins: ['react-native-paper/babel'],  // This seems to break the production build for DropdownPicker.
      // },
    },
  };
};
