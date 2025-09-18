"use client";
import { Header, Container, Footer, Badge } from "@/components";
import { useAppState, DayKey, MealSlot } from "@/state/AppStateProvider";

const days: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const slots: MealSlot[] = ["breakfast", "lunch", "dinner"];

export default function CalendarPage() {
  const { mealPlan, recipes, setMeal, clearPlan } = useAppState();

  return (
    <>
      <Header />
      <Container as="main" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Weekly Meal Planner</h1>
          <button className="cursor-pointer text-sm text-red-600" onClick={clearPlan}>
            Clear plan
          </button>
        </div>

        <div className="w-full">
          <table className="w-full table-fixed border border-gray-200 text-sm">
            <thead>
              <tr>
                <th className="p-2 border-b w-24" />
                {days.map((d) => (
                  <th key={d} className="p-2 border-b text-left truncate">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot} className="align-top">
                  <td className="p-2 border-b font-semibold capitalize">
                    {slot}
                  </td>
                  {days.map((day) => {
                    const planned = mealPlan[day][slot];
                    const recipe = planned
                      ? recipes.find((r) => r.id === planned.recipeId)
                      : null;
                    return (
                      <td
                        key={`${day}-${slot}`}
                        className="p-2 border-b align-top"
                      >
                        {recipe ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">
                                {recipe.title}
                              </span>
                              <button
                                className="cursor-pointer text-xs text-red-600"
                                onClick={() => setMeal(day, slot, null)}
                              >
                                ✖
                              </button>
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {recipe.dietaryTags?.map((t) => (
                                <Badge
                                  key={t}
                                  className="bg-blue-100 text-blue-800 text-xs"
                                >
                                  {t}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-xs text-gray-600">
                              ⏰ {recipe.cookingTime} • ★ {recipe.difficulty}
                            </div>
                            <div className="text-xs truncate">
                              <span className="mr-2">
                                P: {recipe.nutrition.protein}g
                              </span>
                              <span className="mr-2">
                                C: {recipe.nutrition.carbs}g
                              </span>
                              <span>F: {recipe.nutrition.fat}g</span>
                            </div>
                          </div>
                        ) : (
                          <select
                            className="border rounded p-1 text-xs w-full"
                            onChange={(e) => {
                              const id = Number(e.target.value);
                              if (!id) return;
                              setMeal(day, slot, { recipeId: id, servings: 1 });
                              e.currentTarget.selectedIndex = 0;
                            }}
                          >
                            <option value="">+ Add</option>
                            {recipes.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.title}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
      <Footer />
    </>
  );
}
