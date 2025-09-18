"use client";
import { Header, Container, Footer } from "@/components";
import { useAppState } from "@/state/AppStateProvider";
import { aggregateShoppingFromRecipes } from "@/lib/recipeUtils";
import { FormEvent, useMemo, useState } from "react";

type Group = { name: string; items: ReturnType<typeof useAppState>["shopping"] };

export default function GroceriesPage() {
  const { shopping, addShoppingItem, updateShoppingItem, removeShoppingItem, mealPlan, recipes } = useAppState();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [cost, setCost] = useState(0);
  const [category, setCategory] = useState("produce");


  const handleGenerate = ()=> {
    const items = aggregateShoppingFromRecipes(
      Object.values(mealPlan).flatMap((day) =>
        (Object.values(day) as any[])
          .filter(Boolean)
          .map((pm: any) => ({ recipe: recipes.find((r) => r.id === pm.recipeId)!, servings: pm.servings }))
      )
    );
    for (const it of items) {
      addShoppingItem({ name: it.name, quantity: `${it.quantity} ${it.unit}`, category: it.category, have: false, cost: it.cost });
    }
  }

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addShoppingItem({ name, quantity: quantity || "1", category, have: false, cost });
    setName("");
    setQuantity("");
  }

  const groups = useMemo<Record<string, Group>>(() => {
    const map: Record<string, Group> = {};
    for (const item of shopping) {
      const key = item.category || "other";
      if (!map[key]) map[key] = { name: key, items: [] };
      map[key].items.push(item);
    }
    return map;
  }, [shopping]);

  const estimated = shopping
    .filter((i) => !i.have)
    .reduce((sum, i) => sum + (i.cost || 0), 0);

  return (
    <>
      <Header />
      <Container as="main" className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Shopping List</h1>

        <form
          className="flex gap-2 flex-wrap"
          onSubmit={handleSubmit}
        >
          <input className="border rounded p-2" placeholder="Item" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="border rounded p-2 w-24" placeholder="Qty" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <input className="border rounded p-2 w-24" placeholder="Cost" type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} />

          <select className="border rounded p-2" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="produce">Produce</option>
            <option value="dairy">Dairy</option>
            <option value="bakery">Bakery</option>
            <option value="pantry">Pantry</option>
            <option value="meat">Meat</option>
            <option value="seafood">Seafood</option>
            <option value="frozen">Frozen</option>
            <option value="other">Other</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer" type="submit">Add</button>
        </form>

        <div className="flex items-center justify-between">
          <button
            className="text-sm underline cursor-pointer"
            onClick={handleGenerate}
          >
            Auto-generate from plan
          </button>
          <div className="text-right font-semibold">Estimated total: ${estimated.toFixed(2)}</div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {Object.values(groups).map((group) => (
            <div key={group.name} className="border border-gray-300 bg-gray-100 p-3">
              <h2 className="font-semibold mb-2 capitalize">{group.name}</h2>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={item.have}
                      onChange={(e) => updateShoppingItem(item.id, { have: e.target.checked })}
                    />
                    <span className={item.have ? "line-through text-gray-500" : ""}>
                      {item.name} {item.quantity ? `(${item.quantity})` : ""}
                    </span>
                    <span className="ml-auto mr-2">${item.cost}</span>        
                    <button 
                      className="cursor-pointer border border-gray-300 px-0.5 text-red-600 text-sm rounded-sm"
                      onClick={() => removeShoppingItem(item.id)}
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      <Footer />
    </>
  );
}


