import { Denops } from "https://deno.land/x/denops_std@v2.4.0/mod.ts";
import { isNumber, ensureNumber, ensureString, ensureArray } from "https://deno.land/x/unknownutil@v1.1.4/mod.ts";

export async function getCursorLnum(denops: Denops): Promise<number> {
    const list: unknown = await denops.call("getcurpos");
    ensureArray(list, isNumber);
    return list[1];
}

export async function getLastLnum(denops: Denops): Promise<number> {
    const lnum: unknown = await denops.call("line", "$");
    ensureNumber(lnum);
    return lnum;
}

export async function getLine(denops: Denops, lnum: number): Promise<string> {
    const line: unknown = await denops.call("getline", lnum);
    ensureString(line);
    return line;
}

export async function setLine(denops: Denops, lnum: number, text: string): Promise<void> {
    denops.call("setline", lnum, text);
}

export async function appendLines(denops: Denops, lnum: number, lines: string[]): Promise<void> {
    denops.call("append", lnum, lines);
}

export async function appendLine(denops: Denops, lnum: number, line: string): Promise<void> {
    appendLines(denops, lnum, [line]);
}

export async function searchNext(denops: Denops, text: string): Promise<number> {
    const lnum: unknown = await denops.call("search", text, "n");
    ensureNumber(lnum);
    return lnum;
}

export async function searchPrev(denops: Denops, text: string): Promise<number> {
    const lnum: unknown = await denops.call("search", text, "bn");
    ensureNumber(lnum);
    return lnum;
}

export async function moveCursor(denops: Denops, lnum: number, cnum: number): Promise<void> {
    denops.call("cursor", lnum, cnum);
}

export async function startInsert(denops: Denops): Promise<void> {
    denops.cmd("startinsert");
}
