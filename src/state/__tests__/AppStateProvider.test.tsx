import React from "react";
import { renderHook, act } from "@testing-library/react";
import { AppStateProvider, useAppState } from "@/state/AppStateProvider";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppStateProvider>{children}</AppStateProvider>
);

describe("AppStateProvider", () => {
  it("exposes and updates shopping list CRUD", () => {
    const { result } = renderHook(() => useAppState(), { wrapper });

    act(() => {
      result.current.addShoppingItem({ name: "Milk", quantity: "1L", category: "Dairy", have: false });
    });
    const item = result.current.shopping[0];
    expect(item.name).toBe("Milk");

    act(() => {
      result.current.updateShoppingItem(item.id, { have: true });
    });
    expect(result.current.shopping[0].have).toBe(true);

    act(() => {
      result.current.removeShoppingItem(item.id);
    });
    expect(result.current.shopping).toHaveLength(0);
  });

  it("sets and clears meal plan entries", () => {
    const { result } = renderHook(() => useAppState(), { wrapper });
    act(() => {
      result.current.setMeal("Mon", "breakfast", { recipeId: 1, servings: 2 });
    });
    expect(result.current.mealPlan.Mon.breakfast).toEqual({ recipeId: 1, servings: 2 });

    act(() => {
      result.current.clearPlan();
    });
    expect(result.current.mealPlan.Mon.breakfast).toBeNull();
  });

  it("handles ratings and timers", () => {
    const { result } = renderHook(() => useAppState(), { wrapper });
    act(() => {
      result.current.setRatingNote(1, { rating: 5, note: "Great" });
    });
    expect(result.current.ratings[1]).toEqual({ rating: 5, note: "Great" });

    act(() => {
      result.current.addTimer({ recipeId: 1, stepIndex: 0, endTime: Date.now() + 1000, duration: 60 });
    });
    expect(result.current.activeTimers).toHaveLength(1);
    act(() => {
      result.current.removeTimer(1, 0);
    });
    expect(result.current.activeTimers).toHaveLength(0);
  });
});


