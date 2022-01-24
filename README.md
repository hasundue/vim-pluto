# vim-pluto
A plugin for editing [Pluto](https://github.com/fonsp/Pluto.jl) notebooks with Vim.

Currently, a couple of different versions of the plugin are being developed.
- A minimalistic helper plugin with which you edit .jl notebook files directly (main branch)
- A plugin which turns your Vim into a front-end of Pluto (dev branch)

## Requirements
- Vim8/NeoVim
- Deno
- denops.vim

## Installation
1. Install Deno (see https://deno.land/#installation)
1. Install denops.vim and vim-pluto with your package manager

ex. vim-plug
```viml
Plug 'vim-denops/denops.vim'
Plug 'hasundue/vim-pluto'
```

## Configuration
vim-pluto does not provide any default key mappings. You have to do it manually.

Example:

```viml
nnoremap <silent> <LocalLeader>O :call pluto#insert_cell_above()<CR>
nnoremap <silent> <LocalLeader>o :call pluto#insert_cell_below()<CR>
```

## Recommended Usage
Launch Pluto server with auto_reload_from_file = true.

Example:

```julia
import Pluto
Pluto.run(auto_reload_from_file = true)
```

Enable autoread function of Vim.

Example:

```viml
set autoread
autocmd FocusGained,BufEnter,CursorHold,CursorHoldI * if mode() != 'c' | checktime | endif
autocmd FileChangedShellPost * echohl WarningMsg | echo "File changed on disk. Buffer reloaded." | echohl None
```

Edit a notebook (.jl file) in Vim while opening the notebook in Pluto web UI.

## Functions
### Insertion of a cell
- pluto#insert_cell_above()
- pluto#insert_cell_below()

Insert an empty cell above/below the cell under the cursor and start editing it.
