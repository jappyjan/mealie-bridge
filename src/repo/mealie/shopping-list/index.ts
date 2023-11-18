import {fetchApi} from "../index";
import {ShoppingList} from "./shopping-list.types";

export async function fetchAllItemsFromList(listId: string) {
    const path = `/groups/shopping/lists/${listId}`;
    const list = await fetchApi<ShoppingList>(path);

    return list.listItems;
}


export async function addItem(listId: string, name: string) {
    const path = '/groups/shopping/items';

    const body = JSON.stringify({
        "note": name,
        "shoppingListId": listId,
    });

    await fetchApi(path, {
        method: 'POST',
        body,
    });
}

export async function removeItem(itemId: string) {
    const path = `/groups/shopping/items/${itemId}`;

    await fetchApi(path, {
        method: 'DELETE',
    });
}
