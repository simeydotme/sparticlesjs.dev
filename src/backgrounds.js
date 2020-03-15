import { readable } from 'svelte/store';

export const backgrounds = readable({
  
  default: {
    credit: "",
    image: ""
  },
  
  sparkles: {
    credit: "Photo by <a href='https://unsplash.com/photos/-BZc9Ee1qo0'>Niilo Isotalo on Unsplash</a>",
    image: "./img/bg/forest.jpg"
  }

});
