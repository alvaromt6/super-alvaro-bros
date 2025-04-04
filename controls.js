export function checkControls({ mario, keys }) {

    const isMarioTouchingFloor = mario.body.touching.down //si mario toca el suelo
    const isLeftKeyDown = keys.left.isDown //si la tecla izquierda esta presionada
    const isRightKeyDown = keys.right.isDown //si la tecla derecha esta presionada
    const isUpKeyDown = keys.up.isDown //si la tecla arriba esta presionada

    if( mario.isDead) return

    if (isLeftKeyDown) {
        isMarioTouchingFloor && mario.anims.play('mario-walk', true)
        mario.x -=1
        mario.flipX = true //giramos el sprite de mario
    }
    else if (isRightKeyDown) {
        isMarioTouchingFloor && mario.anims.play('mario-walk', true)
        mario.x += 1
        mario.flipX = false //giramos el sprite de mario
    }else if (isMarioTouchingFloor) { //si mario toca el suelo
        mario.anims.play('mario-idle', true)
    }

    if (isUpKeyDown && isMarioTouchingFloor) { //si mario toca el suelo
        mario.setVelocityY(-300) //salto
        mario.anims.play('mario-jump', true)
    }
}