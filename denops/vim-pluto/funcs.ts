import { Denops } from "https://deno.land/x/denops_std@v2.4.0/mod.ts";
import { v4 } from "https://deno.land/std@0.122.0/uuid/mod.ts";

import {
    getCursorLnum,
    getLastLnum,
    getLine,
    setLine,
    searchPrev,
    searchNext,
    appendLines,
    appendLine,
    moveCursor,
    startInsert,
} from "./denops.ts";

import {
    CELL_HEAD,
    ORDER_TITLE,
    ORDER_HEAD,
    SHOWN_HEAD,
    HIDDEN_HEAD,
} from "./const.ts";

export async function insertCell(denops: Denops, direction: number): Promise<void> {
    const cursorLnum: number = await getCursorLnum(denops);
    const lastLnum: number = await getLastLnum(denops);
    const orderTitleLnum: number = await searchNext(denops, ORDER_TITLE);

    const newCellID: string = crypto.randomUUID();

    var newOrderLnum: number;
    var newLnum: number;

    const headerLnum: number = direction < 0
        ? await searchPrev(denops, CELL_HEAD)
        : await searchNext(denops, CELL_HEAD);

    if ( headerLnum == 0 ) { // No cell found in the file
        await appendLine(denops, lastLnum, ORDER_TITLE);
        newOrderLnum = lastLnum + 1;
        newLnum = direction < 0 ? cursorLnum - 1 : cursorLnum ;
    }
    else if ( direction * (headerLnum - cursorLnum) < 0 ) { // Top or bottom of the notebook
        newOrderLnum = direction < 0 ? orderTitleLnum : lastLnum;
        newLnum = direction < 0 ? cursorLnum - 1 : orderTitleLnum - 1;
    }
    else {
        const header: string = await getLine(denops, headerLnum);
        const maybeId: string = header.substring(CELL_HEAD.length);

        if ( !v4.validate(maybeId) ) { // Metadata of the notebook
            newOrderLnum = lastLnum;
            newLnum = orderTitleLnum - 1;
        }
        else {
            const orderLnum: number = await searchNext(denops, ORDER_HEAD + maybeId);
            const offset = direction < 0 ? 0 : -1;
            newOrderLnum = orderLnum + offset;
            newLnum = headerLnum - 1;
        }
    }

    await appendLine(denops, newOrderLnum, SHOWN_HEAD + newCellID);
    await appendLines(denops, newLnum, [ CELL_HEAD + newCellID, "", "" ])
    await moveCursor(denops, newLnum + 2, 1);
    await startInsert(denops);
}

export async function setCodeVisibility(denops: Denops, mode: number): Promise<void> {
    const headerLnum: number = await searchPrev(denops, CELL_HEAD);

    const maybeCellHeader: string = await getLine(denops, headerLnum);
    const maybeId: string = maybeCellHeader.substring(CELL_HEAD.length);

    if ( !v4.validate(maybeId) ) {
        return;
    }

    const orderLnum: number = await searchNext(denops, ORDER_HEAD + maybeId);
    const orderLine: string = await getLine(denops, orderLnum);
    const head: string = orderLine.substring(0, ORDER_HEAD.length);

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

    const newOrderLine: string = newHead + orderLine.substring(ORDER_HEAD.length);
    await setLine(denops, orderLnum, newOrderLine);
}
