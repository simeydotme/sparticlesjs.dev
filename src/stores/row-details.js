// Map option names to human-friendly hint text.
// These hints are based on the Sparticles README options documentation.

import { readable } from "svelte/store";

const details = {
  count:
    "Number of particles visible at once. Higher values look denser but can hurt performance (e.g. 50 for subtle sparkle, 500+ for heavy snow).",
  composition:
    "Canvas blend mode for how particles draw over each other. Anything other than 'source-over' can cause performance degradation.",
  direction:
    "Base travel direction in degrees (0 = up, 90 = right, 180 = down, 270 = left). Ignored when spawnFromCenter is enabled.",
  speed:
    "Base movement speed for all particles. 0 keeps them still (with only variance moving them); higher values move faster across the screen.",
  parallax:
    "How much particle speed varies with size to give a depth effect. 0 disables it; around 50 gives a strong near/far effect, 100 is very pronounced.",
  drift:
    "Sideways drifting relative to the main direction (or radial direction when spawning from center). Higher values look more like snow or leaves blown by wind.",
  xVariance:
    "Random scattering on the canvas X axis. 0 means all particles move in the same direction; higher values make motion more scattered or floaty.",
  yVariance:
    "Random scattering on the canvas Y axis. Combine with low speed to get particles that gently wander instead of falling straight.",
  rotate:
    "Whether particles are allowed to spin. Turn off for simple dots/points, or on for stars, squares and images that should rotate.",
  rotation:
    "Base spin speed for particles. 0 means no rotation; higher values spin faster but may look busy if too high.",
  twinkle:
    "Use an alternate alpha pattern that makes particles 'twinkle'. Works best with higher alphaSpeed and alphaVariance.",
  alphaSpeed:
    "How quickly particle opacity changes over time. 0 disables alpha animation.",
  alphaVariance:
    "Randomness in each particle’s alpha change rate. 0 makes all particles fade the same way; higher values add more variation in flicker.",
  minAlpha:
    "Minimum opacity particles can reach. Lower values keep them invisible longer between fades; must be lower than maxAlpha.",
  maxAlpha:
    "Maximum opacity particles can reach. Higher values keep them bright and visible longer; must be higher than minAlpha.",
  minSize:
    "Smallest particle size in pixels. Together with maxSize this defines the size range; equal min/max makes all particles uniform.",
  maxSize:
    "Largest particle size in pixels. Larger values make particles more prominent and can emphasize parallax and glow effects.",
  style:
    "Draw style for particles: 'fill' for solid shapes, 'stroke' for outlines, or 'both' to randomly mix filled and stroked particles.",
  bounce:
    "Whether particles bounce off the canvas edges instead of wrapping around. Great for chaotic motion with low speed and high variance.",
  glow:
    "Glow or shadow size around each particle. 0 disables glow; higher values give a stronger halo but cost some performance. Increasing Glow will shrink the particles, so increase the Min/Max particle Size to compensate.",
  color:
    "Particle color or palette. Use a CSS color string, an array of colors for multi-colored particles, or 'random' to let Sparticles generate colors.",
  shape:
    "Particle shape or array of shapes (e.g. 'circle', 'square', 'star', 'image'). Arrays randomly pick a shape per particle; 'image' uses imageUrl.",
  imageUrl:
    "Image URL or array of URLs for particles when shape includes 'image'. Images should be square (1:1) for best results.",
  spawnFromCenter:
    "If true, particles spawn inside a circle at the canvas center and move radially outward. Direction is ignored; great for burst or radiating effects.",
  spawnArea:
    "Size of the center spawn circle as a percentage of canvas width when spawnFromCenter is true. e.g. 20 = tight core, 80 = wide diffuse area.",
  spawnLocations:
    "One or more [x, y] origins as % of canvas width/height (0–100). Particles round-robin between locations when spawnFromCenter is on, e.g. [[25,50],[75,50]] for two horizontal spawners.",
  staggerSpawn:
    "Staggers the initial particle spawns over this many seconds instead of spawning all particles at once, reduces the 'burst' effect.",
};

export const rowDetails = readable(details);
