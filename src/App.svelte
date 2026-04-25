<script>
  import { onMount } from "svelte";
  import Sparticles from "sparticles";
  import Stats from "stats.js";

  import octocat from "../public/img/github.svg";
  import { options } from "./stores/options.js";
  import { backgrounds, color } from "./stores/backgrounds.js";
  import Controls from "./Controls.svelte";
  import { mergeSparticlesOptionsImport, optionsDeltaFromSparticlesDefaults } from "./lib/sparticlesOptionDefaults.js";

  let jsonVisible = false;
  /** @type {"export" | "import"} */
  let jsonPanelMode = "export";
  let jsonText = "";
  /** @type {{ kind: "ok" | "warn" | "err"; text: string } | null} */
  let importFeedback = null;

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  let sparticles;
  let node;
  let debounce;
  let selectedPreset = "Vanilla";
  let ui = $backgrounds[selectedPreset];

  function track() {
    gtag("event", "github");
  }

  $: {
    addSparticles(node, $options);
  }

  function setNode(el) {
    node = el;
  }

  function addSparticles(el, opts) {
    if (debounce) {
      clearTimeout(debounce);
    }
    debounce = setTimeout(function() {
      updateJson();
      if (el) {
        if (sparticles && sparticles instanceof Sparticles) {
          try {
            sparticles.destroy();
          } catch (e) {
            el.removeChild(sparticles.canvas);
          }
        }
        if (isMobile) {
          sparticles = new Sparticles(el, { count: 150 });
        } else {
          sparticles = new Sparticles(el, JSON.parse(JSON.stringify(opts)));
        }
      }
    }, 250);
  }

  function addStats() {
    var fps = new Stats();
    fps.dom.classList.add("stats");
    document.body.appendChild(fps.dom);
    function statsDisplay() {
      fps.begin();
      fps.end();
      requestAnimationFrame(statsDisplay);
    }
    requestAnimationFrame(statsDisplay);
  }

  function formatJson(obj) {
    var o = obj && typeof obj === "object" ? obj : {};
    if (Object.keys(o).length === 0) {
      return "{}\n";
    }
    return (
      JSON.stringify(obj, null, 2)
      .replace(/\[.*\n\s*(.*),\n\s*(.*)\n.*\]/g, "[$1,$2]")
      .trim()
    );
  }

  function updateJson() {
    if (jsonVisible && jsonPanelMode === "import") {
      return;
    }
    if (jsonVisible && jsonPanelMode === "export") {
      jsonText = formatJson(optionsDeltaFromSparticlesDefaults($options));
    }
  }

  function openExportJson() {
    importFeedback = null;
    jsonPanelMode = "export";
    jsonText = formatJson(optionsDeltaFromSparticlesDefaults($options));
    jsonVisible = true;
  }

  function openImportJson() {
    importFeedback = null;
    jsonPanelMode = "import";
    jsonText = "";
    jsonVisible = true;
  }

  function importSaveAndApply() {
    importFeedback = null;
    var parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      var em = e && /** @type {Error} */ (e).message ? /** @type {Error} */ (e).message : "parse error";
      importFeedback = { kind: "err", text: "Invalid JSON: " + em + "." };
      return;
    }
    if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) {
      importFeedback = { kind: "err", text: "JSON must be a single object, not an array or primitive." };
      return;
    }
    if (
      Object.prototype.hasOwnProperty.call(/** @type {object} */ (parsed), "spawnFromCenter") &&
      !Object.prototype.hasOwnProperty.call(/** @type {object} */ (parsed), "spawnFromPoint")
    ) {
      var legacyPoint = /** @type {Record<string, unknown>} */ (parsed).spawnFromCenter;
      /** @type {Record<string, unknown>} */ (parsed).spawnFromPoint = Boolean(legacyPoint);
      delete /** @type {Record<string, unknown>} */ (parsed).spawnFromCenter;
    }
    var merged = mergeSparticlesOptionsImport(
      $options,
      /** @type {Record<string, unknown>} */ (parsed)
    );
    options.set(merged.options);
    if (merged.warnings.length) {
      importFeedback = {
        kind: "warn",
        text: "Settings applied. " + merged.warnings.join(" "),
      };
    } else {
      importFeedback = { kind: "ok", text: "Settings imported; canvas re-rendered." };
      jsonVisible = false;
    }
  }

  function closeJsonPanel() {
    jsonVisible = false;
    importFeedback = null;
  }

  function setPreset(preset) {
    selectedPreset = preset.detail;
    ui = $backgrounds[selectedPreset];
  }
