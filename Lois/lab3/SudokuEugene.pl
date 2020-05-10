:- use_module(library(clpfd)).

sudoku(Rows) :-
  append(Rows, Vs), Vs ins 1..9,
  maplist(all_distinct, Rows),
  transpose(Rows, Columns),
  maplist(all_distinct, Columns),
  Rows = [A,B,C,D,E,F,G,H,I],
  blocks(A, B, C), blocks(D, E, F), blocks(G, H, I),
  maplist(label, Rows).

blocks([], [], []).
blocks([A,B,C|Bs1], [D,E,F|Bs2], [G,H,I|Bs3]) :-
  all_distinct([A,B,C,D,E,F,G,H,I]),
  blocks(Bs1, Bs2, Bs3).
sudoku(1, [[6,_,7,_,_,_,_,3,2],
            [1,4,_,_,_,3,5,9,_],
            [_,8,_,_,5,4,_,_,1],
            [_,1,8,6,_,5,_,_,_],
            [_,_,6,_,9,_,8,_,_],
            [_,_,_,8,_,2,7,1,_],
            [8,_,_,4,1,_,_,6,_],
            [_,6,1,3,_,_,_,5,7],
            [9,2,_,_,_,_,1,_,4]]).
