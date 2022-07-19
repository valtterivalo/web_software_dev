import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as listService from "../services/listService.js";
import * as listItemService from "../services/listItemService.js";

const responseDetails = {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
    return new Response(`Redirecting to ${path}.`, {
        status: 303,
        headers: {
            "Location": path,
        },
    });
};

const addItem = async (request) => {
    const url = new URL(request.url)
    console.log(url.pathname)
    const list_id = url.pathname.split("/")[2];
    console.log(list_id)
    const formData = await request.formData();
    console.log(formData)
    const item = formData.get("item");
    console.log(item)

    await listItemService.createListItem(list_id, item);
    return redirectTo(`/lists/${list_id}`);
};

const markCollected = async (request) => {
    const url = new URL(request.url)
    const list_id = url.pathname.split("/")[2];
    const item_id = url.pathname.split("/")[4];
    console.log(list_id)
    console.log(item_id)
    const data = {
        list: await listService.findById(list_id),
        items: await listItemService.setCollected(list_id, item_id),
    }
    console.log('Trying to rerender the items in this list')
    await renderFile("list.eta", data)
    console.log('Rerendered the items in this list successfully')
    return redirectTo(`/lists/${list_id}`);
};

const viewItems = async (request) => {
    const data = {
        items: await listItemService.findCurrentItems(),
    };
    console.log(`All active lists ${data.items}`)

    return new Response(await renderFile("lists.eta", data), responseDetails);
};

export { addItem, viewItems, markCollected, }