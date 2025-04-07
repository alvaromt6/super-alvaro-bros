const MARIO_ANIMATIONS = {  
    grown: {
        idle: 'mario-grown-idle',
        walk: 'mario-grown-walk',
        jump: 'mario-grown-jump',
    },
    normal: {
        idle: 'mario-idle',
        walk: 'mario-walk',
        jump: 'mario-jump',
        dead: 'mario-dead'
    }
}

export function checkControls({ mario, keys }) {
    const isMarioTouchingFloor = mario.body.touching.down; // si Mario toca el suelo
    const isLeftKeyDown = keys.left.isDown; // si la tecla izquierda está presionada
    const isRightKeyDown = keys.right.isDown; // si la tecla derecha está presionada
    const isUpKeyDown = keys.up.isDown; // si la tecla arriba está presionada

    if (mario.isDead) return;
    if (mario.isBlocked) return;

    const marioAnimations = mario.isGrown 
        ? MARIO_ANIMATIONS.grown 
        : MARIO_ANIMATIONS.normal;

    if (isLeftKeyDown) {
        isMarioTouchingFloor && mario.anims.play(marioAnimations.walk, true);
        mario.x -= 1;
        mario.flipX = true; // giramos el sprite de Mario
    } else if (isRightKeyDown) {
        isMarioTouchingFloor && mario.anims.play(marioAnimations.walk, true);
        mario.x += 1;
        mario.flipX = false; // giramos el sprite de Mario
    } else if (isMarioTouchingFloor) { // si Mario toca el suelo
        mario.anims.play(marioAnimations.idle, true);
    }

    if (isUpKeyDown && isMarioTouchingFloor) { // si Mario toca el suelo
        mario.setVelocityY(-300); // salto
        mario.anims.play(marioAnimations.jump, true);
    }
}