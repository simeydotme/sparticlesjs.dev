<script>
  import { options } from "../stores/options.js";

  /** Index into options.spawnLocations */
  export let index;
  /** Prefix for input ids, e.g. "spawn-loc-0" */
  export let labelId = "";

  const min = 0;
  const max = 100;

  function clamp(n) {
    if (Number.isNaN(n)) {
      return 0;
    }
    return Math.min(max, Math.max(min, n));
  }

  function setCoord(axis, e) {
    const raw = parseFloat(/** @type {HTMLInputElement} */ (e.currentTarget).value);
    const v = clamp(raw);
    if (axis === 0) {
      $options.spawnLocations[index][0] = v;
    } else {
      $options.spawnLocations[index][1] = v;
    }
    $options.spawnLocations = $options.spawnLocations;
  }
</script>

<div class="spawn-tuple">
  <label class="coord" for="{labelId}-x">x</label>
  <input
    class="text"
    id="{labelId}-x"
    type="number"
    {min}
    {max}
    step="0.1"
    value={$options.spawnLocations[index][0]}
    on:input={(e) => {
      setCoord(0, e);
    }} />
  <span class="sep" aria-hidden="true">×</span>
  <label class="coord" for="{labelId}-y">y</label>
  <input
    class="text"
    id="{labelId}-y"
    type="number"
    {min}
    {max}
    step="0.1"
    value={$options.spawnLocations[index][1]}
    on:input={(e) => {
      setCoord(1, e);
    }} />
</div>

<style>
  .spawn-tuple {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    flex: 1;
  }

  .coord {
    font-size: 9px;
    color: #888;
    text-transform: uppercase;
  }

  .sep {
    color: #555;
    user-select: none;
  }

  .text {
    width: 52px;
    text-align: right;
    font-family: inherit;
    font-size: 11px;
  }
</style>
