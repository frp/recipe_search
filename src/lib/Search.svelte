<!-- Copyright 2025 Roman F

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. -->

<script lang="ts">
  import type { RecipeInfo } from "./types";
  import { SearchEngine } from "./searchEngine";

  interface Props {
    data: Map<string, RecipeInfo>;
  }

  let { data }: Props = $props();
  const engine = new SearchEngine(data);

  const RECIPE_STORAGE = "/recipes";

  let results: RecipeInfo[] = $state([]);

  let query = $state("");

  let errors: string[] = $state([]);

  $effect(() => {
    results = engine.search(query);
  });

  function selectRandom() {
    const randomRecipe = engine.random(query);
    if (randomRecipe) {
      window.open(RECIPE_STORAGE + "/" + randomRecipe.file, "_blank")?.focus();
    } else {
      errors.push("Kein passendes Rezept gefunden");
    }
  }
</script>

<form onsubmit={(e) => e.preventDefault()} class="input-group mb-3">
  <input
    type="text"
    class="form-control rounded-start-2 border-end-0"
    placeholder="Suchen..."
    bind:value={query}
  />
  <button
    class="btn btn-primary rounded-end-2"
    type="submit"
    onclick={selectRandom}>Zufällig auswählen</button
  >
</form>

<section class="mt-4">
  {#each errors as error}
    <div class="alert alert-danger" role="alert">
      {error}
    </div>
  {/each}
  {#each results as result}
    <div class="card p-3 mb-3 bg-light rounded-2 border">
      <h5 class="mb-1">
        <a href="{RECIPE_STORAGE}/{result.file}">{result.name}</a>
      </h5>
      <p class="text-success small mb-1">{result.headline}</p>
      <p class="text-secondary small">Rating: {result.rating}</p>
      <ul class="text-secondary small">
        {#each result.ingredients as ingredient}
          <li>{ingredient.name}</li>
        {/each}
      </ul>
    </div>
  {/each}
</section>
