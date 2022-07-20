import { serve } from "https://deno.land/std@0.120.0/http/server.ts";
import {configure, renderFile, render } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as listController from "./controllers/listController.js";
import * as listItemController from "./controllers/listItemController.js"
import * as listService from "./services/listService.js"
import * as listItemService from "./services/listItemService.js"
import * as requestUtils from "./utils/requestUtils.js"

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const handleRequest = async (request) => {
  const url = new URL(request.url);
  console.log(`Currently handling request to url ${url.pathname} with request method ${request.method}`)

  if (url.pathname === "/" && request.method === "GET") {
    const data = {
      title: "Shared shopping lists",
      lists_total: (await listService.findAllLists()).length,
      items_total: (await listItemService.findAllItems()).length,
    }
    return new Response(await renderFile("main.eta", data), responseDetails);
  } else if (url.pathname === '/lists' && request.method === 'POST') {
    return await listController.addList(request);
  } else if (url.pathname === '/lists' && request.method === 'GET') {
    return await listController.viewLists(request);
  } else if (url.pathname.match("lists/[0-9]+/deactivate") && request.method === "POST") {
    return await listController.setInactive(request);
  } else if (url.pathname.match("lists/[0-9]+") && request.method === "GET") {
    return await listController.viewList(request);
  } else if (url.pathname.match("lists/[0-9]+/items/[0-9]+/collect") && request.method === "POST") {
    return await listItemController.markCollected(request);
  } else if (url.pathname.match("lists/[0-9]+/items") && request.method === "POST") {
    return await listItemController.addItem(request);
  } else {
    return new Response('Not found', { status: 404 })
  }
}

let port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}

serve(handleRequest, { port: port });
