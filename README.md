# vim-pluto
A Vim8/NeoVim plugin which turns your vim into a front-end of [Pluto.jl](https://github.com/fonsp/Pluto.jl).

Still in the very beginning stage of development, which means you can't use this plugin yet.

## Conceptions
### Techs
- Powered by [Deno](https://deno.land/) and [denops.vim](https://github.com/vim-denops/denops.vim)
- UIs are constructed with [vaf.vim](https://github.com/hasundue/vaf.vim) (Vim-As-Frontend), which is supposed to be developed along with vim-pluto.

### Interfaces
- :Pluto command launches an instance of Pluto server, connects your vim with it, and opens a "Pluto home buffer" which displays informatiion such as server status and recently opened notebooks.
- When you open a Pluto notebook file while pluto-vim is running, vim-pluto opens a "notebook buffer" and makes you edit it instead of the notebook file itself.
- Notebook buffers are composed of pairs of "input chuncks" and "output chunks", which correspond to cells and their results in the original Pluto, respectively. 
- Output chunks are not editable (you can't enter the insert mode on those chunks), and updated reactively when input chunkcs are modified.
