function! pluto#insert_cell_above() abort
    return denops#request('vim-pluto', 'insertCellAbove', [])
endfunction

function! pluto#insert_cell_below() abort
    return denops#request('vim-pluto', 'insertCellBelow', [])
endfunction

function! pluto#show_code() abort
    return denops#request('vim-pluto', 'showCode', [])
endfunction

function! pluto#hide_code() abort
    return denops#request('vim-pluto', 'hideCode', [])
endfunction

function! pluto#toggle_code() abort
    return denops#request('vim-pluto', 'toggleCode', [])
endfunction
