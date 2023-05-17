import {Player} from './player.js'
import {Rect} from './rect.js'
import {Tools} from './tools.js'

class Room {
    constructor() {

    }

    update(dt) {

    }

    draw() {

    }

    handleMouseDown() {

    }

    handleMouseUp() {

    }
}



export class RoomOne extends Room{        // Use inheritance perhaps? a @TODO?
    constructor(game) {
        super();
        this.game = game;
        this.assets = {
            'room-one-closed': document.querySelector('.room-one-closed'),
            'room-one-open': document.querySelector('.room-one-open'),    // Dit zijn de assets van kamer 1
        };
        this.walls = [
            new Rect(0, 0, 75, 600),
            new Rect(0, 0, 600, 75),
            new Rect(0, 525, 600, 75),
            new Rect(525, 0, 75, 600),
            new Rect(75, 220, 95, 170),
            new Rect(180, 75, 50, 105),  // En hier de muren 
            new Rect(300, 75, 50, 105)
        ];

        this.player = new Player(this.game, this, 260, 150);
        this.doorCollider = new Rect(445, 75, 70, 25); // de doorcollider is niks anders dan een collider om te checken of je bij de deur staat
        this.accessCardPickup = new Rect(360, 200, 30, 30); // Same shit met de deur maar met de accesscard

        this.playerHasAccessCard = false; // Spreekt voor zich
        this.doorOpen = false; // dit ook wel
    }

    checkTriggerCollisions() { 
        // Kan wel een meer passende naam voor vnden
        if (!this.playerHasAccessCard) { // als de player geen accesscard heeft...
            if (Tools.AABB(this.player, this.accessCardPickup)) { // ...checken we of hij dichtbij genoeg is om die op te pakken 
                if (confirm('Ew, a dead body. I wonder how long this has been rotting here on the ground... Should I search it?')) {
                    this.game.textBox('Lucky..', 'You\'ve found an access card! Take it with you, maybe it will help you getting out of this room!')
                    this.playerHasAccessCard = true;
                    this.game.input.reset() // <<< Tijdelijke fix voor een bug met de input systeem en browser popup
                } else {
                    this.player.x += 50; // Tijdelijk fix voor een bug waar de player in de collider blijft staan en deze stuk code constant laat runnen
                    // @TODO: fix weird bug where confirms freeze the inputManager
                    // quickfix: 
                    this.game.input.reset()
                }
            }
        } else if (!this.doorOpen) { // als de deur niet open is, gaat die wel open zijn
            if (Tools.AABB(this.player, this.doorCollider)) {
                this.doorOpen = true;
                this.player.y += 10; // tijdelijk bugfix
            }
        } else {
            if (Tools.AABB(this.player, this.doorCollider)) {
                this.game.textBox('LEVEL 2', 'Where even am I? I better continue and get out of here...'); // progress naar kamer 2
                this.game.nextRoom();
            }
        } 
    }

    update(dt) {
        this.player.update(dt);
        this.checkTriggerCollisions();
    }

    draw() {
        this.game.ctx.clearRect(0, 0, this.width, this.height); // clear het scherm met de contextmanager
        if (this.doorOpen){
            this.game.ctx.drawImage(this.assets['room-one-open'], 0, 0, 600, 600) // spreekt voor zich
        } else {
            this.game.ctx.drawImage(this.assets['room-one-closed'], 0, 0, 600, 600)
        }
        
        this.player.draw();
    }
    handleClick(e) {
        
    }
}



class Terminal extends Room{
    constructor(game) {
        super();
        this.game = game;
        this.assets = {
            'terminal': document.querySelector('.terminal')
        };
    
        this.wrong = false;
        this.correctConnections = [[0, 2], [1, 0], [2, 1]]
        this.fixed = false;
        this.connections = []
        this.cablesConnected = []
        this.cableStartDrag = [
            new Rect(70, 50, 100, 100),
            new Rect(255, 50, 100, 100),
            new Rect(420, 50, 100, 100),
        ];

        this.cableConnectFrom = [
            new Rect(115, 90, '_', '_'),
            new Rect(300, 90, '_', '_'),
            new Rect(465, 90, '_', '_'),
        ]

        this.cableConnectTo = [
            new Rect(105, 480, '_', '_'),
            new Rect(300, 480, '_', '_'),
            new Rect(485, 480, '_', '_'),
        ]

        this.cableStopDrag = [
            new Rect(50, 430, 120, 100),
            new Rect(225, 430, 140, 100),
            new Rect(425, 430, 120, 100)
        ]

        this.draggingCable = false;
        this.draggedCable = -1;
    }


