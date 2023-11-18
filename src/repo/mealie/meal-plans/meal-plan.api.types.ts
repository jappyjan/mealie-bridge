export type MealPlan = MealPlanDay[]

export interface MealPlanDay {
    date: string
    entryType: string
    title: string
    text: string
    recipeId: string
    id: number
    groupId: string
    userId: string
    recipe: Recipe
}

export interface Recipe {
    id: string
    userId: string
    groupId: string
    name: string
    slug: string
    image?: string
    recipeYield?: string
    totalTime?: string
    prepTime?: string
    cookTime: any
    performTime?: string
    description: string
    recipeCategory: any[]
    tags: any[]
    tools: any[]
    rating: any
    orgURL?: string
    dateAdded: string
    dateUpdated: string
    createdAt: string
    updateAt: string
    lastMade: any
}
