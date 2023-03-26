import { cosBetweenTwoPoints, sinBetweenTwoPoints } from "./utilities.js";


export class Enemy {
    constructor(canvasWidth, canvasHeight, context, player) {
        this.context = context;
        this.player = player;

        this.radius = 20;
        this.health = 1;    

        if (Math.random() < 0.5) {
            this.x = Math.random() < 0.5 ? 0 - this.radius : canvasWidth + this.radius;
            this.y = Math.random() * canvasHeight;
        } else {
            this.y = Math.random() < 0.5 ? 0 - this.radius : canvasHeight + this.radius;
            this.x = Math.random() * canvasWidth;
        }

        this.image = new Image();
        this.image.src = "./img/enemy.png"
        this.imageWidth = 66;
        this.imageHeight = 66;
        this.imageTick = 0;
    }

    drawImg() {
        const imageTickLimit = 18;
        const subX = this.imageTick > imageTickLimit ? this.imageTick : 0;

        if (this.imageTick > imageTickLimit * 2) this.imageTick = 0;

        this.context.drawImage(
            this.image,
            subX,
            0,
            this.imageHeight,
            this.imageWidth,
            this.x - this.imageWidth,
            this.y - this.imageHeight,
            this.imageHeight,
            this.imageWidth,
        );
    }

    draw() {
        this.context.save();
        let angle = Math.atan2(this.player.y - this.y, this.player.x - this.x);
        this.context.translate(this.x, this.y);
        this.context.rotate(angle + Math.PI / 2);
        this.context.translate(-this.x, -this.y);
        this.drawImg();
        this.context.restore();
    }


    update() {
        this.draw();
        this.velocity = {
            x: cosBetweenTwoPoints(this.player.x + this.player.radius, this.player.y + this.player.radius, this.x, this.y) * 2,
            y: sinBetweenTwoPoints(this.player.x + this.player.radius, this.player.y + this.player.radius, this.x, this.y) * 2,
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}