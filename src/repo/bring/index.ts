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

    return await bring.loadLists();
}

export async function fetchAllItemsFromList(listId: string) {
    const bring = await getBringApi();

    return await bring.getItems(listId);
}

export async function addItem(listId: string, name: string, specification?: string) {
    const bring = await getBringApi();

    return await bring.saveItem(
        listId,
        name,
        specification ?? "",
    );
}
