function! pluto#insert_cell_above() abort
    return denops#request('vim-pluto', 'insertCellAbove', [])
endfunction

function! pluto#insert_cell_below() abort
    return denops#request('vim-pluto', 'insertCellBelow', [])
endfunction
