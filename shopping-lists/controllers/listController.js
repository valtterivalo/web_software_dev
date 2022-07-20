import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as listService from "../services/listService.js";
import * as listItemService from "../services/listItemService.js";
import { redirectTo } from "../utils/requestUtils.js";

const responseDetails = {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
};


const addList = async (request) => {
    const formData = await request.formData();
    const name = formData.get("name");

    await listService.create(name);

    return redirectTo("/lists");
};

const viewLists = async (request) => {
    const data = {
        lists: await listService.findAllActiveLists(),
    };

    return new Response(await renderFile("lists.eta", data), responseDetails);
};

const viewList = async (request) => {
    const url = new URL(request.url);
    const urlParts = url.pathname.split("/");
    const data = {
        list: await listService.findById(urlParts[2]),
        items: await listItemService.findCurrentItems(urlParts[2]),
    };
    if (data.items) {
    data.items.sort((a, b) => a.name.localeCompare(b.name));
    data.items.sort((a, b) => Number(a.collected) - Number(b.collected))
    }
    console.log('data in current list', data.items)
    return new Response(await renderFile("list.eta", data), responseDetails);
};

const setInactive = async (request) => {
    const url = new URL(request.url);
    const urlParts = url.pathname.split('/');
    await listService.deactivateList(urlParts[2])
    return redirectTo('/lists')
}

export { addList, viewLists, viewList, setInactive, }