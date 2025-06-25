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

import { describe, it, expect, beforeEach } from "vitest";
import { SearchEngine } from "./searchEngine";
import type { RecipeInfo } from "./types";

const mockData = new Map<string, RecipeInfo>([
  [
    "Apple Pie",
    {
      name: "Apple Pie",
      rating: 4.5,
      headline: "Delicious apple pie",
      ingredients: [
        { name: "apple", quantity: "2" },
        { name: "flour", quantity: "200g" },
        { name: "sugar", quantity: "100g" },
      ],
      file: "apple_pie.jpg",
      calories: 300,
    },
  ],
  [
    "Banana Bread",
    {
      name: "Banana Bread",
      rating: 4.7,
      headline: "Moist banana bread",
      ingredients: [
        { name: "banana", quantity: "3" },
        { name: "flour", quantity: "250g" },
        { name: "sugar", quantity: "120g" },
      ],
      file: "banana_bread.jpg",
      calories: 250,
    },
  ],
  [
    "Carrot Cake",
    {
      name: "Carrot Cake",
      rating: 4.7,
      headline: "Classic carrot cake",
      ingredients: [
        { name: "carrot", quantity: "2" },
        { name: "flour", quantity: "220g" },
        { name: "sugar", quantity: "110g" },
      ],
      file: "carrot_cake.jpg",
      calories: 350,
    },
  ],
  [
    "Avocado Toast",
    {
      name: "Avocado Toast",
      rating: 4.2,
      headline: "Healthy avocado toast",
      ingredients: [
        { name: "avocado", quantity: "1" },
        { name: "bread", quantity: "2 slices" },
      ],
      file: "avocado_toast.jpg",
      calories: 200,
    },
  ],
]);

describe("SearchEngine", () => {
  let engine: SearchEngine;

  beforeEach(() => {
    engine = new SearchEngine(mockData);
  });

  it("returns sorted search results by rating desc, then name asc", () => {
    const results = engine.search("a");
    expect(results).toHaveLength(4);
    expect(results[0].name).toBe("Banana Bread"); // 4.7, B
    expect(results[1].name).toBe("Carrot Cake");  // 4.7, C
    expect(results[2].name).toBe("Apple Pie");    // 4.5
    expect(results[3].name).toBe("Avocado Toast");// 4.2
  });

  it("returns empty array if no results found", () => {
    const results = engine.search("zzz");
    expect(results).toEqual([]);
  });

  it("random returns null if no results", () => {
    expect(engine.random("zzz")).toBeNull();
  });

  it("random returns a result from filtered search", () => {
    const result = engine.random("apple");
    expect(result).toBeTruthy();
    expect(result?.name).toBe("Apple Pie");
  });

  it("random returns one of the possible results", () => {
    const possible = ["Banana Bread", "Carrot Cake"];
    // "cake" matches only "Carrot Cake"
    const results = [];
    for (let i = 0; i < 10; i++) {
      const r = engine.random("cake");
      if (r) results.push(r.name);
    }
    expect(results.every(name => name === "Carrot Cake")).toBe(true);
  });

  it("sorts by name ascending if ratings are equal", () => {
    const data = new Map<string, RecipeInfo>([
      ["B Pie", { name: "B Pie", rating: 4.5, headline: "B Pie headline", ingredients: [{ name: "ingredient1", quantity: "1" }], file: "b_pie.jpg", calories: 100 }],
      ["A Pie", { name: "A Pie", rating: 4.5, headline: "A Pie headline", ingredients: [{ name: "ingredient2", quantity: "1" }], file: "a_pie.jpg", calories: 110 }],
    ]);
    const e = new SearchEngine(data);
    const results = e.search("pie");
    expect(results[0].name).toBe("A Pie");
    expect(results[1].name).toBe("B Pie");
  });

  it("treats null ratings as lowest", () => {
    const data = new Map<string, RecipeInfo>([
      ["A Pie", { name: "A Pie", rating: 4.5, headline: "A Pie headline", ingredients: [{ name: "ingredient1", quantity: "1" }], file: "a_pie.jpg", calories: 100 }],
      ["B Pie", { name: "B Pie", rating: null, headline: "B Pie headline", ingredients: [{ name: "ingredient2", quantity: "1" }], file: "b_pie.jpg", calories: 110 }],
    ]);
    const e = new SearchEngine(data);
    const results = e.search("pie");
    expect(results[0].name).toBe("A Pie");
    expect(results[1].name).toBe("B Pie");
  });
});
