# Maps

The maps are 2D and may feature platforms or obstacles.

The maps will be specified by a JSON file, which itself described where to position
the obstacles in the format:

```JSON
{
  "type" : <INTEGER>,
  "object" : {
    "position" : [<INTEGER>, <INTEGER>],
    "bounds" : [<INTEGER>, <INTEGER>],
    "texture" : <STRING>
  }
}
```

The type is an internal representation of what the obstacle is. 

| Integer | Type     |
|---------|----------|
| 0       | Platform |
| 1       | Hazard   |

## Platform

Platforms are one-way solid objects, players can traverse up through them, but will
walk on top of them unless they provide a south movement context.

## Hazard

Hazards are non-solid objects that can incur damage on other players, players can
pass through them going in any direction.