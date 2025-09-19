import { Recipe } from "@/mocks/recipes";
import { useState, useRef, useEffect } from "react";

import { useAppState } from "@/state/AppStateProvider";

export type DetailProps = { recipe: Recipe };

export const Detail = ({
  recipe: { title, description, ingredients, steps, cuisine, nutrition, id },
}: DetailProps) => {
  const { setRatingNote, ratings, activeTimers, addTimer, removeTimer } =
    useAppState();
  const [tmpRating, setTmpRating] = useState<number>(0);
  const [tmpNote, setTmpNote] = useState<string>("");
  const timerRefs = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const countdownRefs = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const handleTimer = (seconds: number, minutes: number, stepIndex: number) => {
    // Clear any existing timers for this step
    const existingTimer = timerRefs.current.get(stepIndex);
    const existingCountdown = countdownRefs.current.get(stepIndex);
    if (existingTimer) clearTimeout(existingTimer);
    if (existingCountdown) clearInterval(existingCountdown);

    // Add to global active timers and set initial countdown
    const endTime = Date.now() + seconds * 1000;
    addTimer({ recipeId: id, stepIndex, endTime, duration: seconds });

    // Show start notification
    if (typeof window !== "undefined") {
      // Try to use browser notifications if available
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`Timer Started`, {
          body: `Step ${stepIndex + 1}: ${minutes}m timer started`,
          icon: "/favicon.ico",
        });
      } else {
        alert(`Timer started for Step ${stepIndex + 1}: ${minutes}m`);
      }
    }

    // Set up the main timer
    const timer = setTimeout(() => {
      removeTimer(id, stepIndex);

      // Show completion notification
      if (typeof window !== "undefined") {
        // Try to use browser notifications if available
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`Timer Finished!`, {
            body: `Step ${stepIndex + 1} is complete: ${steps[stepIndex].text}`,
            icon: "/favicon.ico",
          });
        } else {
          alert(
            `⏰ Timer finished! Step ${stepIndex + 1} is complete: ${
              steps[stepIndex].text
            }`
          );
        }
      }

      // Clean up the timer references
      timerRefs.current.delete(stepIndex);
      countdownRefs.current.delete(stepIndex);
    }, seconds * 1000);

    // Store the timer references
    timerRefs.current.set(stepIndex, timer);
  };

  // Request notification permission on mount
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timerRefs.current.forEach((timer) => clearTimeout(timer));
      // eslint-disable-next-line react-hooks/exhaustive-deps
      countdownRefs.current.forEach((countdown) => clearInterval(countdown));
    };
  }, []);
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="text-sm text-gray-600">{description}</div>
      <div>
        <div className="text-sm">Cuisine: {cuisine}</div>
        <div className="text-sm">
          Nutrition: P {nutrition.protein}g • C {nutrition.carbs}g • F{" "}
          {nutrition.fat}g
        </div>
        <div>
          <h3 className="font-semibold mt-2 mb-1">Ingredients</h3>
          <ul className="list-disc pl-5 text-sm">
            {ingredients.map((i, idx) => (
              <li key={idx}>
                {i.name} - {i.quantity} {i.unit}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mt-2 mb-1">Steps</h3>
          <ul className="list-disc pl-5 text-sm">
            {steps.map((s, idx) => {
              const minutes = Math.round(steps[idx].seconds / 60);
              const isTimerActive = activeTimers.some(
                (t) => t.recipeId === id && t.stepIndex === idx
              );

              return (
                <li key={idx}>
                  <span>{s.text}</span>
                  <button
                    className="cursor-pointer text-xs underline ml-auto"
                    onClick={() => {
                      handleTimer(s.seconds, minutes, idx);
                    }}
                  >
                    Start ${minutes}m timer {isTimerActive ? "[Started]" : ""}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold mt-2">Rating & Notes</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setRatingNote(id, { rating: tmpRating || null, note: tmpNote });
              setTmpNote("");
              setTmpRating(0);
            }}
            className="flex items-center gap-0.5"
          >
            {[1, 2, 3, 4, 5].map((n) => {
              return (
                <div
                  key={n}
                  onClick={() => setTmpRating(n)}
                  className={`cursor-pointer ${
                    n <= tmpRating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </div>
              );
            })}
            <input
              className="border rounded p-1 flex-1 ml-2"
              placeholder="Notes..."
              value={tmpNote}
              onChange={(e) => setTmpNote(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-3 py-1 rounded">
              Save
            </button>
          </form>
          {ratings[id] && (
            <div className="text-xs text-gray-600">
              Saved:{" "}
              {ratings[id].rating ? `${ratings[id].rating} ★` : "No rating"} —{" "}
              {ratings[id].note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
