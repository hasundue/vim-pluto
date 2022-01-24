import { Denops } from "https://deno.land/x/denops_std@v2.4.0/mod.ts";
import { ensureNumber, ensureArray, isNumber } from "https://deno.land/x/unknownutil@v1.1.4/mod.ts";

export async function main(denops: Denops): Promise<void> {

    async function insertCell(lineNumber: number): Promise<void> {
        const uuid: string = crypto.randomUUID();

        await denops.call("append", lineNumber, ["# ╔═╡ " + uuid, "", ""])
        await denops.call("cursor", lineNumber + 2, 1);
        await denops.cmd("startinsert");
    }

    denops.dispatcher = {
        async insertCellAbove(): Promise<void> {
            const cursorPosition: unknown = await denops.call("getcurpos");
            ensureArray(cursorPosition, isNumber);

            const currentLine: number = cursorPosition[1];

            const currentCellHeader: unknown = await denops.call("search", "# ╔═╡", 'bn');
            ensureNumber(currentCellHeader);

            if (currentCellHeader == 0 || currentCellHeader > currentLine) {
                await insertCell(currentLine - 1);
            } else {
                await insertCell(currentCellHeader - 1);
            }
        },
        async insertCellBelow(): Promise<void> {
            const cursorPosition: unknown = await denops.call("getcurpos");
            ensureArray(cursorPosition, isNumber);

            const currentLine: number = cursorPosition[1];

            const nextCellHeader: unknown = await denops.call("search", "# ╔═╡", 'n');
            ensureNumber(nextCellHeader);

            if (nextCellHeader == 0 || nextCellHeader < currentLine) { 
                await insertCell(currentLine);
            } else {
                await insertCell(nextCellHeader - 1);
            }
        },
    };
};
