export interface ShoppingList {
    name: string
    extras: Extras
    createdAt: string
    updateAt: string
    groupId: string
    id: string
    listItems: ListItem[]
    recipeReferences: any[]
    labelSettings: any[]
}

export type Extras = unknown;

export interface ListItem {
    quantity: number
    unit: any
    food: any
    note: string
    isFood: boolean
    disableAmount: boolean
    display: string
    shoppingListId: string
    checked: boolean
    position: number
    foodId: any
    labelId: any
    unitId: any
    extras: Extras
    id: string
    label: any
    recipeReferences: any[]
    createdAt: string
    updateAt: string
}
