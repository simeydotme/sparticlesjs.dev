import { readable } from 'svelte/store';

export const presets = readable({
  default: {
    composition: "source-over",
    count: 500,
    speed: 10,
    parallax: 1,
    direction: 180,
    xVariance: 2,
    yVariance: 2,
    rotate: true,
    rotation: 1,
    alphaSpeed: 10,
    alphaVariance: 1,
    minAlpha: 0,
    maxAlpha: 1,
    minSize: 1,
    maxSize: 10,
    style: "fill",
    bounce: false,
    drift: 1,
    glow: 0,
    twinkle: false,
    color: ["white", "red"],
    shape: "circle",
    imageUrl: "https://image.flaticon.com/icons/svg/692/692052.svg"
  },
  snow: {
    speed: 5,
    count: 200,
    color: ["white", "grey"]
  },
  rain: {
    speed: 40,
    count: 200,
    color: ["blue","aquamarine"]
  },
  stars: {
    speed: 5,
    count: 200,
    color: ["gold","silver"]
  },
  sparkles: {
    composition: "source-over",
    count: 200,
    speed: 0,
    parallax: 0,
    direction: 180,
    xVariance: 0,
    yVariance: 5.5,
    rotate: false,
    rotation: 0,
    alphaSpeed: 4,
    alphaVariance: 10,
    minAlpha: -1,
    maxAlpha: 1,
    minSize: 3,
    maxSize: 12,
    style: "fill",
    bounce: false,
    drift: 0,
    glow: 6,
    twinkle: true,
    color: ["gold", "silver"],
    shape: "diamond",
    imageUrl: ""
  }
});
