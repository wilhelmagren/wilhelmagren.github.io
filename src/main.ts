import "./style.css";

import init, { run_demo } from "./tqe-wasm/tqe";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <main class="page">
    <header class="hero">
      <h1>Tiny Query Engine</h1>

      <p>
        A small vectorized, streaming*, pull-based query engine written in Rust
        and running in your browser with WebAssembly.
        <br><br>
        *It can't lazily stream on blocking/wide operations like GROUP BY because
        it's Volcano-style.
      </p>
    </header>

    <section class="playground">
      <div class="editor">
        <div class="toolbar">
          <span>Query</span>
          <button id="run">Run</button>
        </div>

        <textarea id="query" spellcheck="false">
df = ctx.parquet_bytes(
        "weather_stations",
        Bytes::copy_from_slice(parquet),
    )
    .agg(
          vec![col("station_name")],
          vec![
              min(col("measurement")),
              max(col("measurement")),
              avg(col("measurement")),
          ],
    )
        </textarea>
      </div>

      <div class="output">
        <h2>Result</h2>
        <pre id="result"></pre>
      </div>

      <div class="plan">
        <h2>Physical Plan</h2>
        <pre id="physical-plan"></pre>
      </div>
    </section>
  </main>
`;

async function main() {
  // Initialize the WASM module once.
  await init();

  // Load the demo dataset once.
  const response = await fetch("/data/weather_stations_small.parquet");

  if (!response.ok) {
    throw new Error(`Failed to load dataset: ${response.status}`);
  }

  const parquet = new Uint8Array(
    await response.arrayBuffer()
  );

  const runButton =
    document.querySelector<HTMLButtonElement>("#run")!;

  const result =
    document.querySelector<HTMLElement>("#result")!;

  runButton.addEventListener("click", () => {
    try {
      result.textContent = run_demo(parquet);
    } catch (err) {
      result.textContent = String(err);
    }
  });
}

main();
