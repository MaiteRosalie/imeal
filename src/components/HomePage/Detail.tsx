import { Recipe } from "@/mocks/recipes";
import { useMemo, useState } from "react";


import { useAppState } from "@/state/AppStateProvider";

export type DetailProps = { recipe: Recipe }

export const Detail = ({ recipe: {  title, description, ingredients, steps, cuisine, nutrition, id } }: DetailProps) => {
  const { setRatingNote, ratings } = useAppState();
  const [tmpRating, setTmpRating] = useState<number>(0);
  const [tmpNote, setTmpNote] = useState<string>("");
  
  return (
    <div className="space-y-3">
    <h2 className="text-xl font-bold">{title}</h2>
    <div className="text-sm text-gray-600">{description}</div>
    <div className="space-y-3">
      <div className="text-sm">Cuisine: {cuisine}</div>
      <div className="text-sm">Nutrition: P {nutrition.protein}g • C {nutrition.carbs}g • F {nutrition.fat}g</div>
      <div>
        <h3 className="font-semibold">Ingredients</h3>
        <ul className="list-disc pl-5 text-sm">
          {ingredients.map((i, idx) => (
            <li key={idx}>{i.name} - {i.quantity} {i.unit}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold">Steps</h3>
        <ol className="list-decimal pl-5 text-sm">
          {steps.map((s, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span>{s.text}</span>
              <button
                className="text-xs underline"
                onClick={() => {
                  const end = Date.now() + s.seconds * 1000;
                  const tick = () => {
                    const left = Math.max(0, Math.floor((end - Date.now()) / 1000));
                    if (left > 0) setTimeout(tick, 1000);
                  };
                  tick();
                  if (typeof window !== "undefined") alert(`Timer started for ${s.seconds} seconds`);
                }}
              >
                Start {Math.round(steps[idx].seconds / 60)}m timer
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Rating & Notes</h3>
        <div className="flex items-center gap-2">
          <select className="border rounded p-1" value={tmpRating} onChange={(e) => setTmpRating(Number(e.target.value))}>
            <option value={0}>No rating</option>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ★</option>)}
          </select>
          <input className="border rounded p-1 flex-1" placeholder="Notes..." value={tmpNote} onChange={(e) => setTmpNote(e.target.value)} />
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => {
              setRatingNote(id, { rating: tmpRating || null, note: tmpNote });
              setTmpNote("");
              setTmpRating(0);
            }}
          >
            Save
          </button>
        </div>
        {ratings[id] && (
          <div className="text-xs text-gray-600">
            Saved: {ratings[id].rating ? `${ratings[id].rating} ★` : "No rating"} — {ratings[id].note}
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
