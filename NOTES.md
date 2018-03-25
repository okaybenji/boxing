## Some notes on the design

* Uppercuts require a combo of punch & up keys. To allow combo, there's a short delay before executing jab (punch)/defend (up) to make sure you don't press the other key to trigger an uppercut.
* There's a delay after player attacks before damage is done, but the animation starts instantly (or almost instantly in the case of defend/jab/uppercut). This gives the other player a chance to read the attack and react to it.
* You can avoid a left jab or left uppercut by dodging left. Dodging takes less time than attacking, so if you react quickly enough, you can counter-attack before the other player has recovered from executing their attack. Therefore, the other player will be defenseless and must accept the blow.
* You can block any attack by defending (up), but you will still get hit. You will just take significantly less damage.
* You can avoid both the left and right uppercut by ducking (directionless). To counter the relative ease of avoiding this attack, the attack is also more powerful than a jab. Uppercuts which connect do more damage whether the player receiving the blow is defending or not.
* Another element of the balance of an uppercut is the fact that it takes a longer amount of time to execute. Therefore if the player being attacked dodges the uppercut quickly, they will have more time to execute a counter-attack while the player who missed the uppercut is defenseless. To ensure that a connected uppercut does not leave the attacking player defenseless after the blow is received, the duration of the stun is also increased.

All of the above depends on timing! These values should be adjusted in accordance with playtesting and probably research on human reaction times.