"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { recipes, Recipe } from "@/mocks/recipes";

export type MealSlot = "breakfast" | "lunch" | "dinner";
export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type PlannedMeal = {
  recipeId: number;
  servings: number;
};

export type MealPlan = Record<DayKey, Record<MealSlot, PlannedMeal | null>>;

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: string;
  category: string;
  cost?: number;
  have: boolean;
};

export type RatingNote = {
  rating: number | null;
  note: string;
};

type AppState = {
  recipes: Recipe[];
  mealPlan: MealPlan;
  setMeal: (day: DayKey, slot: MealSlot, meal: PlannedMeal | null) => void;
  clearPlan: () => void;
  shopping: ShoppingItem[];
  addShoppingItem: (item: Omit<ShoppingItem, "id">) => void;
  updateShoppingItem: (id: string, item: Partial<ShoppingItem>) => void;
  removeShoppingItem: (id: string) => void;
  ratings: Record<number, RatingNote>;
  setRatingNote: (recipeId: number, rn: RatingNote) => void;
  q: string;
  setQ: (q: string) => void;
  diet: string;
  setDiet: (diet: string) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  selected: Recipe | null;
  setSelected: (el: Recipe| null) => void;
};

const defaultMealPlan = (): MealPlan => ({
  Mon: { breakfast: null, lunch: null, dinner: null },
  Tue: { breakfast: null, lunch: null, dinner: null },
  Wed: { breakfast: null, lunch: null, dinner: null },
  Thu: { breakfast: null, lunch: null, dinner: null },
  Fri: { breakfast: null, lunch: null, dinner: null },
  Sat: { breakfast: null, lunch: null, dinner: null },
  Sun: { breakfast: null, lunch: null, dinner: null },
});

const AppStateContext = createContext<AppState | undefined>(undefined);

const LS_KEYS = {
  mealPlan: "imeal.mealPlan.v1",
  shopping: "imeal.shopping.v1",
  ratings: "imeal.ratings.v1",
};

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [mealPlan, setMealPlan] = useState<MealPlan>(defaultMealPlan());
  const [shopping, setShopping] = useState<ShoppingItem[]>([]);
  const [ratings, setRatings] = useState<Record<number, RatingNote>>({});
  const [q, setQ] = useState("");
  const [diet, setDiet] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [selected, setSelected] = useState<any>("");

  // load from localStorage
  useEffect(() => {
    try {
      const mp = localStorage.getItem(LS_KEYS.mealPlan);
      if (mp) setMealPlan(JSON.parse(mp));
      const sh = localStorage.getItem(LS_KEYS.shopping);
      if (sh) setShopping(JSON.parse(sh));
      const rt = localStorage.getItem(LS_KEYS.ratings);
      if (rt) setRatings(JSON.parse(rt));
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.mealPlan, JSON.stringify(mealPlan));
    } catch {}
  }, [mealPlan]);
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.shopping, JSON.stringify(shopping));
    } catch {}
  }, [shopping]);
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.ratings, JSON.stringify(ratings));
    } catch {}
  }, [ratings]);

  const setMeal = (day: DayKey, slot: MealSlot, meal: PlannedMeal | null) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: { ...prev[day], [slot]: meal },
    }));
  };

  const clearPlan = () => setMealPlan(defaultMealPlan());

  const addShoppingItem = (item: Omit<ShoppingItem, "id">) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setShopping((prev) => [...prev, { ...item, id }]);
  };
  const updateShoppingItem = (id: string, item: Partial<ShoppingItem>) => {
    setShopping((prev) => prev.map((it) => (it.id === id ? { ...it, ...item } : it)));
  };
  const removeShoppingItem = (id: string) => {
    setShopping((prev) => prev.filter((it) => it.id !== id));
  };

  const setRatingNote = (recipeId: number, rn: RatingNote) => {
    setRatings((prev) => ({ ...prev, [recipeId]: rn }));
  };

  const value = useMemo<AppState>(() => ({
    recipes,
    mealPlan,
    setMeal,
    clearPlan,
    shopping,
    addShoppingItem,
    updateShoppingItem,
    removeShoppingItem,
    ratings,
    setRatingNote,
    q,
    setQ,
    diet,
    setDiet,
    difficulty,
    setDifficulty,
    selected,
    setSelected,
  }), [mealPlan, shopping, ratings, q, diet, difficulty, selected]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
};


