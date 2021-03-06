<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";

  import { options } from "./stores/options.js";
  import { presets } from "./stores/presets.js";
  import { enums } from "./stores/enums.js";
  import { color } from "./stores/backgrounds.js";

  import Group from "./Controls/Group.svelte";
  import Row from "./Controls/Row.svelte";

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

  function saveJson() {
    dispatch("saveJson");
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
        options.set(JSON.parse(savedOptions));
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
        <Row name="alphaSpeed" type="number" props={{ min: 0, max: 100, step: 0.1 }} />
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
    <button on:click={saveJson}>Save Settings</button>
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