    checkWin() {
        this.connections.forEach((c) => {
            let includes = this.correctConnections.some(a => c.every((v, i) => v === a[i]));
            if (!includes) {
                this.wrong = true;
                const audio = new Audio('./../sounds/terminalFixed.wav');
                audio.play();
            }
        })
        if (!this.wrong) {
            this.fixed = true;
            const audio = new Audio('./../sounds/terminalWrong.wav');
            audio.play();
        }
    }


    update() {
        if (this.connections.length == this.correctConnections.length) {
            this.checkWin();
        }
    }


    draw() {
        this.game.ctx.clearRect(0, 0, this.game.width, this.game.height);
        this.game.ctx.drawImage(this.assets['terminal'], 0, 0, 600, 600)
        if (this.draggingCable) {
            this.game.ctx.beginPath();
            this.game.ctx.moveTo(this.cableConnectFrom[this.draggedCable].x, 
                this.cableConnectFrom[this.draggedCable].y);
            this.game.ctx.lineTo(this.game.mouseX, this.game.mouseY);
            this.game.ctx.lineWidth  = 5; 
            this.game.ctx.stroke();
            this.game.ctx.closePath();
        }
        this.connections.forEach((c) => {
            this.game.ctx.beginPath();
            this.game.ctx.moveTo(this.cableConnectFrom[c[0]].x, 
                this.cableConnectFrom[c[0]].y);
            this.game.ctx.lineTo(this.cableConnectTo[c[1]].x, 
                this.cableConnectTo[c[1]].y);
            this.game.ctx.lineWidth  = 5; 
            this.game.ctx.stroke();
            this.game.ctx.closePath();
        })
    }


    handleMouseDown(e) {
        this.cableStartDrag.forEach((t, i) => {
            if (Tools.pointInRect(e.offsetX, e.offsetY, t)) {
                if (!this.cablesConnected.includes(i)) {
                    this.draggingCable = true;
                    this.draggedCable = i;
                }
            }
        })
    }


    handleMouseUp(e) {
        if (this.draggingCable) {
            this.cableStopDrag.forEach((t, i) => {
                if (Tools.pointInRect(e.offsetX, e.offsetY, t)) {
                    this.connections.push([this.draggedCable, i])
                    this.cablesConnected.push(this.draggedCable)
                    const audio = new Audio('./../sounds/connectWire.wav');
                    audio.play();              
                }
            })
            this.draggingCable = false;
        } 
    }
}



export class RoomTwo extends Room{
    constructor(game) {
        super();
        this.game = game;
        this.assets = {
            'room-two': document.querySelector('.room-two'),
            'room-two-fixed': document.querySelector('.room-two-fixed')
        };
        this.walls = [
            new Rect(85, 0, 70, 600),
            new Rect(155, 0, 290, 75),
            new Rect(155, 530, 290, 75),
            new Rect(445, 0, 75, 600),
        ];
        this.liftDoorCollider = new Rect(275, 75, 50, 30);
        this.terminalCollider = new Rect(355, 75, 30, 10)
        this.usingTerminal = false;
        this.terminal = new Terminal(this.game);
        this.player = new Player(this.game, this, 300, 450);

    }


    checkTriggerCollisions() { 
        if (Tools.AABB(this.player, this.terminalCollider) && !this.terminal.fixed) {
            this.usingTerminal = true;
        }
        if (this.terminal.fixed && Tools.AABB(this.player, this.liftDoorCollider)) {
            this.game.nextRoom();
            this.game.textBox('LEVEL 3', 'It looks like I could use this metro to escape from here...');
        }
    }


