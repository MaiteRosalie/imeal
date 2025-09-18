import { useAppState } from "@/state/AppStateProvider";

export const Filter = () => {
  const { setQ, difficulty, setDifficulty, setDiet, diet, recipes, q } = useAppState();

  return (
    <div className="w-full grid md:grid-cols-4 gap-2 items-end">
      <div className="md:col-span-2">
        <label className="text-sm block">Search</label>
        <input
          className="border rounded p-2 w-full"
          placeholder="Search recipes..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm block">Dietary</label>
        <select className="border rounded p-2 w-full" value={diet} onChange={(e) => setDiet(e.target.value)}>
          <option value="">All</option>
          {[...new Set(recipes.flatMap((r) => r.dietaryTags || []))].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm block">Difficulty</label>
        <select className="border rounded p-2 w-full" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">All</option>
          {Array.from(new Set(recipes.map((r) => r.difficulty))).map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
