<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";

  import { options } from "./stores/options.js";
  import { presets } from "./stores/presets.js";
  import { enums } from "./stores/enums.js";
  import { color } from "./stores/backgrounds.js";

  import Group from "./Controls/Group.svelte";
  import Row from "./Controls/Row.svelte";
  import SpawnLocation from "./Controls/SpawnLocation.svelte";

  import { rowDetails } from "./stores/row-details.js";

  import cross from "../public/img/x.svg";

  const dispatch = createEventDispatcher();
  let selectedPreset = "Vanilla";
  let debounce;
  let resetPrompt = false;

  function updateOptions(p) {
    if (p) {
      selectedPreset = p;
    }
    options.set($presets[selectedPreset]);
    dispatch("setPreset", selectedPreset);
    saveOptions();
  }

  function openExportJson() {
    dispatch("saveJson");
  }

  function openImportJson() {
    dispatch("importJson");
  }

  function reset() {
    if (!resetPrompt) {
      resetPrompt = true;
      setTimeout(function() {
        resetPrompt = false;
      }, 2000);
    } else {
      updateOptions("Vanilla");
      $color = "transparent";
      resetPrompt = false;
    }
  }

  function addColor() {
    $options.color.push("#ffffff");
    $options.color = $options.color;
  }

  function removeColor(index) {
    $options.color.splice(index, 1);
    $options.color = $options.color;
  }

  function addSpawnLocation() {
    $options.spawnLocations.push([50, 50]);
    $options.spawnLocations = $options.spawnLocations;
  }

  function saveOptions() {
    const json = JSON.stringify($options);
    localStorage.setItem("savedOptions", json);
    localStorage.setItem("savedPreset", selectedPreset);
  }

  afterUpdate(() => {
    if (debounce) {
      clearTimeout(debounce);
    }
    debounce = setTimeout(function() {
      saveOptions();
    }, 250);
  });

  onMount(() => {
    const savedOptions = localStorage.getItem("savedOptions");
    let savedPreset = localStorage.getItem("savedPreset");
    let hash = location.hash;
    if (hash) {
      hash = hash.replace("#", "").replace("_", " ");
      history.replaceState(null, "", "/");
      updateOptions(hash);
    } else {
      if (savedPreset) {
        selectedPreset = savedPreset;
        dispatch("setPreset", selectedPreset);
      }
      if (savedOptions) {
        const o = JSON.parse(savedOptions);
        if (!Array.isArray(o.spawnLocations) || o.spawnLocations.length === 0) {
          o.spawnLocations = [[50, 50]];
        } else {
          o.spawnLocations = o.spawnLocations.map(function (t) {
            if (Array.isArray(t) && t.length >= 2) {
              return [Number(t[0]) || 0, Number(t[1]) || 0];
            }
            return [50, 50];
          });
        }
        options.set(o);
      }
    }
  });
</script>

