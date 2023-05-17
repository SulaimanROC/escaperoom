

export class Tools {
    static AABB (rect1, rect2) {
        return rect1.x < rect2.x + rect2.w && // Een check of er een botsing was tussen 2 vierkantige figuren
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.h + rect1.y > rect2.y;
    }

    static pointInRect(pX, pY, rect) {
        return pX > rect.x && pX < rect.x+rect.w &&
        pY > rect.y && pY < rect.y + rect.h;
    }

}