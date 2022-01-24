import { Denops } from "https://deno.land/x/denops_std@v2.4.0/mod.ts";
import { ensureArray, isNumber } from "https://deno.land/x/unknownutil@v1.1.4/mod.ts";

export async function main(denops: Denops): Promise<void> {

    async function insertCell(offset: number) {
        const curpos: unknown = await denops.call("getcurpos");
        ensureArray(curpos, isNumber);

        const lnum: number = curpos[1];

        const uuid: string = crypto.randomUUID();

        await denops.call("append", lnum + offset, ["", "# ╔═╡ " + uuid, ""])
        await denops.call("cursor", lnum + offset + 3, 1);
        await denops.cmd("startinsert");
    }

    denops.dispatcher = {
        async insertCellAbove(): Promise<void> {
            insertCell(-2);
        },
        async insertCellBelow(): Promise<void> {
            insertCell(0);
        },
    };
};
