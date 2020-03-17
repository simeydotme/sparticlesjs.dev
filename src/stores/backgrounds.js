import { readable } from 'svelte/store';

export const backgrounds = readable({
  
  "Vanilla": {
    credit: "",
    image: ""
  },

  "Alpine Flurry": {
    author: "Ian Schneider",
    url: "https://unsplash.com/photos/dqMxDqdhg_4",
    image: "./img/bg/snow.jpg"
  },
  
  "Enchanted Woods": {
    author: "Niilo Isotalo",
    url: "https://unsplash.com/photos/-BZc9Ee1qo0",
    image: "./img/bg/forest.jpg"
  }

});
