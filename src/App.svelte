<script>

  import octocat from "../public/github.svg";
  import Sparticles from "sparticles";
  import Stats from "stats.js";

  let fps, sparticles;

  function addSparticles(node) {

    sparticles = new Sparticles(node, {
      count: document.body.clientWidth < 600 ? 100 : 1000
    });

    addStats();

  }

  function addStats() {
    
    fps = new Stats();
    fps.dom.classList.add("stats");
    document.body.appendChild(fps.dom);
    function statsDisplay() {
      fps.begin();
      fps.end();
      requestAnimationFrame(statsDisplay);
    }
    requestAnimationFrame(statsDisplay);

  }


</script>

<main use:addSparticles>
  <section class="overlay">
    <h1>Sparticles</h1>
    <p>
      <a href="https://github.com/simeydotme/sparticles" target="_blank">
        Documentation on Github<span class="octo">
          {@html octocat}
        </span>
      </a>
    </p>
  </section>
</main>

<style>

  main {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  .overlay {
    text-align: right;
    position: fixed;
    bottom: 10px;
    right: 15px;
    padding: 20px;
    padding-left: 50px;
    border-radius: 10px;
    box-shadow: 0 0 20px 10px rgba(27, 31, 36, 1);
    z-index: 1;
    background: rgba(27, 31, 36, 0.85);
  }

  h1 {
    font-size: 2.5rem;
    margin: 0;
    line-height: 1.2;
  }

  p, .octo, a {
    vertical-align: bottom;
    margin: 0;
  }

  a, .octo {
    display: inline-block;
  }

  .octo {
    fill: inherit;
    max-width: 20px;
    max-height: 20px;
    margin-left: 10px;
  }

  :global(.stats) {
    left: 10px!important;
    top: 10px!important;
    padding: 5px;
    border-radius: 5px;
    background: #100;
    filter: saturate(0);
  }

</style>
