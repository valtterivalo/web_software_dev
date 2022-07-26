import * as listItemService from "../services/listItemService.js";
import { redirectTo } from "../utils/requestUtils.js";

const addItem = async (request) => {
    const url = new URL(request.url)
    const list_id = url.pathname.split("/")[2];
    const formData = await request.formData();
    const item = formData.get("item");

    await listItemService.createListItem(list_id, item);
    return redirectTo(`/lists/${list_id}`);
};

const markCollected = async (request) => {
    const url = new URL(request.url)
    const list_id = url.pathname.split("/")[2];
    const item_id = url.pathname.split("/")[4];
    await listItemService.setCollected(list_id, item_id)
    return redirectTo(`/lists/${list_id}`);
};

export { addItem, markCollected, }