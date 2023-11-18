import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger'
import {fetchTodayMealRecipeImage} from "./repo/mealie";
import {syncShoppingLists} from "./repo/sync";
import {fetchAllLists as bringFetchAllLists} from "./repo/bring";

const app = new Elysia()
    .use(swagger())
    .onError(({ code, error }) => {
        console.log(`Error ${code}: ${error}`);
        return new Response(error.toString())
    })
    .get("/today-meal/image", () => fetchTodayMealRecipeImage().then((image) => new Response(image, {
        headers: {
            'Content-Type': 'image/webp'
        }
    })))
    .get("/shopping-list/bring", () => bringFetchAllLists())
    .get("/shopping-list/sync", () => syncShoppingLists())
    .listen(8080);

const oneMinute = 60 * 1000;
setInterval(syncShoppingLists, oneMinute);
syncShoppingLists().catch((error) => {
    console.log("Error syncing shopping lists", error);
});

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
