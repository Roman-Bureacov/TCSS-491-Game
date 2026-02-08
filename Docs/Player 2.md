# Player

The player is a simple character that has access to a few offensive and defensive
options.

In particular, the players wield swords, which they may choose to either attack with,
potentially clashing, 

## Offense

The player may choose to attack in either of the four cardinal directions, specifically
in the direction in which they are either currently facing or in which they are moving;
to attack south, the player merely needs to input the south movement context.

If a two player attack simultaneously, they will bounce off of one-another and deal
reduced damage to each other. It is only if the one player lands an attack 
early enough that it will deal full damage.

## Defense

The defense is merely a deflect that the player may perform. On the deflect context,
the player will briefly hold out their sword to block in the direction they are 
facing or in the direction they are moving. 

The deflect mechanic works by providing three hitboxes which activate independently:

1. The deflect hitbox activates first. If an attack collides with this hitbox:
    * The attack is successfully deflected, the player takes no damage
    * The opponent will bounce backwards
    * A minimal amount of posture is built
2. The successful block hitbox activates second. If an attack collides 
with this hitbox:
    * The attack is unsuccessfully deflected, the player takes 25% damage
    * The opponent will moderately bounce backwards
    * Posture is built relative to the damage taken
3. The unsuccessful block hitbox activates third. If an attack collides with
this hitbox:
    * The attack is unsuccessfully deflected, the player takes 75% damage
    * The opponent will slightly bounce backwards
    * Posture is built relative to the damage taken
4. The failed block hitbox activates fourth. If an attack collides 
with this hitbox:
    * The block is not deflected at all, the player takes full damage
    * The opponent will slightly bounce backwards 
    * The player takes full posture damage

The player will always bounce back the same amount, which will be about the same
as an unsuccessful block.

The point of these deflects is to allow for faster-paced combat, where you are
incentivised to constantly attack and pressure the opponent.

The other purpose of this deflecting mechanic is to create moments of 
"absolute cinema," where sparks fly everywhere.

A player that bounces off due to a deflected attack will always bounce off at least
enough to stay in the air. For example, if the player is above their opponent and 
the opponent performs an unsuccessful block, then the player will at least bounce 
enough to stay in the air.

## Posture

Posture will be a mechanic much like stamina, where the player can make attacks as
they wish, but must be careful about being hit; playing too aggressive can cost
the player their live.

As the player takes damage, they will build up posture. Posture itself will decay 
naturally, but the decay is scaled with the amount of health remaining; the less 
health the player has, the slower the posture decay. 

Once the posture meter is full the player will go into a downed state, where they
will be temporarily staggered and open for a finisher, where the opponent can
proceed to move up to the player and perform a finisher. The finisher window is 
limited, if the opponent fails to perform a finisher, the player will be back up,
with only their posture meter restored to zero.

## Health

The health merely works as a health bar for the posture meter. Downing the health
to zero doesn't mean that the opponent is out, rather it means that they are more
vulnerable to a finisher because their posture meter fills up faster.

## Breaks

The player is given a set amount of breaks, in that the player may have a finisher
performed on them a set amount of times until they are out; the number of finishers
until they are out is the number of *breaks* that the player has.

