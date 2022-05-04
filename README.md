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
1) MINIMUM_NUMBER_OF_CELLS allows you to set the minimum field size in cells. The default is 10 by 10.
2) MINIMUM_CELL_SIZE_IN_PIXELS allows you to change the minimum cell size in pixels.
3) PADDING_IN_PIXELS allows you to set padding from the edges of the screen when calculating the size of the field in pixels.
When calculating the next step, a classical algorithm is used with enumeration of all cells and counting living cells around each.
Neighbor counting is performed by the numberOfLivingCellsAround function.
When out of bounds, this function checks cells from the other end of the field, so the field becomes infinite.
The playing field is a torus unfolded on a plane.


You can use this code in your project with your own changes or watch the demo directly in the browser using the link: https://kdan415.github.io/game-of-life/
