import { Denops } from "https://deno.land/x/denops_std@v3.0.0/mod.ts";
import * as vim from "https://deno.land/x/denops_std@v3.0.0/function/mod.ts";

import { isString, ensureNumber, ensureArray } from "https://deno.land/x/unknownutil@v1.1.4/mod.ts";
import { v4 } from "https://deno.land/std@0.122.0/uuid/mod.ts";

import {
    CELL_HEAD,
    ORDER_TITLE,
    ORDER_HEAD,
    SHOWN_HEAD,
    HIDDEN_HEAD,
} from "./const.ts";

export async function insertCell(
    denops: Denops, 
    direction = +1,
    startInsert = true,
    cellId = crypto.randomUUID(),
    cellLines: string[] = [],
): Promise<void> {
    const cursorPos = await vim.getcurpos(denops);
    const cursorLnum = cursorPos[1];
    const lastLnum = await vim.line(denops, "$");

    const orderTitleLnum = await vim.search(denops, ORDER_TITLE, "n");
    ensureNumber(orderTitleLnum);

    let newOrderLnum: number;
    let newLnum: number;
    let newCellId: string;

    const headerLnum = direction < 0
        ? await vim.search(denops, CELL_HEAD, "cnb")
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
            const offset = direction < 0 ? -1 : 0;
            newOrderLnum = orderLnum + offset;
            newLnum = headerLnum - 1;
        }
    }

    const newCellHeaderLnum = await vim.search(denops, cellId, "cn");
    if (newCellHeaderLnum == 0) {
        newCellId = cellId;
    }
    else {
        newCellId = crypto.randomUUID();
    }

    await vim.append(denops, newOrderLnum, SHOWN_HEAD + newCellId);

    let newCellLines = [CELL_HEAD + newCellId].concat(cellLines);
    if (startInsert) {
        newCellLines = newCellLines.concat(["", ""]);
    }
    await vim.append(denops, newLnum, newCellLines);

    if (startInsert) {
        await vim.cursor(denops, newLnum + cellLines.length + 2, 1);
        await denops.cmd("startinsert");
    }
}

export async function setCodeVisibility(denops: Denops, mode: number): Promise<void> {
    const headerLnum = await vim.search(denops, CELL_HEAD, "cnb");
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

    let newHead: string;

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

export async function yankCell(denops: Denops, del: boolean): Promise<void> {
    const headerLnum = await vim.search(denops, CELL_HEAD, "cnb");
    ensureNumber(headerLnum);

    const maybeCellHeader = await vim.getline(denops, headerLnum);
    const maybeId = maybeCellHeader.substring(CELL_HEAD.length);

    if ( !v4.validate(maybeId) ) {
        return;
    }

    const nextHeaderLnum = await vim.search(denops, CELL_HEAD, "n");
    ensureNumber(nextHeaderLnum);

    const cellLines = await vim.getline(denops, headerLnum, nextHeaderLnum-1);

    const bufName = await vim.bufname(denops);

    if (del) {
        await vim.deletebufline(denops, bufName, headerLnum, nextHeaderLnum-1);
    }

    await vim.setreg(denops, "vim-pluto", cellLines);

    const orderLnum = await vim.search(denops, ORDER_HEAD + maybeId, "n");
    ensureNumber(orderLnum);

    if (del) {
        await vim.deletebufline(denops, bufName, orderLnum);
    }
}

export async function pasteCell(denops: Denops, direction = +1): Promise<void> {
    const regLines = await vim.getreg(denops, "vim-pluto", 1, true);
    ensureArray(regLines, isString);

    const maybeId = regLines[0].substring(CELL_HEAD.length);

    if ( !v4.validate(maybeId) ) { // should not happen
        return;
    }

    const cellLines = regLines.slice(1);

    insertCell(denops, direction, false, maybeId, cellLines);
}
