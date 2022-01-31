import { Denops } from "https://deno.land/x/denops_std@v3.0.0/mod.ts";

import * as vim from "https://deno.land/x/denops_std@v3.0.0/function/mod.ts";

import { ensureNumber } from "https://deno.land/x/unknownutil@v1.1.4/mod.ts";
import { v4 } from "https://deno.land/std@0.122.0/uuid/mod.ts";

import {
    CELL_HEAD,
    ORDER_TITLE,
    ORDER_HEAD,
    SHOWN_HEAD,
    HIDDEN_HEAD,
} from "./const.ts";

export async function insertCell(denops: Denops, direction: number): Promise<void> {
    const cursorPos = await vim.getcurpos(denops);
    const cursorLnum = cursorPos[1];
    const lastLnum = await vim.line(denops, "$");

    const orderTitleLnum = await vim.search(denops, ORDER_TITLE, "n");
    ensureNumber(orderTitleLnum);

    const newCellID = crypto.randomUUID();

    var newOrderLnum: number;
    var newLnum: number;

    const headerLnum = direction < 0
        ? await vim.search(denops, CELL_HEAD, "nb")
        : await vim.search(denops, CELL_HEAD, "n");
    ensureNumber(headerLnum);

    if ( headerLnum == 0 ) { // No cell found in the file
        await vim.append(denops, lastLnum, ORDER_TITLE);
        newOrderLnum = lastLnum + 1;
        newLnum = direction < 0 ? cursorLnum - 1 : cursorLnum ;
    }
    else if ( direction * (headerLnum - cursorLnum) < 0 ) { // Top or bottom of the notebook
        newOrderLnum = direction < 0 ? orderTitleLnum : lastLnum;
        newLnum = direction < 0 ? cursorLnum - 1 : orderTitleLnum - 1;
    }
    else {
        const header: string = await vim.getline(denops, headerLnum);
        const maybeId: string = header.substring(CELL_HEAD.length);

        if ( !v4.validate(maybeId) ) { // Metadata of the notebook
            newOrderLnum = lastLnum;
            newLnum = orderTitleLnum - 1;
        }
        else {
            const orderLnum = await vim.search(denops, ORDER_HEAD + maybeId, "n");
            ensureNumber(orderLnum);
            const offset = direction < 0 ? 0 : -1;
            newOrderLnum = orderLnum + offset;
            newLnum = headerLnum - 1;
        }
    }

    await vim.append(denops, newOrderLnum, SHOWN_HEAD + newCellID);
    await vim.append(denops, newLnum, [ CELL_HEAD + newCellID, "", "" ])
    await vim.cursor(denops, newLnum + 2, 1);
    await denops.cmd("startinsert");
}

export async function setCodeVisibility(denops: Denops, mode: number): Promise<void> {
    const headerLnum = await vim.search(denops, CELL_HEAD, "nb");
    ensureNumber(headerLnum);

    const maybeCellHeader = await vim.getline(denops, headerLnum);
    const maybeId = maybeCellHeader.substring(CELL_HEAD.length);

    if ( !v4.validate(maybeId) ) {
        return;
    }

    const orderLnum = await vim.search(denops, ORDER_HEAD + maybeId, "n");
    ensureNumber(orderLnum);

    const orderLine = await vim.getline(denops, orderLnum);
    const head = orderLine.substring(0, ORDER_HEAD.length);

    var newHead: string;

    if ( mode > 0 ) { // Show the cell
        newHead = SHOWN_HEAD;
    }
    else if ( mode < 0 ) { // Hide the cell
        newHead = HIDDEN_HEAD;
    }
    else { // Toggle (mode = 0)
        newHead = head == SHOWN_HEAD ? HIDDEN_HEAD : SHOWN_HEAD;
    }

    const newOrderLine = newHead + orderLine.substring(ORDER_HEAD.length);
    await vim.setline(denops, orderLnum, newOrderLine);
}
