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
import { SearchIndex } from "./searchIndex";
import type { RecipeInfo } from "./types";

/**
 * Helper function to create a pre-populated SearchIndex for tests.
 */
const setupTestIndex = (): SearchIndex => {
  const recipes = new Map<string, RecipeInfo>([
    [
      "Stew",
      {
        name: "Stew",
        headline: "with meat and veggies",
        file: "Stew.pdf",
        rating: 4.0,
        calories: 800,
        ingredients: [{ name: "beef", quantity: "500 g" }],
      },
    ],
    [
      "Steak",
      {
        name: "Steak",
        headline: "juicy beefy",
        file: "Steak.pdf",
        rating: 3.0,
        calories: 800,
        ingredients: [{ name: "beef", quantity: "500 g" }],
      },
    ],
  ]);
  return new SearchIndex(recipes);
};

describe("SearchIndex", () => {
  let index: SearchIndex;

  beforeEach(() => {
    index = setupTestIndex();
  });

  it("should find keys by recipe name", () => {
    const keys = index.findKeys("Stew");
    expect(keys).toEqual(new Set(["Stew"]));
  });

  it("should return a set of all keys if the query is empty", () => {
    const keys = index.findKeys("");
    expect(keys).toEqual(new Set(["Steak", "Stew"]));
  });

  it("should return a set of all keys if the query is whitespace-only", () => {
    const keys = index.findKeys("     ");
    expect(keys).toEqual(new Set(["Steak", "Stew"]));
  });

  it("should return an empty set for a term that does not match", () => {
    const keys = index.findKeys("Tacos");
    expect(keys).toEqual(new Set());
  });

  it("should find keys with a case-insensitive search on name", () => {
    const keys = index.findKeys("stew");
    expect(keys).toEqual(new Set(["Stew"]));
  });

  it("should still find keys if the query only matches a part of a word", () => {
    const keys = index.findKeys("tew");
    expect(keys).toEqual(new Set(["Stew"]));
  });

  it("should find keys with a case-insensitive search on headline", () => {
    const keys = index.findKeys("VEGGIES");
    expect(keys).toEqual(new Set(["Stew"]));
  });

  it("should find keys with a case-insensitive search on ingredients", () => {
    const keys = index.findKeys("BeEf");
    expect(keys).toEqual(new Set(["Stew", "Steak"]));
  });

  it("should require all words in the query to match for findKeys", () => {
    const keys = index.findKeys("beef veggies");
    expect(keys).toEqual(new Set(["Stew"]));
  });

  it("should return the full recipe object from a search", () => {
    const recipes = index.search("beef veggies");
    expect(recipes).toHaveLength(1);
    expect(recipes[0].name).toBe("Stew");
  });
});
