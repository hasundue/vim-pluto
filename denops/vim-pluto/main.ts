import { Denops } from "https://deno.land/x/denops_std@v3.0.0/mod.ts";

import { 
    insertCell,
    setCodeVisibility, 
    yankCell,
    pasteCell,
} from "./funcs.ts";

export function main(denops: Denops): void {
    denops.dispatcher = {
        async insertCellAbove(): Promise<void> {
            await insertCell(denops, -1);
        },
        async insertCellBelow(): Promise<void> {
            await insertCell(denops, +1);
        },

        async showCode(): Promise<void> {
            await setCodeVisibility(denops, +1);
        },
        async hideCode(): Promise<void> {
            await setCodeVisibility(denops, -1);
        },
        async toggleCode(): Promise<void> {
            await setCodeVisibility(denops, 0);
        },

        async deleteCell(): Promise<void> {
            await yankCell(denops, true);
        },
        async yankCell(): Promise<void> {
            await yankCell(denops, false);
        },
        async pasteCellAbove(): Promise<void> {
            await pasteCell(denops, -1);
        },
        async pasteCellBelow(): Promise<void> {
            await pasteCell(denops, +1);
        },
    };
}
