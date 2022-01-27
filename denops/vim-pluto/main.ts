import { Denops } from "https://deno.land/x/denops_std@v2.4.0/mod.ts";

import { 
    insertCell,
    setCodeVisibility, 
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
        }
    };
};
