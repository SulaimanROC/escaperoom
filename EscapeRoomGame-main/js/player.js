import {Tools} from "./tools.js";
import {Rect} from './rect.js'
import { Animation } from "./animation.js";


export class Player {
    constructor(game, room, x, y) {
        this.room = room; 
        this.game = game;
        this.walkSpeed = 3;
        this.animation = new Animation([this.game.playerSpriteSheet, this.game.playerSpriteSheetLeft], 16, 16, 400, 4)
        this.x = x;
        this.y = y; // Grootte en coordinaten
        this.w = 16;
        this.h = 34;
        this.movingLeft = false;
    }

    collideAndMove(movX, movY) {
        let spoofX = this.x + movX; // We maken een neppe "beweging" in het X axis
        let spoofXHitBox = new Rect(spoofX, this.y, this.w, this.h); // Waardoor dit onze tijdelijke hitbox wordt 
        let canMoveX = true;
        this.room.walls.forEach(wall => {
            if (Tools.AABB(spoofXHitBox, wall)) {
                canMoveX = false; // Hier checken we of we tegen iets aanbotsen met het AABB methode.
            }
        });
        if (canMoveX) this.x += movX; // Uiteinelijk beweegt de player in het echt, als je tuurlijk tegen niks ging botsen

        let spoofY = this.y + movY; // same shit man, but like Y axis and shit
        let spoofYHitBox = new Rect(this.x, spoofY, this.w, this.h);
        let canMoveY = true;
        this.room.walls.forEach(wall => {
            if (Tools.AABB(spoofYHitBox, wall)) {
                canMoveY = false;
            }
        });
        if (canMoveY) this.y += movY;
        if (movX < 0) {
            this.movingLeft = true;
        } else if (movX > 0) {
            this.movingLeft = false;
        }
        return ((canMoveX || canMoveY) && (movX != 0 || movY != 0));
    }


    move() {
        let keysPressed = this.game.input.getPressed(); // Hier krijgen we al de input van me InputManager
        let movX = 0; // Beginwaardes van het "move"
        let movY = 0;
        if (keysPressed['a']) {
            movX -= this.walkSpeed;
        }
        if (keysPressed['d']) {
            movX += this.walkSpeed;
        }
        if (keysPressed['w']) {
            movY -= this.walkSpeed; // Spreekt voor zich
        }
        if (keysPressed['s']) {
            movY += this.walkSpeed;
        }

        // Hier checken we of de player ging bewegen ^^
        return this.collideAndMove(movX, movY); // Dan checken we voor botsingen, als je tegen niks aanbotst dan beweeg je gwn
    }


    update(dt) {
        if (this.move()) {
            this.animation.update(dt)
        }
        
    }


    draw() {
        this.animation.draw(this.game.ctx, this.x-10, this.y-5, this.movingLeft);
    }
}