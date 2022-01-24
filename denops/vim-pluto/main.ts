import { Denops } from "https://deno.land/x/denops_std@v2.4.0/mod.ts";
import { ensureNumber, ensureArray, isNumber } from "https://deno.land/x/unknownutil@v1.1.4/mod.ts";

export async function main(denops: Denops): Promise<void> {

    async function currentCellRange(): Promise<number[]> {
        const cursorPosition: unknown = await denops.call("getcurpos");
        ensureArray(cursorPosition, isNumber);

        const currentLine: number = cursorPosition[1];

        const lastLine: unknown = await denops.call("line", "$");
        ensureNumber(lastLine);

        const currentCellStart: unknown = await denops.call("search", "# ╔═╡", 'bn');
        ensureNumber(currentCellStart);

        const nextCellStart: unknown = await denops.call("search", "# ╔═╡", 'n');
        ensureNumber(nextCellStart);

        if (nextCellStart > currentLine) {
            return [currentCellStart, nextCellStart - 2];
        } else {
            return [currentCellStart, lastLine];
        }
    }

    async function insertCell(lineNumber: number): Promise<void> {
        const uuid: string = crypto.randomUUID();

        await denops.call("append", lineNumber, ["", "# ╔═╡ " + uuid, ""])
        await denops.call("cursor", lineNumber + 3, 1);
        await denops.cmd("startinsert");
    }

    denops.dispatcher = {
        async insertCellAbove(): Promise<void> {
            const range: number[] = await currentCellRange();
            await insertCell(range[0]-2);
        },
        async insertCellBelow(): Promise<void> {
            const range: number[] = await currentCellRange();
            await insertCell(range[1]);
        },
    };
};
