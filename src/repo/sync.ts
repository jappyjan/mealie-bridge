import {addItem as mealieAddItem, removeItem as mealieRemoveItem, fetchAllItemsFromList as mealieFetchAllItemsFromList} from "./mealie";
import {addItem as bringAddItem, fetchAllItemsFromList as bringFetchAllItemsFromList} from "./bring";
import {getFromEnv} from "./env";

interface UnifiedItem {
    _unifiedName: string;
}

function getItemsMissingInOtherList<TFirstListItem extends UnifiedItem>(firstList: TFirstListItem[], secondList: UnifiedItem[]): TFirstListItem[] {
    return firstList.filter((firstItem) => {
        return !secondList.some((secondItem) => {
            return secondItem._unifiedName === firstItem._unifiedName;
        });
    });
}

function addUnifiedNameToBringItem(item: { name: string, specification: string }) {
    let _unifiedName = item.name;
    if (item.specification) {
        _unifiedName = `${item.name} (${item.specification})`;
    }

    return {
        ...item,
        _unifiedName
    }
}

export async function syncShoppingLists() {
    console.log("Syncing shopping lists...");

    const mealieDefaultListId = getFromEnv("MEALIE_DEFAULT_SHOPPING_LIST_ID");
    const bringDefaultListId = getFromEnv("BRING_DEFAULT_SHOPPING_LIST_ID");

    const mealieItems = await mealieFetchAllItemsFromList(mealieDefaultListId);
    const {
        purchase: bringItems,
        recently: bringItemsRecentlyBought
    } = await bringFetchAllItemsFromList(bringDefaultListId);

    const mealieItemsWithUnifiedName = mealieItems.map((item) => {
        return {
            ...item,
            _unifiedName: item.display,
        };
    });

    const bringItemsWithUnifiedName = bringItems.map(addUnifiedNameToBringItem);

    const bringItemsRecentlyBoughtWithUnifiedName = bringItemsRecentlyBought.map(addUnifiedNameToBringItem);

    const mealieItemsMissingInBring = getItemsMissingInOtherList(mealieItemsWithUnifiedName, bringItemsWithUnifiedName);

    const itemsToDeleteFromMealie = mealieItemsMissingInBring.filter((item) => {
        const wasRemovedRecently = bringItemsRecentlyBoughtWithUnifiedName.some((recentlyBoughtItem) => {
            return recentlyBoughtItem._unifiedName === item._unifiedName;
        });

        return wasRemovedRecently;
    });

    const bringItemsMissingInMealie = getItemsMissingInOtherList(bringItemsWithUnifiedName, mealieItemsWithUnifiedName);

    const itemsToAddToMealie = bringItemsMissingInMealie;

    const itemsToAddToBring = mealieItemsMissingInBring.filter((item) => {
        const isToBeDeletedInMealie = itemsToDeleteFromMealie.some((itemToDelete) => {
            return itemToDelete._unifiedName === item._unifiedName;
        });

        return !isToBeDeletedInMealie;
    });

    for(const item of itemsToAddToBring) {
        let name = item._unifiedName;
        let specification = "";

        if (name.includes("(") && name.endsWith(")")) {
            const nameParts = name.split("(");
            name = nameParts[0].trim();
            specification = nameParts[1].replace(")", "").trim();
        }

        await bringAddItem(bringDefaultListId, name, specification);
    }

    for (const item of itemsToDeleteFromMealie) {
        await mealieRemoveItem(item.id);
    }

    for (const item of itemsToAddToMealie) {
        await mealieAddItem(mealieDefaultListId, item._unifiedName);
    }

    console.log("Synced shopping lists.");

    return {
        bring: {
            added: itemsToAddToBring.map((item) => item._unifiedName),
            removed: [],
        },
        mealie: {
            added: itemsToAddToMealie.map((item) => item._unifiedName),
            removed: itemsToDeleteFromMealie.map((item) => item._unifiedName),
        },
    };
}
