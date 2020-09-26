import { readable } from "svelte/store";

export const backgrounds = readable({
  Vanilla: {
    credit: "",
    image: "",
  },

  "Alpine Flurry": {
    author: "Ian Schneider",
    url: "https://unsplash.com/photos/dqMxDqdhg_4",
    image: "./img/bg/snow.jpg",
  },

  "Enchanted Woods": {
    author: "Niilo Isotalo",
    url: "https://unsplash.com/photos/-BZc9Ee1qo0",
    image: "./img/bg/forest.jpg",
  },

  "Amber Fall": {
    author: "Ju On",
    url: "https://unsplash.com/photos/_zZrmWCGdsg",
    image: "./img/bg/fall.jpg",
  },

  Abyss: {
    author: "Sarah Lee",
    url: "https://unsplash.com/photos/QURU8IY-RaI",
    image: "./img/bg/abyss.jpg",
  },

  Galaxy: {
    author: "Graham Holtshausen",
    url: "https://unsplash.com/photos/fUnfEz3VLv4",
    image: "./img/bg/galaxy.jpg",
  },
});
