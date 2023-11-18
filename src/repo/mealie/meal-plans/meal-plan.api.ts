import {MealPlan, Recipe} from "./meal-plan.api.types";
import {fetchApi} from "../index";

export async function fetchTodayMealPlan(): Promise<MealPlan> {
    return fetchApi( '/groups/mealplans/today');
}

export async function fetchTodayMealRecipe(): Promise<Recipe> {
    const mealPlan = await fetchTodayMealPlan();
    return mealPlan[0].recipe;
}

export async function fetchTodayMealRecipeImage(): Promise<Blob> {
    console.log('Fetching today\'s meal recipe image');
    const recipe = await fetchTodayMealRecipe();

    const imageUrl = `https://mealie.apps.janjaap.de/api/media/recipes/${recipe.id}/images/min-original.webp`;

    const response = await fetch(imageUrl);

    if (!response.ok) {
        console.error(await response.text());
        throw new Error(`API request failed with status ${response.status}`);
    }

    return response.blob();
}
