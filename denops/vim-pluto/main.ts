import { Denops } from "https://deno.land/x/denops_std@v2.4.0/mod.ts";
import { ensureNumber, ensureString } from "https://deno.land/x/unknownutil@v1.1.4/mod.ts";

export async function main(denops: Denops): Promise<void> {

    async function insertCell(insertLine: number): Promise<void> {
        const cursorLine: unknown = await denops.call("winline");
        ensureNumber(cursorLine);

        const lastLine: unknown = await denops.call("line", "$");
        ensureNumber(lastLine);

        const currentCellHeaderLine: unknown = await denops.call("search", "# ╔═╡", 'bn');
        ensureNumber(currentCellHeaderLine);

        const currentCellHeader: unknown = await denops.call("getline", currentCellHeaderLine);
        ensureString(currentCellHeader);

        const currentCellID: string = currentCellHeader.substring(6);

        const currentCellOrderLine: unknown = await denops.call("search", "# " + ".." + currentCellID);
        ensureNumber(currentCellOrderLine);

        if (currentCellOrderLine == 0) {
            await denops.call("append", lastLine, "# ╔═╡ Cell order:");
            var insertCellOrderLine: number = lastLine + 1;
        } else {
            const offset: number = (insertLine >= cursorLine) ? 0 : -1;
            var insertCellOrderLine: number = currentCellOrderLine + offset;
        }

        const newCellID: string = crypto.randomUUID();

        await denops.call("append", insertCellOrderLine, "# ╠═" + newCellID);

        await denops.call("append", insertLine, ["# ╔═╡ " + newCellID, "", ""])
        await denops.call("cursor", insertLine + 2, 1);
        await denops.cmd("startinsert");
    }

    denops.dispatcher = {
        async insertCellAbove(): Promise<void> {
            const cursorLine: unknown = await denops.call("winline");
            ensureNumber(cursorLine);

            const currentCellHeader: unknown = await denops.call("search", "# ╔═╡", 'bn');
            ensureNumber(currentCellHeader);

            if (currentCellHeader == 0 || currentCellHeader > cursorLine) {
                await insertCell(cursorLine - 1);
            } else {
                await insertCell(currentCellHeader - 1);
            }
        },
        async insertCellBelow(): Promise<void> {
            const cursorLine: unknown = await denops.call("winline");
            ensureNumber(cursorLine);

            const nextCellHeader: unknown = await denops.call("search", "# ╔═╡", 'n');
            ensureNumber(nextCellHeader);

            if (nextCellHeader == 0 || nextCellHeader < cursorLine) { 
                await insertCell(cursorLine);
            } else {
                await insertCell(nextCellHeader - 1);
            }
        },
    };
};
