<script>
  import { fade } from "svelte/transition";
  import tick from "../../public/img/tick.svg";
  import { options } from "../stores/options.js";

  export let option;
</script>

<div class="boolean">

  <label class="check-holder">
    {#if $options[option]}
      <span transition:fade={{ duration: 100 }}>
        {@html tick}
      </span>
    {/if}
    <input class="check" type="checkbox" bind:checked={$options[option]} />
  </label>

</div>

<style>
  .check-holder {
    position: relative;
    display: inline-block;
  }

  .check-holder span {
    fill: aquamarine;
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(24%, 12%);
    width: 1.4em;
    height: 1.4em;
    z-index: 1;
  }

  .check {
    text-align: right;
  }
</style>
