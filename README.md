# vim-pluto
A plugin for editing [Pluto](https://github.com/fonsp/Pluto.jl) notebooks with Vim.

Currently, a couple of different versions of the plugin are being developed.
- A minimalistic helper plugin to edit .jl notebook files, which is supposed to interact with Pluto indirectly (main branch)
- A plugin which turns your Vim into a front-end of Pluto, interacting with Pluto directly (dev branch)

## Requirements
- Vim 8 / NeoVim 0.5 or newer
- [Deno](https://deno.land)
- [denops.vim](https://github.com/vim-denops/denops.vim)

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
nnoremap <silent> <LocalLeader>t :call pluto#toggle_code()<CR>
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

## Provided Functions
### Insert a cell
- pluto#insert_cell_above()
- pluto#insert_cell_below()

Insert an empty cell above/below the cell under the cursor and start editing it.

### Show/hide code
- pluto#show_code()
- pluto#hide_code()
- pluto#toggle_code()

Change visibility of code in the cell under the cursor.

Changes are not reflected in Web UI until a reload of the notebook because Pluto lacks of the implementation, unfortunately.
