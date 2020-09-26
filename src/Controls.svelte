
<script>

  import { createEventDispatcher } from "svelte";

  import { options } from "./stores/options.js";
  import { presets } from "./stores/presets.js";
  import { enums } from "./stores/enums.js";

  import Group from "./Controls/Group.svelte";
  import Row from "./Controls/Row.svelte";

  import cross from "../public/img/x.svg";

  const dispatch = createEventDispatcher();
  let selectedPreset = "default";

  function updateOptions() {
    options.set( $presets[ selectedPreset ]);
    dispatch( "setPreset", selectedPreset );
  }

  function saveJson() {
    dispatch( "saveJson" );
  }

  function addColor() {
    $options.color.push("#fff");
    $options.color = $options.color;
  };

  function removeColor( index ) {
    $options.color.splice( index , 1 );
    $options.color = $options.color;
  }

</script>


<section class="controls">

  <section class="presets">

    <button on:click={saveJson}>Save Settings</button>

    <select bind:value={selectedPreset} on:change={()=>{updateOptions()}}>
      {#each Object.keys($presets) as preset}
        <option value={preset}>{preset}</option>
      {/each}
    </select>

  </section>

  <Group name="Settings" visible>

    <Row name="count" type="number" props={{ min: 1, max: 1000 }} />

    <Group name="Shape">
      <Row name="shape" type="list" props={{ values: $enums.shapes }} />
      {#if $options.shape === "image" }
      <Row name="imageUrl" type="string" />
      {/if}
      <Row name="style" type="list" props={{ values: $enums.styles }} />
      <Row name="minSize" type="number" props={{ min: 1, max: 100 }} />
      <Row name="maxSize" type="number" props={{ min: 1, max: 100 }} />
    </Group>

    <Group name="Visual" visible>
      <Row name="composition" type="list" props={{ values: $enums.composites }} />
      <Row name="glow" type="number" props={{ min: 0, max: 50 }} />
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
      <Group name="Color" visible>
        {#each $options.color as color,i}
          <Row name="color" type="color" props={{ index: i }}>
            <button class="remove-color" 
              title="Remove this color"
              on:click={() => { removeColor(i) }}>
              <span class="cross">
                {@html cross}
              </span>
            </button>
          </Row>
        {/each}
        <Row>
          <button on:click={addColor} title="Add a new color">
            add color
          </button>
        </Row>
      </Group>
    </Group>

  </Group>

</section>


<style>

  .controls {
    position: fixed;
    right: 10px;
    top: 10px;
    padding: 10px;
    background: rgba(0,0,0,0.4);
    width: 280px;
    border-radius: 5px;
    font-size: 11px;
    font-family: "Fira Code", Consolas, Menlo, Monaco, monospace;
    text-align: right;
    z-index: 10;
    max-height: 80%;
    overflow: auto;
    transform: translate3d(0,0,0);
  }

  .presets {
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
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

</style>
