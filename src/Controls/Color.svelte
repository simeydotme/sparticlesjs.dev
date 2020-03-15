<script>

  import { options } from "../options.js";

  export let option;
  export let index;

</script>

<div class="color">

  <div class="text-holder">
    <input class="text-input" 
      type="text" 
      bind:value={$options[ option ][index]} />
  </div>

  <label class="color-holder">
    <input class="color-input" 
      type="color" 
      bind:value={$options[ option ][index]} />
    {#if $options[ option ][index] === "rainbow"}
      <span class="color-output rainbow"></span>
    {:else}
      <span class="color-output" style="background-color: {$options[ option ][index]};"></span>
    {/if}
  </label>

</div>

<style>

  .color {
    display: flex;
    align-items: center;
    justify-content: end;
  }

  .text-holder,
  .color-holder {
    margin-left: 5px;
    display: flex;
    align-items: center;
    position: relative;
  }

  .text-input {
    width: 100%;
    text-align: right;
  }

  .color-input {
    padding: 0;
    width: 40px;
    opacity: 0;
  }

  .color-output {
    position: absolute;
    top: 1px;
    left: -1px;
    right: -1px;
    bottom: 1px;
    border-radius: 3px;
    background: transparent;
  }

  .rainbow {
    background-color: transparent;
    background-image: linear-gradient(-190deg, blue, cyan 15%, violet, fuchsia, orange, lime 85%, green);
  }

</style>
