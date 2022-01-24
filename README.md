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

ex. Vim-Plug
```viml
Plug 'vim-denops/denops.vim'
Plug 'hasundue/vim-pluto'
```

## Configuration
vim-pluto does not provide any default key mappings. You have to do it manually.

An example:

```viml
nnoremap <silent> <LocalLeader>O :call pluto#insert_cell_above()<CR>
nnoremap <silent> <LocalLeader>o :call pluto#insert_cell_below()<CR>
```

## Usage
