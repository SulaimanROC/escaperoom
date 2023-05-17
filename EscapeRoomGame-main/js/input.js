export class InputHandler {
    constructor() {
        this.down = { // alle mogelijke / (handige) keys die ingedrukt kunnen zijn
            'a': false,
            'b': false,
            'c': false,
            'd': false,
            'e': false,
            'f': false,
            'g': false,
            'h': false,
            'i': false,
            'j': false,
            'k': false,
            'l': false,
            'm': false,
            'n': false,
            'o': false,
            'p': false,
            'r': false,
            's': false,
            't': false,
            'u': false,
            'w': false,
            'x': false,
            'y': false,
            'z': false,
            ' ': false,
            'escape': false
        };
        window.addEventListener('keydown', (e) => {
            this.keyDown(e);
        });
        window.addEventListener('keyup', (e) => {
            this.keyUp(e);
        })
    }
    
    reset() {
        for (let key in this.down) {
            this.down[key] = false; // de reset functie gaat zo weg, het is een deel van die tijdelijk bugfix 
        }
    }

    keyDown(e) {
        if (e.key.toLowerCase() in this.down) {
            this.down[e.key] = true; // spreekt voor zich 
        }
    }

    keyUp(e) {
        if (e.key.toLowerCase() in this.down) {
            this.down[e.key] = false; // same
        }
    }
    
    getPressed() {
        return this.down; //same
    }
}