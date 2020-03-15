<script>

  import { options } from "../options.js";

  export let option;

</script>

  <div class="string">

    <div class="text-holder">
      <input class="text" 
        type="text" 
        bind:value={$options[ option ]} />
    </div>

  </div>

<style>

  .string {
    display: flex;
    align-items: center;
  }

  .text-holder {
    width: 160px;
    margin-left: 5px;
  }

  .text {
    width: 100%;
    text-align: right;
  }

</style>
