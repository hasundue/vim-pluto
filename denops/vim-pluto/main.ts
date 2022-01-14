import { Denops } from "https://deno.land/x/denops_std@v1.0.0/mod.ts";
import { Maze } from "https://deno.land/x/maze_generator@v0.4.0/mod.js";

export async function main(denops: Denops): Promise<void> {
    denops.dispatcher = {
        async maze(): Promise<void> {
            const maze = new Maze({}).generate();
            const content = maze.getString();
            await denops.cmd("enew");
            await denops.call("setline", 1, content.split(/\n/));
        },
    };

    await denops.cmd(
        `command! Maze call denops#request('${denops.name}', 'maze', [])`,
    );
};
