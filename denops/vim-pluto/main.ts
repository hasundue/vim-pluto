import { Denops } from "https://deno.land/x/denops_std@v2.4.0/mod.ts";
import { Maze } from "https://deno.land/x/maze_generator/mod.js";

export async function main(denops: Denops): Promise<void> {

    async function maze(): Promise<void> {
        const maze = new Maze({}).generate();
        const content = maze.getString();
        await denops.cmd("enew");
        await denops.call("setline", 1, content.split(/\n/));
    }

    denops.dispatcher = {
        async init(): Promise<void> {
            await maze();
        },
    };

    await denops.cmd(
        `command! Pluto call denops#request('${denops.name}', 'init', [])`
    );

    await denops.cmd(
        `autocmd FileType julia call denops#request('${denops.name}', 'init', [])`
    );
};

function isNotebookHeader(line: string): boolean {
    return line == "### A Pluto.jl notebook ###"
}
