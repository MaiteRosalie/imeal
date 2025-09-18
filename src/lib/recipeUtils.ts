import { Recipe, Ingredient } from "@/mocks/recipes";

export type ShoppingItem = {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  cost: number;
};

export function aggregateShoppingFromRecipes(
  plannedRecipes: { recipe: Recipe; servings: number }[]
): ShoppingItem[] {
  const aggregated: Record<string, { quantity: number; unit: string; category: string; cost: number }> = {};

  for (const { recipe, servings } of plannedRecipes) {
    for (const ingredient of recipe.ingredients) {
      const key = ingredient.name.toLowerCase();
      
      if (aggregated[key]) {
        // Convert to same unit if possible, otherwise keep original units
        if (aggregated[key].unit === ingredient.unit) {
          aggregated[key].quantity += ingredient.quantity * servings;
          aggregated[key].cost += ingredient.cost * servings;
        } else {
          // For now, just add as separate entries if units don't match
          // In a real app, you'd want unit conversion logic here
          aggregated[`${key}_${ingredient.unit}`] = {
            quantity: ingredient.quantity * servings,
            unit: ingredient.unit,
            category: getIngredientCategory(ingredient.name),
            cost: ingredient.cost * servings
          };
        }
      } else {
        aggregated[key] = {
          quantity: ingredient.quantity * servings,
          unit: ingredient.unit,
          category: getIngredientCategory(ingredient.name),
          cost: ingredient.cost * servings
        };
      }
    }
  }

  return Object.entries(aggregated).map(([name, data]) => ({
    name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    ...data
  }));
}

function getIngredientCategory(ingredientName: string): string {
  const name = ingredientName.toLowerCase();
  
  // Produce
  if (name.includes('tomato') || name.includes('onion') || name.includes('garlic') || 
      name.includes('carrot') || name.includes('cucumber') || name.includes('bell pepper') ||
      name.includes('broccoli') || name.includes('zucchini') || name.includes('avocado') ||
      name.includes('cherry tomato') || name.includes('basil') || name.includes('parsley') ||
      name.includes('lettuce') || name.includes('celery') || name.includes('spinach') ||
      name.includes('mushroom') || name.includes('olive')) {
    return 'produce';
  }
  
  // Dairy
  if (name.includes('milk') || name.includes('cheese') || name.includes('butter') || 
      name.includes('cream') || name.includes('yogurt') || name.includes('mozzarella') ||
      name.includes('parmesan') || name.includes('feta') || name.includes('sour cream')) {
    return 'dairy';
  }
  
  // Meat
  if (name.includes('chicken') || name.includes('beef') || name.includes('pork') ||
      name.includes('pancetta') || name.includes('ground beef') || name.includes('pork shoulder')) {
    return 'meat';
  }
  
  // Seafood
  if (name.includes('shrimp') || name.includes('salmon') || name.includes('fish') ||
      name.includes('anchovy') || name.includes('white fish')) {
    return 'seafood';
  }
  
  // Pantry
  if (name.includes('flour') || name.includes('sugar') || name.includes('salt') ||
      name.includes('pepper') || name.includes('oil') || name.includes('vinegar') ||
      name.includes('soy sauce') || name.includes('balsamic') || name.includes('rice') ||
      name.includes('quinoa') || name.includes('bulgur') || name.includes('lentil') ||
      name.includes('chickpea') || name.includes('bean') || name.includes('pasta') ||
      name.includes('spaghetti') || name.includes('linguine') || name.includes('rice noodle') ||
      name.includes('tortilla') || name.includes('bread') || name.includes('pita') ||
      name.includes('burger bun') || name.includes('pizza dough') || name.includes('pie crust') ||
      name.includes('breadcrumb') || name.includes('taco seasoning') || name.includes('chili powder') ||
      name.includes('cumin') || name.includes('garam masala') || name.includes('paprika') ||
      name.includes('thyme') || name.includes('bay leaf') || name.includes('herb') ||
      name.includes('spice') || name.includes('baking powder') || name.includes('cocoa powder') ||
      name.includes('chocolate') || name.includes('brown sugar') || name.includes('mirin') ||
      name.includes('tamarind') || name.includes('fish sauce') || name.includes('curry paste') ||
      name.includes('coconut milk') || name.includes('vegetable broth') || name.includes('tomato sauce') ||
      name.includes('tomato puree') || name.includes('red wine') || name.includes('white wine') ||
      name.includes('beer') || name.includes('bbq sauce') || name.includes('taco seasoning')) {
    return 'pantry';
  }
  
  // Bakery
  if (name.includes('crouton') || name.includes('pancake')) {
    return 'bakery';
  }
  
  // Frozen
  if (name.includes('frozen')) {
    return 'frozen';
  }
  
  // Default to other
  return 'other';
}
