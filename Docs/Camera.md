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

## Transformation

The individual panes are transformed with respect to the camera's position, that way 
when attempting to rasterize the image of an object within a pane, it is converted
into coordinates of the camera so that it is drawn correctly on the canvas.