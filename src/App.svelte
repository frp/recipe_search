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
  import Search from "./lib/Search.svelte";
  import type { RecipeInfo } from "./lib/types";
  import data from "./search_data.json";

  const dataMap = new Map<string, RecipeInfo>(Object.entries(data));
</script>

<div class="card p-4 my-5 shadow-lg border-0 rounded-3">
  <h2 class="text-center mb-4 text-primary">Suchen nach Essen</h2>
  <Search data={dataMap}/>
</div>
