<script>
  import String from "./String.svelte";
  import Number from "./Number.svelte";
  import List from "./List.svelte";
  import Color from "./Color.svelte";
  import Boolean from "./Boolean.svelte";

  import { rowDetails } from "../stores/row-details.js";

  export let name = "";
  export let option = name;
  export let type = "";
  export let props = {};

  $: labelId = name.replace(" ", "-").toLowerCase();
  $: detail = $rowDetails[name];
</script>

<label class="row" id="{labelId}-row" for="{labelId}-control">

  <div class="label" id="{labelId}-label" for="{labelId}-control"  title={detail}>{name}</div>

  {#if type === 'number'}
    <Number {option} {labelId} {...props} />
  {:else if type === 'list'}
    <List {option} {labelId} {...props} />
  {:else if type === 'color'}
    <Color {option} {labelId} {...props} />
  {:else if type === 'string'}
    <String {option} {labelId} {...props} />
  {:else if type === 'boolean'}
    <Boolean {option} {labelId} {...props} />
  {/if}

  <slot />

</label>

<style>
  .row {
    padding: 2px 5px;
    display: flex;
    gap: 10px;
    align-items: center;
    border-top: 1px solid #333;
    background: #1a1a1a;
  }

  .label {
    width: 80px;
    flex: 1 0 auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
