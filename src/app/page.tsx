"use client";
import { useMemo, useEffect } from "react";

import { Header, Footer, Container, Modal } from "@/components";
import { FeaturedCard, Card, Detail, Filter } from "@/components/HomePage";
import { useAppState } from "@/state/AppStateProvider";

export default function Home() {
  const { recipes, q, diet, difficulty, selected, setSelected, activeTimers, removeTimer } = useAppState();

  // Global timer checker - runs independently of modal
  useEffect(() => {
    const checkTimers = () => {
      const now = Date.now();
      activeTimers.forEach(timer => {
        if (now >= timer.endTime) {
          // Timer finished - show notification and remove from state
          if (typeof window !== "undefined") {
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification(`Timer Finished!`, {
                body: `Recipe timer completed`,
                icon: "/favicon.ico"
              });
            } else {
              alert(`⏰ Timer finished!`);
            }
          }
          removeTimer(timer.recipeId, timer.stepIndex);
        }
      });
    };

    const interval = setInterval(checkTimers, 1000);
    return () => clearInterval(interval);
  }, [activeTimers, removeTimer]);

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const matchQ = q
        ? r.title.toLowerCase().includes(q.toLowerCase()) ||
          r.description.toLowerCase().includes(q.toLowerCase())
        : true;
      const matchDiet = diet ? r.dietaryTags?.includes(diet) : true;
      const matchDiff = difficulty ? r.difficulty === difficulty : true;
      return matchQ && matchDiet && matchDiff;
    });
  }, [recipes, q, diet, difficulty]);

  return (
    <>
      <Header />
      <Container
        as="main"
        className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start"
      >
        <Filter />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {filtered.map((el, i) => {
            if (i === 0)
              return (
                <FeaturedCard
                  recipe={el}
                  key={el.id}
                  onClick={() => {
                    setSelected(el);
                  }}
                />
              );
            return (
              <Card
                recipe={el}
                key={el.id}
                onClick={() => {
                  setSelected(el);
                }}
              />
            );
          })}
        </div>
      </Container>
      {selected?.id && (
        <Modal onClose={() => setSelected(null)} key={selected.id}>
          <Detail recipe={selected} />
        </Modal>
      )}
      <Footer />
    </>
  );
}
