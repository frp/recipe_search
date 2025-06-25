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

import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { expect, it, vi, describe } from "vitest";
import Search from "./Search.svelte";
import type { RecipeInfo } from "./types";

// Fixtures to be used in tests that require some data
const steak: RecipeInfo = {
  name: "Steak",
  headline: "nice and juicy",
  ingredients: [
    {
      name: "beef",
      quantity: "200g",
    },
  ],
  rating: 4.0,
  file: "Steak.pdf",
  calories: 500,
};
const stew: RecipeInfo = {
  name: "Stew",
  headline: "with pork",
  ingredients: [
    {
      name: "pork",
      quantity: "300g",
    },
  ],
  rating: 3.55,
  file: "Stew.pdf",
  calories: 350,
};

function getDataMap(...recipes: RecipeInfo[]) {
  return new Map(recipes.map((r) => [r.name, r]));
}

describe("Search", () => {
  it("displays all recipes on load", async () => {
    render(Search, { props: { data: getDataMap(steak, stew) } });
    // Both recipes should be visible
    expect(screen.queryByText(/Steak/)).not.toBeNull();
    expect(screen.queryByText(/Stew/)).not.toBeNull();
    // No error
    expect(screen.queryByText(/Fehler/)).toBeNull();
  });

  it("filters recipes by query", async () => {
    render(Search, { props: { data: getDataMap(steak, stew) } });
    const input = screen.getByPlaceholderText("Suchen...");
    await userEvent.type(input, "beef");
    // Only Steak should be visible
    expect(screen.queryByText(/Steak/)).not.toBeNull();
    expect(screen.queryByText(/Stew/)).toBeNull();
  });

  it("shows all ingredients for a recipe", async () => {
    render(Search, { props: { data: getDataMap(steak) } });
    expect(screen.queryByText(/beef/)).not.toBeNull();
  });

  it("shows error if no recipe matches and random is clicked", async () => {
    render(Search, { props: { data: getDataMap(steak, stew) } });
    const input = screen.getByPlaceholderText("Suchen...");
    await userEvent.type(input, "notfound");
    // Click random button
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(screen.queryByText(/Kein passendes Rezept gefunden/)).not.toBeNull();
  });

  it("opens a random recipe in a new tab if available", async () => {
    render(Search, { props: { data: getDataMap(steak) } });
    window.open = vi.fn();
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(window.open).toHaveBeenCalledWith("/recipes/Steak.pdf", "_blank");
  });
});