<section class="controls">

  <section class="presets" class:vanilla="{ selectedPreset === 'Vanilla'}">

    {#if selectedPreset === "Vanilla"}
      background
      <label class="color-holder" title="change background color for preview">
        <input class="color-input" type="color" bind:value={$color} />
        <span class="color-output" style="background-color: {$color};" />
      </label>
    {/if}

    <select
      class="presetList"
      bind:value={selectedPreset}
      on:change={() => {
        updateOptions();
      }}
      on:blur={() => {
        updateOptions();
      }}>
      {#each Object.keys($presets) as preset}
        <option value={preset}>{preset}</option>
      {/each}
    </select>

  </section>

  <Group name="Settings" visible>

    <Row name="count" type="number" props={{ min: 1, max: 1000 }} />

    <Group name="Shape">
      <Row name="shape" type="list" props={{ values: $enums.shapes }} />
      {#if $options.shape === 'image'}
        <Row name="imageUrl" type="string" />
      {/if}
      <Row name="style" type="list" props={{ values: $enums.styles }} />
      <Row name="minSize" type="number" props={{ min: 1, max: 100 }} />
      <Row name="maxSize" type="number" props={{ min: 1, max: 100 }} />
    </Group>

    <Group name="Animation">
      <Group name="Center Spawn">
        <Row name="spawnFromCenter" type="boolean" />
        <Row name="spawnArea" type="number" props={{ min: 1, max: 90, step: 1 }} />
        <Row name="staggerSpawn" type="number" props={{ min: 0, max: 20, step: 0.5 }} />
      </Group>
      <Group name="Spawn locations">
        {#each $options.spawnLocations as _, i}
          <div class="spawn-loc-row" role="group" aria-labelledby="spawn-loc-{i}-label">
            <div
              class="spawn-loc-label"
              id="spawn-loc-{i}-label"
              title={$rowDetails.spawnLocations}>
              spawn {i + 1}
            </div>
            <SpawnLocation index={i} labelId="spawn-loc-{i}" />
            <button
              class="remove-color"
              type="button"
              title="Remove this spawn location"
              disabled={$options.spawnLocations.length < 2}
              on:click={() => {
                if ($options.spawnLocations.length < 2) {
                  return;
                }
                $options.spawnLocations.splice(i, 1);
                $options.spawnLocations = $options.spawnLocations;
              }}>
              <span class="cross">
                {@html cross}
              </span>
            </button>
          </div>
        {/each}
        <div class="spawn-loc-row add-loc">
          <button type="button" on:click={addSpawnLocation} title="Add another spawn origin (x,y as % of width/height)">add location</button>
        </div>
      </Group>
      <Group name="Motion">
        <Row name="bounce" type="boolean" />
        <Row name="direction" type="number" props={{ min: 0, max: 360, step: 10 }} />
        <Row name="speed" type="number" props={{ min: 0, max: 100, step: 0.05 }} />
        <Row name="parallax" type="number" props={{ min: 0, max: 50, step: 0.1 }} />
        <Row name="drift" type="number" props={{ min: 0, max: 50, step: 0.1 }} />
        <Row name="xVariance" type="number" props={{ min: 0, max: 50, step: 0.1 }} />
        <Row name="yVariance" type="number" props={{ min: 0, max: 50, step: 0.1 }} />
      </Group>
      <Group name="Rotation">
        <Row name="rotate" type="boolean" />
        <Row name="rotation" type="number" props={{ min: 0, max: 20, step: 0.1 }} />
      </Group>
      <Group name="Alpha">
        <Row name="twinkle" type="boolean" />
        <Row name="minAlpha" type="number" props={{ min: -2, max: 2, step: 0.1 }} />
        <Row name="maxAlpha" type="number" props={{ min: -2, max: 2, step: 0.1 }} />
        <Row name="alphaSpeed" type="number" props={{ min: 0, max: 50, step: 0.1 }} />
        <Row name="alphaVariance" type="number" props={{ min: 0, max: 100 }} />
      </Group>
    </Group>
    <Group name="Rendering">
      <Row name="glow" type="number" props={{ min: 0, max: 50 }} />
      <Row name="composition" type="list" props={{ values: $enums.composites }} />
      <div class="composition-help">default: "source-over"</div>
    </Group>
    <Group name="Color" visible>
      {#each $options.color as color, i}
        <Row name="color" type="color" props={{ index: i }}>
          <button
            class="remove-color"
            title="Remove this color"
            on:click={() => {
              removeColor(i);
            }}>
            <span class="cross">
              {@html cross}
            </span>
          </button>
        </Row>
      {/each}
      <Row>
        <button on:click={addColor} title="Add a new color">add color</button>
      </Row>
    </Group>

  </Group>

  <section class="operations">
    <div class="import-export-btns">
      <button
        type="button"
        class="icon-btn"
        on:click={openExportJson}
        title="Export current settings (JSON with only non-default options)">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true">
          <path
            d="M20 14V10.6569C20 9.83935 20 9.4306 19.8478 9.06306C19.6955 8.69552 19.4065 8.40649 18.8284 7.82843L14.0919 3.09188C13.593 2.593 13.3436 2.34355 13.0345 2.19575C12.9702 2.165 12.9044 2.13772 12.8372 2.11401C12.5141 2 12.1614 2 11.4558 2C8.21082 2 6.58831 2 5.48933 2.88607C5.26731 3.06508 5.06508 3.26731 4.88607 3.48933C4 4.58831 4 6.21082 4 9.45584V14C4 17.7712 4 19.6569 5.17157 20.8284C6.34315 22 8.22876 22 12 22M13 2.5V3C13 5.82843 13 7.24264 13.8787 8.12132C14.7574 9 16.1716 9 19 9H19.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round" />
          <path
            d="M17 22C17.6068 21.4102 20 19.8403 20 19C20 18.1597 17.6068 16.5898 17 16M19 19H12"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        <span class="visually-hidden">Export settings</span>
      </button>
      <button
        type="button"
        class="icon-btn"
        on:click={openImportJson}
        title="Import settings: paste JSON and save">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true">
          <path
            d="M20 15.0057V10.6606C20 9.84276 20 9.43383 19.8478 9.06613C19.6955 8.69843 19.4065 8.40927 18.8284 7.83096L14.0919 3.09236C13.593 2.59325 13.3436 2.3437 13.0345 2.19583C12.9702 2.16508 12.9044 2.13778 12.8372 2.11406C12.5141 2 12.1614 2 11.4558 2C8.21082 2 6.58831 2 5.48933 2.88646C5.26731 3.06554 5.06508 3.26787 4.88607 3.48998C4 4.58943 4 6.21265 4 9.45908V14.0052C4 17.7781 4 19.6645 5.17157 20.8366C6.11466 21.7801 7.52043 21.9641 10 22M13 2.50022V3.00043C13 5.83009 13 7.24492 13.8787 8.12398C14.7574 9.00304 16.1716 9.00304 19 9.00304H19.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round" />
          <path
            d="M15 22C14.3932 21.4102 12 19.8403 12 19C12 18.1597 14.3932 16.5898 15 16M13 19H20"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        <span class="visually-hidden">Import settings</span>
      </button>
    </div>
    <button on:click={reset}>
      {#if !resetPrompt}Reset{:else}Confirm?{/if}
    </button>
  </section>

</section>

<style>
  .controls {
    position: fixed;
    right: 10px;
    top: 10px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(5px);
    width: 280px;
    border-radius: 5px;
    font-size: 11px;
    font-family: "Fira Code", Consolas, Menlo, Monaco, monospace;
    text-align: right;
    z-index: 10;
    max-height: 80%;
    overflow: auto;
    transform: translate3d(0, 0, 0);
  }

  .presets,
  .operations {
    margin-bottom: 5px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    opacity: 0.3;
    transition: opacity 3s ease;
  }

  .presets.vanilla {
    justify-content: space-between;
  }

  .controls:hover .presets,
  .controls:hover .operations {
    opacity: 1;
    transition: opacity .15s ease;
  }

  .operations {
    margin-top: 15px;
    margin-bottom: 0;
    justify-content: space-between;
  }

  .import-export-btns {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  :global(.visually-hidden) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  .icon-btn {
    padding: 2px 4px;
    background: transparent;
    border: none;
    box-shadow: none;
    color: #ccc;
    cursor: pointer;
    line-height: 0;
  }

  .icon-btn:hover {
    color: #fff;
  }

  .icon-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .spawn-loc-row {
    padding: 2px 5px;
    display: flex;
    gap: 10px;
    align-items: center;
    border-top: 1px solid #333;
    background: #1a1a1a;
  }

  .spawn-loc-label {
    width: 80px;
    flex: 1 0 auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }

  .spawn-loc-row.add-loc {
    justify-content: flex-end;
  }

  .color-holder {
    margin-left: 5px;
    display: flex;
    align-items: center;
    position: relative;
  }

  .color-input {
    padding: 0;
    width: 3em;
    height: 2.3em;
    opacity: 0;
    display: inline-block;
  }

  .color-output {
    position: absolute;
    top: 2px;
    left: -1px;
    right: -1px;
    bottom: 2px;
    border-radius: 3px;
    background: transparent;
    margin-right: 4px;
    border: 1px solid rgba( 255,255,255, 0.2 );
  }

  .color-output:hover {
    border-color: rgba( 255,255,255, 0.7 );
  }

  .remove-color {
    padding: 3px 5px 0;
    background: transparent;
    border: none;
    box-shadow: none;
  }

  .remove-color:hover .cross {
    fill: white;
  }

  .cross {
    width: 10px;
    height: 10px;
    display: inline-block;
    fill: #ddd;
  }

  .composition-help {
    text-align: right;
    padding: 5px;
    background-color: #1a1a1a;
  }

  .presetList {
    animation: expose 6s ease 1;
  }

  @keyframes expose {
    55% {
      background-color: #444;
    }
    60% {
      background-color: #888;
    }
    70% {
      background-color: #444;
    }
    77% {
      background-color: #888;
    }
  }
</style>
