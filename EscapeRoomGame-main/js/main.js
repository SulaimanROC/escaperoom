import {InputHandler} from './input.js'
import {RoomOne, RoomTwo, RoomThree} from './rooms.js'
// import {Player} from './player.js'
// import {Rect} from './rect.js'
// import {Tools} from './tools.js'


window.addEventListener('load', () => {
    const canvas = document.querySelector('.main-canvas'); // de canvas
    const ctx = canvas.getContext('2d'); // hier maken we een 2d context
    canvas.width = 600; // gewoon de grootte enzo
    canvas.height = 600;
    ctx.imageSmoothingEnabled = false;
    
    const overlay = document.querySelector('.canvas-overlay');
    const overlayOkButton = overlay.querySelector('.ok-button');
    const overlayTitle = overlay.querySelector('.text-title');
    const overlayTextContent = overlay.querySelector('.text-content'); 
    overlayOkButton.addEventListener('click', () => {overlay.style.display = 'none';});

    class Game {
        constructor(width, height) {
            this.playerSpriteSheet = document.querySelector('.player-spritesheet') 
            this.playerSpriteSheetLeft = document.querySelector('.player-spritesheet-left')
            this.rooms = [new RoomOne(this), new RoomTwo(this), new RoomThree(this)];
            this.currentRoom = 0;
            this.ctx = ctx; // contextmanager
            this.width = width; 
            this.height = height;
            this.desiredFPS = 30; // me skere fps handling systeem
            this.input = new InputHandler();    
            this.loop = this.mainloop.bind(this); // Eerlijk, geen idee waarom het werkt, maar het werkt wel dus ja  
            canvas.addEventListener('mousedown', (e) => {this.rooms[this.currentRoom].handleMouseDown(e)});
            canvas.addEventListener('mouseup', (e) => {this.rooms[this.currentRoom].handleMouseUp(e)});
            // die goofy ah fps controle systeem
            this.now = Date.now();
            this.then = Date.now();
            this.updateInterval = 1000 / this.desiredFPS;
            this.elapsed = 0;
            this.mouseX = 0;
            this.mouseY = 0;
            canvas.addEventListener('mousemove', (e) => {
                this.mouseX = e.pageX - e.currentTarget.offsetLeft + canvas.width / 2;
                this.mouseY = e.pageY - e.currentTarget.offsetTop + canvas.height / 2;
            })
        }

        update(dt) {
            this.rooms[this.currentRoom].update(dt);
            this.ctx.fillStyle = 'black'
            this.rooms[this.currentRoom].draw();
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            // this.debugWalls();
        }

        mainloop() {

            window.requestAnimationFrame(this.loop); // forceer een update
            
            this.now = Date.now();
            this.elapsed = this.now - this.then; // die skere slome fps ding weer
            
            if (this.elapsed > this.updateInterval) {
                this.then = this.now - (this.elapsed % this.updateInterval);
                this.update(this.elapsed); // update heel de ding na een bepalde tijd. De tijd word door het desiredFPS bepaald\
            }
        }

        nextRoom() {
            this.currentRoom++;
            if (this.currentRoom > this.rooms.length-1) {
                const port = window.location.port;
                const hostname = window.location.hostname;
                window.location.href = `http://${hostname}:${port}/pages/endscreen/index.html`;
                
            }

            this.input.reset(); // Tijdelijke bug oplossing
        }

        textBox(title='', text='') {
            overlayTitle.innerHTML = title;
            overlayTextContent.innerHTML = text;
            overlay.style.display = 'block';
        }
    }

    const game = new Game(canvas.width, canvas.height); // spreekt voor zich
    game.mainloop();
});