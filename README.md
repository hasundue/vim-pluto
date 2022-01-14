# vim-pluto
A Vim8/NeoVim plugin which turns your vim into a front-end of [Pluto.jl](https://github.com/fonsp/Pluto.jl).

Still in the very beginning stage of development, which means you can't use this plugin yet.

## Conceptions
### Techs
- Powered by [Deno](https://deno.land/) and [denops.vim](https://github.com/vim-denops/denops.vim)

### Interfaces
- :Pluto command launches an instance of Pluto server, connects your vim with it, and opens a "Pluto home buffer" which displays informatiion such as server status and recently opened notebooks.
- When you open a Pluto notebook file while pluto-vim is running, vim-pluto opens a "notebook buffer" and makes you edit it instead of the notebook file itself.
- "Notebook buffers" are compose of cells and output, just as in the browser version of Pluto. Outputs change reactively when cells are modified.
