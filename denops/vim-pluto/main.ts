import { Denops } from "https://deno.land/x/denops_std@v2.4.0/mod.ts";

import {
    getCursorLnum,
    getLastLnum,
    getLine,
    searchPrev,
    searchNext,
    appendLines,
    appendLine,
    moveCursor,
    startInsert,
} from "./denops.ts";

const CELL_HEAD = "# ╔═╡ ";
const ORDER_TITLE = "# ╔═╡ Cell order:";
const ORDER_HEAD = "# " + "..";
const VISIBLE_HEAD = "# ╠═";

export async function main(denops: Denops): Promise<void> {

    async function insertCell(direction: number): Promise<void> {
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
        else if ( headerLnum == orderTitleLnum ) { // Top or Bottom of the notebook
            newOrderLnum = lastLnum;
            newLnum = orderTitleLnum - 1;
        }
        else {
            const header: string = await getLine(denops, headerLnum);
            const id: string = header.substring(CELL_HEAD.length);
            const orderLnum: number = await searchNext(denops, ORDER_HEAD + id);
            const offset = direction < 0 ? 0 : -1;
            newOrderLnum = orderLnum + offset;
            newLnum = headerLnum - 1;
        }

        await appendLine(denops, newOrderLnum, VISIBLE_HEAD + newCellID);
        await appendLines(denops, newLnum, [ CELL_HEAD + newCellID, "", "" ])
        await moveCursor(denops, newLnum + 2, 1);
        await startInsert(denops);
    }

    denops.dispatcher = {
        async insertCellAbove(): Promise<void> {
            return insertCell(-1);
        },
        async insertCellBelow(): Promise<void> {
            return insertCell(+1);
        },
    };
};
