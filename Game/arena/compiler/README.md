# Arena Compiler

The arena compiler is a very simple system, as depicted below. 

The language itself is an LL(1) language.

## `set` name

Every arena starts with the set name, which specifies what spritesheet to use
for individual tiles. More generally, it specifies what tile set to choose 
when making the arena.

The set is specified by

`set: <setName>`

The `<setName>` points to a specific tile factory that the arena factory 
makes use of.

## `dimension` specifier

The dimension specifier points out properties about the arena.

The dimension is denoted

`dimension:`

Every property is delimited by a pipe, such as

```txt
dimension:
| origin: -5, 5
| matrix: 5 rows by 10 columns
| size: 10 by 5
| tiles: default
```

### `origin` specifier

The origin specifier depicts where to start laying tiles from in the world.

The origin is specified by

`origin: [-]<number>, [-]<number>`

Note that the minus sign is optional here, making it possible to specify negative
coordinates.

As an example:

`origin: -5, 5`

This will start placing tiles from `(-5, 5)` in the world.

### `matrix` specifier

The matrix specifier depicts how to lay out the tiles.

The place where the tiles of the arena are placed are specified by a matrix. This
placement matrix starts from the top-left and ends at the bottom-right. 

The matrix is specified by 

`matrix: <number> rows by <number> columns`

If either number is a floating-point number, then it is rounded down.

As an example:

`matrix: 5 rows by 10 columns`

This will place tiles as far as 5 rows down, and as far as 10 columns to the right.

### `size` specifier

The size specifier depicts the size of the placement frame. The matrix specifier 
depicts how to split this dimension into rows and columns for placement. 

The size is specified by

`size: <number> by <number>`

As an example:

`size: 10 by 5`

The placement matrix will be of width 10 and height 5, extending to the right
and down, from the origin.

### `tiles` specifier

The tiles specifier depicts the size of every tile that is placed.

The tiles are specified by

`tiles: (<number> by <number> | default | auto)`

The `default` keyword means tiles will be 1 unit wide and 1 unit tall.

The `auto` keyword means that the tiles will be resized to fill the individual
cells of the placement matrix.

As an example:

`tiles: 1 by 2`

This will mean that every tile placed is 1 unit wide and 2 units tall.

# `Arena` map

The arena map is an extension of the properties outlined prior.

The arena is specified by

`arena: <map> end`

Note that the arena must end with an `end`.

Periods `.` denote empty space, where no tile will exist.

Capital alphabetic characters `A..Z` denote a tile on the tile set spritesheet.
The characters map to tiles, going left-to-right, top-to-bottom, like a page of 
text.

For example, an image for a tile set with 3 rows and 5 columns will look like this:

```txt
ABCDE
FGHIJ
KLMNO
```

As an example of a tile map:

```txt
arena:
..........
..........
.AC....AC.
..........
.ABBBBBBC.
end
```

# Examples

```basic.txt
set: industrial
dimension:
| origin: -5, 5
| matrix: 5 rows by 10 columns
| size: 10 by 5
| tiles: default
arena:
..........
..........
.AC....AC.
..........
.ABBBBBBC.
end
```