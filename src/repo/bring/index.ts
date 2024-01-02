import {getFromEnv} from "../env";
import bringApi from "bring-shopping";

export async function getBringApi() {
    const email = getFromEnv("BRING_EMAIL");
    const password = getFromEnv("BRING_PASSWORD");

    // provide user and email to login
    const bring = new bringApi({
        mail: email,
        password,
    });

    // login to get your uuid and Bearer token
    try {
        await bring.login();
        console.log(`Successfully logged in as ${bring.name}`);
    } catch (e) {
        console.error(`Error on Login: ${(e as Error).message}`);
    }

    return bring;
}

export async function fetchAllLists () {
    const bring = await getBringApi();

    const response = await bring.loadLists();

    return response.lists;
}

export async function fetchAllItemsFromList(listId: string) {
    const bring = await getBringApi();

    const response = await bring.getItems(listId);

    return response.purchase;
}

export async function addItemToList(listId: string, name: string, specification?: string) {
    const bring = await getBringApi();

    return await bring.saveItem(
        listId,
        name,
        specification ?? "",
    );
}
