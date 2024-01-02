import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger'
import {fetchAllLists, addItemToList, fetchAllItemsFromList, getBringApi} from "./repo/bring";
import {getFromEnv} from "./repo/env";

const app = new Elysia()
    .use(swagger())
    .onBeforeHandle(({ set, request: { headers } }) => {
        const secret = getFromEnv('API_SECRET');
        const authorizationHeader = headers.get('Authorization');

        const [type, token] = authorizationHeader?.split(' ') ?? [];

        if (type !== 'Bearer' || token !== secret) {
            set.status = 401;
            return 'Unauthorized';
        }
    })
    .onError(({ code, error }) => {
        console.log(`Error ${code}: ${error}`);
        return new Response(error.toString())
    })
    .get("/shopping-lists", () => fetchAllLists())
    .get("/shopping-lists/:listId/items", ({params}) => fetchAllItemsFromList(params.listId))
    .post("/shopping-lists/:listId/items", ({params, body}) => addItemToList(params.listId, body.label), {
        body: t.Object({
            label: t.String(),
        })
    })
    .listen(Number(getFromEnv('PORT')));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
