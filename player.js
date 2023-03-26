const MOVE_UP_KEY_CODES = ["ArrowUp", "KeyW"];
const MOVE_DOWN_KEY_CODES = ["ArrowDown", "KeyS"];
const MOVE_LEFT_KEY_CODES = ["ArrowLeft", "KeyA"];
const MOVE_RIGHT_KEY_CODES = ["ArrowRight", "KeyD"];
const ALL_MOVE_KEY_CODES = [...MOVE_DOWN_KEY_CODES, ...MOVE_LEFT_KEY_CODES, ...MOVE_RIGHT_KEY_CODES, ...MOVE_UP_KEY_CODES]


export class Player {
    constructor(x, y, context, movementLimits) {
        this.velocity = 3;
        this.radius = 20;


        this.x = x;
        this.y = y;
        this.context = context;
        this.cursorPosition = {
            x: 0,
            y: 0
        }

        this.movementLimits = {
            minX: movementLimits.minX + this.radius,
            maxX: movementLimits.maxX - this.radius,
            minY: movementLimits.minY + this.radius,
            maxY: movementLimits.maxY - this.radius,
        }

        document.addEventListener("mousemove", event => {
            this.cursorPosition.x = event.clientX;
            this.cursorPosition.y = event.clientY;
        });

        this.keyMap = new Map();
        document.addEventListener("keydown", event => this.keyMap.set(event.code, true));
        document.addEventListener("keyup", event => this.keyMap.set(event.code));

        this.image = new Image();
        this.image.src = "./img/player.png";
        this.imageWidth = 66;
        this.imageHeight = 100;
    }

    drawImg() {
        this.context.drawImage(
            this.image,
            0,
            0,
            this.imageWidth,
            this.imageHeight,
            this.x - this.imageWidth / 2,
            this.y - this.imageHeight / 2,
            this.imageWidth,
            this.imageHeight
        );
    }

    draw() {
        this.context.save();
        let angle = Math.atan2(this.cursorPosition.y - this.y, this.cursorPosition.x - this.x);
        this.context.translate(this.x, this.y);
        this.context.rotate(angle + Math.PI / 2);
        this.context.translate(-this.x, -this.y);
        this.drawImg();
        this.context.restore();
    }

    update() {
        this.draw();
        this.isMoving = this.shouldMove(ALL_MOVE_KEY_CODES)
        this.updatePosition();
        this.checkPositionLimitAndUpdate();
    }

    updatePosition() {
        if (this.shouldMove(MOVE_UP_KEY_CODES)) this.y -= this.velocity;
        if (this.shouldMove(MOVE_DOWN_KEY_CODES)) this.y += this.velocity;
        if (this.shouldMove(MOVE_LEFT_KEY_CODES)) this.x -= this.velocity;
        if (this.shouldMove(MOVE_RIGHT_KEY_CODES)) this.x += this.velocity;
    }

    checkPositionLimitAndUpdate() {
        if (this.y < this.movementLimits.minY) this.Y = this.movementLimits.maxX;
        if (this.y > this.movementLimits.maxY) this.Y = this.movementLimits.maxY;
        if (this.x < this.movementLimits.minX) this.X = this.movementLimits.minX;
        if (this.x > this.movementLimits.maxX) this.X = this.movementLimits.maxX;
    }

    shouldMove(keys) {
        return keys.some(key => this.keyMap.get(key));
    }

}