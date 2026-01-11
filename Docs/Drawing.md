# Drawing

The drawing system will be similar to that of 3D graphics, where you have a camera and
a scene, however the scene is split into panes, and the camera itself is its own pane.

The panes and objects are all defined using matrices, where panes and objects are 
positioned using 3x3 homogenous matrices. To move these, you perform a transformation,
simply a matrix multiplication.

## Camera

The way objects are drawn on the canvas is not by traditional means, at least 
not in primitive means. The camera is a floating object, which transforms actual 
objects into view and then draws them, this lets the camera actually be able to 
move around and allow for some flexibility that isn't allowed for traditional 
primitive cameras that only draw from the (0,0) coordinate.

The inspiration is that of a 3D camera, which performs matrix multiplications on
triangles to figure out what needs to be drawn.

Every object will be drawn in its own pane with its own coordinate system, which will
all be defined with respect to the pane's coordinate system, which is defined with 
respect to the global pane's coordinate system.

To draw on the camera's pane, one simply transforms an object from the local coordinate
system to the pane's coordinates, to the global coordinates, and finally to the camera's 
coordinates.

Because the camera is defined with respect to the global coordinate system, the camera
transformation matrix is simply inverted for converting objects into camera space.

The camera itself also is modeled after the pinhole camera, with a defined aperture,
focal length, and field of view—each parameter modifying the viewport; in essence, the
camera is a simplified 3D camera.

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

