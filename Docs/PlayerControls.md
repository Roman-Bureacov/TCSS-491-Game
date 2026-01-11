# Player Controls

The player is controlled by context buttons.

## Movement

The player can move in the four cardinal directions:
 * North 
 * South
 * East
 * West

Upon moving in the said direction, the player will stay looking in that direction. If
the player bounces from an attack, they will keep facing the direction they were 
facing given that they don't provide any additional movement input.

## Deflect

The deflection input is brief, but the player puts up their sword to deflect.

This deflection input will be brief and have a set of hitboxes that appear before 
them (described in `Player.md`).

It is only after the deflect window has ended (the final hitbox has played out)
that the player is free to move again.

## Attack 

The attack happens in the direction that the player is facing or where the player
is inputting their movement.