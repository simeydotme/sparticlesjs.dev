/**
 * Sparticles v2.2.0 public option defaults (from dist/sparticles.mjs `defaults`),
 * minus internal fields like randomColor. Used for delta JSON export and import hints.
 */
export const SPARTICLES_V220_DEFAULTS = {
  alphaSpeed: 10,
  alphaVariance: 1,
  bounce: false,
  color: "random",
  composition: "source-over",
  count: 50,
  direction: 180,
  drift: 1,
  glow: 0,
  imageUrl: "",
  maxAlpha: 1,
  maxSize: 10,
  minAlpha: 0,
  minSize: 1,
  parallax: 0,
  rotate: true,
  rotation: 1,
  shape: "circle",
  speed: 10,
  style: "fill",
  twinkle: false,
  xVariance: 2,
  yVariance: 2,
  spawnArea: 20,
  spawnLocations: [[50, 50]],
  spawnFromCenter: false,
  staggerSpawn: 0,
};

export const IMPORTABLE_OPTION_KEYS = new Set(Object.keys(SPARTICLES_V220_DEFAULTS));

const BOOL_KEYS = new Set(["rotate", "twinkle", "bounce", "spawnFromCenter"]);

export function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a == null || b == null) {
    return a === b;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (var i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  if (typeof a === "object" && typeof b === "object" && a.constructor === Object && b.constructor === Object) {
    var keysA = Object.keys(a);
    var keysB = Object.keys(b);
    if (keysA.length !== keysB.length) {
      return false;
    }
    for (var k = 0; k < keysA.length; k++) {
      if (!Object.prototype.hasOwnProperty.call(b, keysA[k])) {
        return false;
      }
      if (!deepEqual(a[keysA[k]], b[keysA[k]])) {
        return false;
      }
    }
    return true;
  }
  return false;
}

/**
 * @param {Record<string, unknown>} current
 */
export function optionsDeltaFromSparticlesDefaults(current) {
  var defaults = SPARTICLES_V220_DEFAULTS;
  /** @type {Record<string, unknown>} */
  var out = {};
  for (var key in current) {
    if (!Object.prototype.hasOwnProperty.call(current, key)) {
      continue;
    }
    if (!Object.prototype.hasOwnProperty.call(defaults, key)) {
      out[key] = current[key];
      continue;
    }
    if (!deepEqual(/** @type {unknown} */ (current[key]), /** @type {unknown} */ (defaults[key]))) {
      out[key] = current[key];
    }
  }
  return out;
}

/**
 * @param {Record<string, unknown>} base
 * @param {Record<string, unknown>} parsed
 */
export function mergeSparticlesOptionsImport(base, parsed) {
  var warnings = [];
  var next = JSON.parse(JSON.stringify(base));

  for (var key in parsed) {
    if (!Object.prototype.hasOwnProperty.call(parsed, key)) {
      continue;
    }
    if (!IMPORTABLE_OPTION_KEYS.has(key)) {
      warnings.push('Ignored unknown key "' + key + '".');
      continue;
    }
    var val = parsed[key];
    var result = validateOptionKey(key, val);
    if (result.error) {
      warnings.push(result.error);
      continue;
    }
    next[key] = result.value;
  }

  return { options: next, warnings };
}

/**
 * @param {string} key
 * @param {unknown} val
 * @returns {{ value?: unknown, error?: string }}
 */
function validateOptionKey(key, val) {
  if (key === "spawnLocations") {
    if (!Array.isArray(val) || val.length === 0) {
      return { error: 'Skipped "spawnLocations": expected a non-empty array of [x,y] number pairs.' };
    }
    var tuples = [];
    for (var i = 0; i < val.length; i++) {
      var t = val[i];
      if (!Array.isArray(t) || t.length < 2) {
        return { error: 'Skipped "spawnLocations": each entry must be a [x, y] array of numbers (0–100).' };
      }
      var x = toNum(t[0]);
      var y = toNum(t[1]);
      if (x == null || y == null) {
        return { error: 'Skipped "spawnLocations": x and y must be numbers.' };
      }
      tuples.push([clamp100(x), clamp100(y)]);
    }
    return { value: tuples };
  }

  if (key === "color") {
    if (val === "random" || typeof val === "string") {
      return { value: val };
    }
    if (Array.isArray(val) && val.length > 0) {
      var ok = true;
      for (var c = 0; c < val.length; c++) {
        if (!(val[c] === "random" || typeof val[c] === "string")) {
          ok = false;
          break;
        }
      }
      if (ok) {
        return { value: val };
      }
    }
    return { error: 'Skipped "color": expected "random", a color string, or a non-empty array of strings / "random".' };
  }

  if (key === "shape" || key === "imageUrl") {
    if (typeof val === "string") {
      return { value: val };
    }
    if (Array.isArray(val) && val.length > 0 && val.every(function (s) { return typeof s === "string"; })) {
      return { value: val };
    }
    return { error: 'Skipped "' + key + '": expected a string or a non-empty array of strings.' };
  }

  if (key === "composition") {
    if (typeof val === "string") {
      return { value: val };
    }
    return { error: 'Skipped "composition": expected a string.' };
  }

  if (key === "style") {
    if (val === "fill" || val === "stroke" || val === "both") {
      return { value: val };
    }
    return { error: 'Skipped "style": expected "fill", "stroke", or "both".' };
  }

  if (BOOL_KEYS.has(key)) {
    var b = toBool(val);
    if (b == null) {
      return { error: 'Skipped "' + key + '": expected a boolean (or 0/1, true/false strings).' };
    }
    return { value: b };
  }

  var n = toNum(val);
  if (n == null) {
    return { error: 'Skipped "' + key + '": expected a number.' };
  }

  if (key === "count" && (n < 1 || n > 10000)) {
    return { error: 'Skipped "count": out of range (1–10000).' };
  }
  if (key === "spawnArea" && (n < 0 || n > 90)) {
    return { error: 'Skipped "spawnArea": out of range (0–90).' };
  }
  if (key === "staggerSpawn" && n < 0) {
    return { error: 'Skipped "staggerSpawn": must be 0 or greater (seconds).' };
  }

  return { value: n };
}

/**
 * @param {unknown} v
 * @returns {number | null}
 */
function toNum(v) {
  if (typeof v === "number" && isFinite(v)) {
    return v;
  }
  if (typeof v === "string" && v.trim() !== "") {
    var x = parseFloat(v);
    if (isFinite(x)) {
      return x;
    }
  }
  return null;
}

/**
 * @param {unknown} v
 * @returns {boolean | null}
 */
function toBool(v) {
  if (v === true || v === false) {
    return v;
  }
  if (v === 1 || v === 0) {
    return v === 1;
  }
  if (v === "true") {
    return true;
  }
  if (v === "false") {
    return false;
  }
  return null;
}

function clamp100(n) {
  if (n < 0) {
    return 0;
  }
  if (n > 100) {
    return 100;
  }
  return n;
}
