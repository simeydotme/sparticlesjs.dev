import { readable } from 'svelte/store';

export const presets = readable({
  "Vanilla": {
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
    color: ["random"],
    shape: "circle",
    imageUrl: ""
  },
  "Alpine Flurry": {
    composition: "source-over",
    count: 210,
    speed: 5,
    parallax: 20,
    direction: 160,
    xVariance: 5,
    yVariance: 0,
    rotate: false,
    rotation: 0,
    alphaSpeed: 2,
    alphaVariance: 2,
    minAlpha: -1,
    maxAlpha: 1,
    minSize: 1,
    maxSize: 8,
    style: "fill",
    bounce: false,
    drift: 4,
    glow: 0,
    twinkle: false,
    color: ["white", "#d3e8eb"],
    shape: ["circle","circle","circle","image"],
    imageUrl: "./img/snowflake.png"
  },
  "Enchanted Woods": {
    composition: "source-over",
    count: 200,
    speed: 0,
    parallax: 0,
    direction: 180,
    xVariance: 0,
    yVariance: 4,
    rotate: false,
    rotation: 0,
    alphaSpeed: 8,
    alphaVariance: 4,
    minAlpha: -1,
    maxAlpha: 1,
    minSize: 4,
    maxSize: 14,
    style: "fill",
    bounce: false,
    drift: 0,
    glow: 16,
    twinkle: true,
    color: ["#f4bf5b", "#cbe4ed"],
    shape: "diamond",
    imageUrl: ""
  },
  "Amber Fall": {
    composition: "source-over",
    count: 30,
    speed: 0.25,
    parallax: 2.5,
    direction: 200,
    xVariance: 50,
    yVariance: 4,
    rotate: true,
    rotation: 0.2,
    alphaSpeed: 0.5,
    alphaVariance: 0,
    minAlpha: 0.8,
    maxAlpha: 1,
    minSize: 12,
    maxSize: 42,
    style: "fill",
    bounce: false,
    drift: 5,
    glow: 0,
    twinkle: false,
    color: ["#eb8065", "#fac5ad", "#52382e"],
    shape: "image",
    imageUrl: "https://image.flaticon.com/icons/svg/692/692052.svg"
  },
  "Abyss": {
    composition:"source-over",
    count:799,
    speed:13,
    parallax:17.4,
    direction:0,
    xVariance:2.6,
    yVariance:7.8,
    rotate:true,
    rotation:1,
    alphaSpeed:21,
    alphaVariance:0,
    minAlpha:-2,
    maxAlpha:2,
    minSize:1,
    maxSize:4,
    style:"both",
    bounce:false,
    drift:5.9,
    glow:0,
    twinkle:false,
    color:["#ffffff","#68e8f6", "#3bd4f5","#017a98","#017a98","#017a98"],
    shape:"circle",
    imageUrl: ""
  }
});
