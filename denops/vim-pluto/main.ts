import { Denops } from "https://deno.land/x/denops_std@v3.0.0/mod.ts";

import { 
    insertCell,
    setCodeVisibility, 
    yankCell,
    pasteCell,
} from "./funcs.ts";

export async function main(denops: Denops): Promise<void> {
    denops.dispatcher = {
        async insertCellAbove(): Promise<void> {
            insertCell(denops, -1);
        },
        async insertCellBelow(): Promise<void> {
            insertCell(denops, +1);
        },

        async showCode(): Promise<void> {
            setCodeVisibility(denops, +1);
        },
        async hideCode(): Promise<void> {
            setCodeVisibility(denops, -1);
        },
        async toggleCode(): Promise<void> {
            setCodeVisibility(denops, 0);
        },

        async deleteCell(): Promise<void> {
            yankCell(denops, true);
        },
        async yankCell(): Promise<void> {
            yankCell(denops, false);
        },
        async pasteCellAbove(): Promise<void> {
            pasteCell(denops, -1);
        },
        async pasteCellBelow(): Promise<void> {
            pasteCell(denops, +1);
        },
    };
};
