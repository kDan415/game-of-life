# game-of-life
This repository contains a js implementation of Conway's Game of Life without any frameworks.

# Rules
1) Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2) Any live cell with two or three live neighbours lives on to the next generation.
3) Any live cell with more than three live neighbours dies, as if by overpopulation.
4) Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

The set of game rules can be changed in the nextStep() function.

# About the application
This application automatically calculates the maximum number of cells on the screen and the maximum cell size for a given screen size.
Some initial settings can be changed by editing the constants.
MINIMUM_NUMBER_OF_CELLS allows you to set the minimum field size in cells. The default is 10 by 10.
MINIMUM_CELL_SIZE_IN_PIXELS allows you to change the minimum cell size in pixels.
PADDING_IN_PIXELS allows you to set padding from the edges of the screen when calculating the size of the field in pixels.
