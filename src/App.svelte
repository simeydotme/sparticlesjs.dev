<script>
  import { onMount } from "svelte";
  import Sparticles from "sparticles";
  import Stats from "stats.js";

  import octocat from "../public/img/github.svg";
  import { options } from "./stores/options.js";
  import { presets } from "./stores/presets.js";
  import { backgrounds } from "./stores/backgrounds.js";
  import Controls from "./Controls.svelte";

  let jsonVisible = false;

  const isMobile = (/Mobi|Android/i.test(navigator.userAgent));
  let sparticles;
  let node;
  let debounce;
  let selectedPreset = "Vanilla";
  let ui = $backgrounds[ selectedPreset ];
  $: jsonOut = "";

  function track() {
    gtag("event", "github");
  };

  $: {
    addSparticles( node, $options );
  };

  function setNode( el ) {
    node = el;
  };

  function addSparticles( el, opts ) {
    if ( debounce ) {
      clearTimeout(debounce);
    }
    debounce = setTimeout( function() {
      updateJson();
      if ( el ) {
        if( sparticles && sparticles instanceof Sparticles ) {
          try {
            sparticles.destroy();
          } catch(e) {
            el.removeChild( sparticles.canvas );
          }
        }
        if ( isMobile ) {
          sparticles = new Sparticles( el, { count: 150 });
        } else {
          sparticles = new Sparticles( el, JSON.parse(JSON.stringify(opts)));
        }
      }
    }, 250 );
  }

  function addStats() {
    let fps = new Stats();
    fps.dom.classList.add("stats");
    document.body.appendChild(fps.dom);
    function statsDisplay() {
      fps.begin();
      fps.end();
      requestAnimationFrame(statsDisplay);
    }
    requestAnimationFrame(statsDisplay);
  }

  function updateJson() {
    jsonOut = JSON.stringify($options)
      .trim()
      .replace(/,/g,",\n\t")
      .replace( "{", "{\n\t" )
      .replace( "}", "\n}" );
  };

  function exportJson() {
    updateJson();
    jsonVisible = true;
  };

  function setPreset( preset ) {
    selectedPreset = preset.detail;
    ui = $backgrounds[ selectedPreset ];
  }

  onMount(() => {
    sparticles 
  });

</script>

<main use:setNode use:addStats>
  <section class="overlay">
    <h1>Sparticles</h1>
    <p>
      <a href="https://github.com/simeydotme/sparticles" target="_blank" on:click={track}>
        Documentation on Github<span class="octo">{@html octocat}</span>
      </a>
    </p>
  </section>
  <Controls on:setPreset={setPreset} on:saveJson={exportJson} />
    {#if ui.image}
    <div class="background" style="background-image: url({ui.image});">
    </div>
  {/if}
  {#if ui.author}
    <span class="credit" >
      <a href="{ui.url}?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
        Photo by {ui.author}</a> on Unsplash
    </span>
  {/if}
  <div class="exportsettings" class:jsonVisible>
    <div class="exportoverlay" on:click={() => { jsonVisible = false }}></div>
    <textarea spellcheck="false" readonly>{jsonOut}</textarea>
  </div>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  .overlay {
    text-align: right;
    text-shadow: 1px 1px 1px black;
    position: fixed;
    bottom: 10px;
    right: 15px;
    padding: 10px;
    border-radius: 10px;
    /* box-shadow: 0 0 20px 10px rgba(27, 31, 36, 1); */
    z-index: 1;
  }

  .exportsettings {
    display: none;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 5;
    justify-content: center;
    align-items: center;
  }

  .exportoverlay {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  .exportsettings textarea {
    width: 340px;
    height: 580px;
    padding: 15px;
    background: rgba(0, 0, 0, 0.8);
    border: none;
    border-radius: 10px;
    color: aquamarine;
    font-family: "Fira Code", Consolas, Monaco, monospace;
    font-size: 14px;
    z-index: 2;
  }

  .jsonVisible {
    display: flex;
  }

  h1 {
    font-size: 2.5rem;
    margin: 0;
    line-height: 1.2;
  }

  p,
  .octo,
  a {
    vertical-align: bottom;
    margin: 0;
  }

  a,
  .octo {
    display: inline-block;
  }

  .octo {
    fill: inherit;
    width: 20px;
    height: 20px;
    margin-left: 10px;
  }

  :global(.stats) {
    left: 10px !important;
    top: 10px !important;
    padding: 5px;
    border-radius: 5px;
    background: #100;
    filter: saturate(0);
  }

  :global(.save-row) {
    padding: 10px 5px!important;
    background: transparent!important;
  }

  :global(.dg .button) {
    color: black!important;
    font-size: 14px!important;
    padding: 6px 6px 8px!important;
    text-shadow: none!important;
  }

  :global(.button.gears,.button.save,.button.save-as,.button.revert) {
    display: none!important;
  }

  .background {
    position: fixed;
    z-index: -2;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-size: cover;
    background-position: center;
  }

  .credit {
    position: absolute;
    bottom: 20px;
    left: 20px;
    font-size: 12px;
    z-index: 12;
  }
</style>
