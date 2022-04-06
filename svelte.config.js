import adapter from "@sveltejs/adapter-auto";
import preprocess from "svelte-preprocess";
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    package: {
      exports: (file) => file === "index.ts",
    },
    vite: {
      resolve: {
        alias: {
          "svelte-pdf-simple": path.resolve("src/lib"),
        },
      },
    },
  },
};

export default config;