</script>

<main use:setNode use:addStats>
  <section class="overlay">
    <h1>Sparticles</h1>
    <p>
      <a href="https://github.com/simeydotme/sparticles" target="_blank" on:click={track}>
        Documentation on Github
        <span class="octo">
          {@html octocat}
        </span>
      </a>
    </p>
  </section>

  {#if !isMobile}
    <Controls
      on:setPreset={setPreset}
      on:saveJson={openExportJson}
      on:importJson={openImportJson} />
    {#if ui.image}
      <div class="background" style="background-image: url({ui.image});" />
    {:else}
      <div class="background" style="background-color: {$color};" />
    {/if}
    {#if ui.author}
      <span class="credit">
        <a
          href="{ui.url}?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          target="_blank">
          Photo by {ui.author}
        </a>
        on Unsplash
      </span>
    {/if}
    <div class="exportsettings" class:jsonVisible>
      <div
        class="exportoverlay"
        on:click={closeJsonPanel} />
      <div class="exportcontent" on:click|stopPropagation>
        <h3>
          {#if jsonPanelMode === "import"}
            Paste a Sparticles options object (only changed keys, or a full set). Then save to apply to the
            controls and re-render the canvas.
          {:else}
            JSON contains only options that differ from the Sparticles v2.2.0 library defaults. Copy to use
            in your app.
          {/if}
        </h3>
        <textarea spellcheck="false" class:import-mode={jsonPanelMode === "import"} bind:value={jsonText} readonly={jsonPanelMode === "export"}></textarea>
        {#if importFeedback}
          <p
            class="import-feedback"
            class:ok={importFeedback.kind === "ok"}
            class:warn={importFeedback.kind === "warn"}
            class:err={importFeedback.kind === "err"}>
            {importFeedback.text}
          </p>
        {/if}
        {#if jsonPanelMode === "import"}
          <div class="import-actions">
            <button type="button" class="import-save" on:click={importSaveAndApply}>Save and import settings</button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
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
    z-index: 1;
  }

  .exportsettings {
    display: none;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 500;
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

  .exportcontent {
    z-index: 2;
    padding: 15px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    max-width: 90vw;
  }

  .exportcontent h3 {
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    margin: 0 0 10px 0;
    line-height: 1.4;
  }

  .exportcontent textarea {
    width: 75vw;
    max-width: 900px;
    height: 60vh;
    border: none;
    background: transparent;
    color: aquamarine;
    font-family: "Fira Code", Consolas, Monaco, monospace;
    font-size: 14px;
  }

  .exportcontent textarea.import-mode {
    color: #e0e0e0;
  }

  .import-feedback {
    margin: 8px 0 0 0;
    font-size: 12px;
    line-height: 1.3;
  }

  .import-feedback.ok {
    color: #7dffb0;
  }

  .import-feedback.warn {
    color: #ffdb7d;
  }

  .import-feedback.err {
    color: #ff8b8b;
  }

  .import-actions {
    display: flex;
    justify-content: center;
    margin-top: 12px;
  }

  .import-save {
    font-family: "Fira Code", Consolas, Menlo, Monaco, monospace;
    font-size: 12px;
    padding: 8px 16px;
    border-radius: 4px;
    background: #333;
    color: #eee;
    border: 1px solid #555;
    cursor: pointer;
  }

  .import-save:hover {
    background: #444;
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
    padding: 10px 5px !important;
    background: transparent !important;
  }

  :global(.dg .button) {
    color: black !important;
    font-size: 14px !important;
    padding: 6px 6px 8px !important;
    text-shadow: none !important;
  }

  :global(.button.gears, .button.save, .button.save-as, .button.revert) {
    display: none !important;
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
