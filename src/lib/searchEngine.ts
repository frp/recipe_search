// Copyright 2025 Roman F
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { SearchIndex } from "./searchIndex";
import type { RecipeInfo } from "./types";

export class SearchEngine {
  private readonly index: SearchIndex;

  constructor(data: Map<string, RecipeInfo>) {
    this.index = new SearchIndex(data);
  }

  search(query: string): Array<RecipeInfo> {
    const results = this.index.search(query);
    results.sort((a, b) => {
      // Sort by rating descending, treating null as lowest, then by name ascending
      const aRating = a.rating ?? 0;
      const bRating = b.rating ?? 0;
      if (bRating !== aRating) {
        return bRating - aRating;
      }
      return a.name.localeCompare(b.name);
    });
    return results;
  }

  random(query: string): RecipeInfo | null {
    const results = this.index.search(query);
    if (results.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * results.length);
    return results[randomIndex];
  }
}