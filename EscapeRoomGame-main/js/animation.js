

export class Animation { // Not really reusable
    constructor (spritesheets, fw, fh, ft, fa) {
        this.spritesheets = spritesheets;
        
        this.frameWidth = fw;
        this.frameHeight = fh;
        this.frameTime = ft;
        this.frameAmount = fa;
        this.timeSinceLastChange = 0;
        this.currentFrame = 0;
    }

    update(dt) {
        this.timeSinceLastChange += dt;
        if (this.timeSinceLastChange >= this.frameTime) {
            this.currentFrame++;
            if (this.currentFrame == this.frameAmount) {
                this.currentFrame = 0;
            }
            this.timeSinceLastChange = 0;
        }
    }

    draw(ctx, x, y, flip) {
        if (!flip) {
            ctx.drawImage(this.spritesheets[0], 
                this.frameWidth * this.currentFrame,
                0, this.frameWidth, this.frameHeight,
                x, y, 38, 38);
        } else {
            ctx.drawImage(this.spritesheets[1], 
                this.frameWidth * this.currentFrame,
                0, this.frameWidth, this.frameHeight,
                x, y, 38, 38);
        }
        

    }
}