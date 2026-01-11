# Camera

The way objects are drawn on the canvas is not by traditional means, at least 
not in primitive means. The camera is a floating object, which transforms actual 
objects into view and then draws them, this lets the camera actually be able to 
move around and allow for some flexibility that isn't allowed for traditional 
primitive cameras that only draw from the (0,0) coordinate.

The inspiration is that of a 3D camera, which performs matrix multiplications on
triangles to figure out what needs to be drawn.

## Panes

The view itself is divided into panes, which are like layers that objects exist on.

The global pane is the panes in which all other panes are defined with respect to.

Every pane is defined with an origin that is a 3x3 matrix, of the form:

```
X1 Y1 C1
X2 Y2 C2
0  0  1
```

which has an X and Y component along with a translation component C. To move a pane
around, simply multiply it by a 3x3 non-singular transformation matrix. Note that
the components `X2` and `Y1` are primarily for rotations, if the panes are rotated.

Points themselves within the panes are defined as column vectors of the form:

```
X
Y
1
```

Where the 1 is specifically for homogenous coordinate purposes.

To transform objects around in panes, you perform a matrix multiplication with the 
transformation matrix `T` and the column vector `V`: `TV = newCoord`.

## Transformation

The individual panes are transformed with respect to the camera's position, that way 
when attempting to rasterize the image of an object within a pane, it is converted
into coordinates of the camera so that it is drawn correctly on the canvas.

The Global pane is meant specifically for global positioning. Every other pane is
drawn on top of and with respect to the global pane.

