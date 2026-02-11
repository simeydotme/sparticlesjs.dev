<script>
  import { options } from "../stores/options.js";

  export let labelId = "";
  export let option;
  export let min = 0;
  export let max = 100;
  export let step = 1;

  $: value = $options[option];
</script>

<div class="number">

  <div class="range-holder">
    <div class="range-bg" />
    <div class="range-fill" style="width: {((value - min) * 100) / (max - min)}%;" />
    <input class="range" type="range" bind:value={$options[option]} {min} {max} {step} id="{labelId}-control" />
  </div>

  <div class="text-holder">
    <input class="text" type="number" bind:value={$options[option]} {min} {max} {step} id="{labelId}-input" />
  </div>

</div>

<style>
  .number {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .range-holder {
    position: relative;
  }

  .range-bg,
  .range-fill {
    position: absolute;
    top: 0px;
    height: 18px;
    background: #444;
    width: 100%;
    border-radius: 2px;
    max-width: 100%;
  }

  .range-fill {
    background: aquamarine;
    border-right: 1px solid aquamarine;
  }

  .text-holder {
    width: 60px;
    margin-left: 5px;
  }

  .text,
  .range {
    width: 100%;
  }

  .range {
    appearance: none;
    padding: 0;
  }

  .text {
    text-align: right;
  }
</style>