    update(dt) {
        if (!this.usingTerminal) {
            this.player.update(dt);
            this.checkTriggerCollisions();
        }
        if (this.terminal.fixed) 
        {
            this.usingTerminal = false;           
        } else if (this.terminal.wrong) {
            this.player.y += 50;
            this.usingTerminal = false; 
            this.terminal = new Terminal(this.game);
        }
    }


    draw() {

        this.game.ctx.clearRect(0, 0, this.game.width, this.game.height);

        if (this.usingTerminal && !this.terminal.fixed) {
            this.terminal.update();
            this.terminal.draw();
        } else if (!this.terminal.fixed) {

            this.game.ctx.drawImage(this.assets['room-two'], 0, 0, 600, 600);
            this.player.draw()
        } else {
            this.game.ctx.drawImage(this.assets['room-two-fixed'], 0, 0, 600, 600);
            this.player.draw()
        }

    }
    handleMouseDown(e) {
        if (this.usingTerminal) {
            this.terminal.handleMouseDown(e)
        }
    }

    handleMouseUp(e) {
        if (this.usingTerminal) {
            this.terminal.handleMouseUp(e)
        }
    }

}



export class RoomThree extends Room {
    constructor(game) {
        super();
        this.game = game;
        this.assets = {
            'roofed': document.querySelector('.room-three-roof-closed'),
            'roofless': document.querySelector('.room-three-roof-off')
        }
        this.walls = [
            new Rect(0, 0, 600, 1),
            new Rect(599, 0, 1, 600),
            new Rect(0, 599, 600, 1),
            new Rect(15, 0, 20, 600),
            new Rect(35, 275, 35, 600),
            //new Rect(115, 200, 35, 200),
            new Rect(150, 0, 20, 109),
            new Rect(150, 196, 20, 219),
            new Rect(150, 502, 20, 100),
            new Rect(35, 62, 60, 20)
        ]
        this.roofOffCollider = new Rect(10, 0, 300, 600);
        this.player = new Player(game, this, 500, 500)
        this.showRoof = true;
        this.trainEnterColliders = [
            new Rect(148, 107, 20, 90),
            new Rect(148, 414, 20, 90)
        ]
        this.enteredTrain = false;
        this.liquidVileColliders = [
            new Rect(35, 20, 20, 30),
            new Rect(60, 370, 20, 70),
            new Rect(130, 570, 20, 30)
        ]
        this.tableCollider = new Rect(35, 100, 60, 30);
        this.lockCollider = new Rect(100, 20, 25, 25);
        this.madeAcid = false;
    }


    update() {
        this.player.update()
        if (Tools.AABB(this.player, this.roofOffCollider)) {
            this.showRoof = false;
        } else {
            this.showRoof = true;
        }
        if (!this.enteredTrain) {
            this.trainEnterColliders.forEach((c) => {
                if (Tools.AABB(this.player, c)) {
                    this.enteredTrain = true;
                    this.game.textBox('Weird..', 'What are those liquids? it looks like I could use them somehow, possibly mix them, maybe something acid-like to melt the lock?')
                }
            })
        }
        this.liquidVileColliders.forEach((c, i) => {
            if (Tools.AABB(this.player, c)) {
                this.game.textBox('Picked Up', 'Just picked up a vile..');
                this.liquidVileColliders.splice(i, 1)
                if (this.liquidVileColliders.length == 0) {
                    this.game.textBox('Got them all', 'I got a little bit of liquid from every vile I found..');
                    
                }
            }
        })
        if (this.liquidVileColliders.length == 0) {
            if (Tools.AABB(this.player, this.tableCollider)) {
                this.game.textBox('Gotcha!', 'I dont remember making acid being that easy at chemistry class..')
                this.madeAcid = true;
            }
        }
        if (this.madeAcid && Tools.AABB(this.player, this.lockCollider)) {
            this.game.nextRoom()
        }
    }


    draw() {
        this.game.ctx.clearRect(0, 0, this.game.width, this.game.height);
        if (this.showRoof) {
            this.game.ctx.drawImage(this.assets['roofed'], 0, 0, 600, 600);
        } else {
            this.game.ctx.drawImage(this.assets['roofless'], 0, 0, 600, 600);
        }
        this.player.draw();
    }
}