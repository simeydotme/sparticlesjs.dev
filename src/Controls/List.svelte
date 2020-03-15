<script>

  import { options } from "../options.js";

  export let option;
  export let values = [];

</script>

<div class="list">

  <select bind:value={$options[ option ]}>
    {#each values as value}
      <option value="{value}">{value}</option>
    {/each}
  </select>

</div>

<style>

  .number {
    display: flex;
    align-items: center;
  }

  .range-holder {

  }

  .text-holder {
    width: 60px;
    margin-left: 5px;
  }

  .text,
  .range {
    width: 100%;
  }

  .text {
    text-align: right;
  }



</style>
