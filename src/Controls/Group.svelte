<script>

  import { slide } from "svelte/transition";
  import chevron from "../../public/img/chevron.svg";

  export let name;
  export let visible;

  function toggle() {
    visible = !visible;
  }

</script>


<section class="group">
  <div class="group-name" class:visible on:click={toggle}>
    <span class="arrow">
      {@html chevron}
    </span>
    {name}
  </div>
  {#if visible}
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
    color: #ddd;
    fill: #ddd;
    background: black;
    position: relative;
    user-select: none;
    padding: 5px 8px;
    padding-left: 1.8em;
    transition: all 0.2s ease;
    border-top: 1px solid #222;
  }


  .arrow {
    position: absolute;
    height: 1em;
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
    padding-left: 2.2em;
  }

</style>
