<script>
  import String from "./String.svelte";
  import Number from "./Number.svelte";
  import List from "./List.svelte";
  import Color from "./Color.svelte";
  import Boolean from "./Boolean.svelte";

  export let name = "";
  export let option = name;
  export let type = "";
  export let props = {};
</script>

<label class="row">

  <div class="label">{name}</div>

  {#if type === 'number'}
    <Number {option} {...props} />
  {:else if type === 'list'}
    <List {option} {...props} />
  {:else if type === 'color'}
    <Color {option} {...props} />
  {:else if type === 'string'}
    <String {option} {...props} />
  {:else if type === 'boolean'}
    <Boolean {option} {...props} />
  {/if}

  <slot />

</label>

<style>
  .row {
    padding: 2px 5px;
    display: flex;
    align-items: center;
    border-top: 1px solid #333;
    background: #1a1a1a;
  }

  .label {
    width: 80px;
    flex: 1 0 auto;
  }
</style>
