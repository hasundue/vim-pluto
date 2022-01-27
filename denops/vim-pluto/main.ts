import { Denops } from "https://deno.land/x/denops_std@v2.4.0/mod.ts";
import { insertCell } from "./funcs.ts";

export async function main(denops: Denops): Promise<void> {
    denops.dispatcher = {
        async insertCellAbove(): Promise<void> {
            return insertCell(denops, -1);
        },
        async insertCellBelow(): Promise<void> {
            return insertCell(denops, +1);
        },
    };
};
