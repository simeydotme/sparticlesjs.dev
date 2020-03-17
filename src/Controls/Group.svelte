<script>

  import { groups } from "../stores/groups";
  import { slide } from "svelte/transition";
  import chevron from "../../public/img/chevron.svg";

  export let name;
  export let visible;
  $: isVisible = $groups[name] || visible;
  
  function toggle() {
    visible = isVisible = !isVisible;
    $groups[name] = isVisible;
  }

</script>


<section class="group">
  <div class="group-name" class:visible={isVisible} on:click={toggle}>
    <span class="arrow">
      {@html chevron}
    </span>
    {name}
  </div>
  {#if isVisible}
  <div class="group-content" transition:slide|local>
    <slot />
  </div>
  {/if}
</section>


<style>

  .group {
    width: 100%;
    text-align: left;
  }
  
  :global( .group .group ) {
    padding-left: 3px;
  }

  .group-name {
    color: #bbb;
    fill: #888;
    background: black;
    position: relative;
    user-select: none;
    padding: 5px 8px;
    padding-left: 2.2em;
    transition: all 0.2s ease;
    border-top: 1px solid #222;
  }


  .arrow {
    position: absolute;
    height: 14px;
    width: 14px;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.2s ease;
  }

  .visible .arrow {
    transform: translateY(-50%) rotate(90deg);
    left: 7px;
  }

  .visible {
    color: rgb(210, 255, 240);
    fill: rgb(210, 255, 240);
    padding-left: 2.8em;
  }

</style>
