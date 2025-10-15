/** @type {import("jest").Config} */
export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          module: "commonjs",
          esModuleInterop: true,
        },
      },
    ],
  },
  // When using ESM-style imports in TypeScript source (e.g. import './foo.js')
  // Jest resolver will try to find a .js file on disk. Map any relative
  // import that ends with `.js` back to the same path without extension
  // so ts-jest can resolve the `.ts` source file.
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
