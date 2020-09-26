<script>
  import { options } from "../stores/options.js";

  export let option;
  export let values = [];
</script>

<div class="list">

  <select bind:value={$options[option]}>
    {#each values as value}
      <option {value}>{value}</option>
    {/each}
  </select>

</div>

<style>

</style>
