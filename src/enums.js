import { readable } from 'svelte/store';

export const enums = readable({
  "styles": ["fill", "stroke", "both"],
  "shapes": ["random", "circle", "square", "triangle", "diamond", "star", "line", "image"],
  "composites": [
    "source-over",
    "source-in",
    "source-out",
    "source-atop",
    "destination-over",
    "destination-in",
    "destination-out",
    "destination-atop",
    "lighter",
    "copy",
    "xor",
    "multiply",
    "screen",
    "overlay",
    "darken",
    "color-dodge",
    "color-burn",
    "hard-light",
    "soft-light",
    "difference",
    "exclusion",
    "hue",
    "saturation",
    "color",
    "luminosity"
  ]
});
