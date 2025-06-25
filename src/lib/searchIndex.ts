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

import type { RecipeInfo } from "./types";

/**
 * Check if the recipe matches a word from a query.
 * @param recipeInfo A recipe to check
 * @param word a query word
 * @returns true if the recipe (name, headline, ingredients) matches the recipe
 */
function matches(recipeInfo: RecipeInfo, word: string) {
  return (
    recipeInfo.name.toLowerCase().includes(word) ||
    recipeInfo.headline.toLowerCase().includes(word) ||
    recipeInfo.ingredients.some((ingr) =>
      ingr.name.toLowerCase().includes(word)
    )
  );
}

/**
 * A search index for recipes.
 */
export class SearchIndex {
  private readonly data: Map<string, RecipeInfo>;

  /**
   * @param data A map from a unique key (e.g., recipe slug or ID) to RecipeInfo.
   */
  constructor(data: Map<string, RecipeInfo>) {
    this.data = data;
  }

  /**
   * Finds keys of recipes that match all words in the query.
   * @param query The search query string.
   * @returns A set of keys that match the query.
   */
  findKeys(query: string): Set<string> {
    // Start with all keys from our data map.
    const matchingKeys = new Set(this.data.keys());

    // filter(Boolean) filters out empty strings
    const words = query.trim().split(/\s+/).filter(Boolean);

    for (const word of words) {
      const lowerCaseWord = word.toLowerCase();

      // Remove all the keys that don't contain the word.
      for (const key of matchingKeys) {
        const recipeInfo = this.data.get(key)!;
        if (!matches(recipeInfo, lowerCaseWord)) {
          matchingKeys.delete(key);
        }
      }
    }

    return matchingKeys;
  }

  /**
   * Searches the index for recipes matching the query.
   * @param query The search query string.
   * @returns An array of RecipeInfo objects that match the query.
   */
  public search(query: string): RecipeInfo[] {
    const keys = this.findKeys(query);
    return Array.from(keys).map((key) => this.data.get(key)!);
  }
}
