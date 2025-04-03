import{ createAnimations } from './animations.js' //importamos las animaciones de mario

const config ={
    type: Phaser.AUTO, //webgl, canvas
    width: 256,
    height: 244,
    backgroundColor: '#0492b8',
    parent: 'game', //id del div donde se va a renderizar el juego
    physics: { //configuracion de la fisica del juego
        default: 'arcade', 
        arcade: {
            gravity: { y: 300},
            debug: false //debug = true para ver los limites de los objetos
        }
    },

    scene: {
        preload, //Se ejecuta para precargar los recursos asset
        create, // se ejecuta una vez que se han precargado los recursos
        update // se ejecuta en cada frame
    }
}   

new Phaser.Game(config)

function preload() {
    this.load.image(
        'cloud1',
        'assets/scenery/overworld/cloud1.png'
    )

    this.load.image(
        'floorbricks',
        'assets/scenery/overworld/floorbricks.png'
    )

    this.load.spritesheet(
        'mario', //id del asset
        'assets/entities/mario.png',
        { frameWidth: 18, frameHeight: 16 } //tamaño de cada sprite
    )

    this.load.audio(
        'music',
        'assets/sound/music/overworld/theme.mp3' //cargamos el audio de la musica de fondo
    )

    this.load.audio(
        'gameover',
        'assets/sound/music/gameover.mp3') //cargamos el audio de game over

    this.load.audio(
        'jump',
        'assets/sound/effects/jump.mp3') //cargamos el audio de salto
}

function create() {
    //image(x,y,id-del-asset)
    this.add.image(100,50, 'cloud1')
        .setScale(0.15)
        .setOrigin(0,0)

    this.floor = this.physics.add.staticGroup() //grupo de objetos estaticos

    this.floor
        .create(0, config.height - 16, 'floorbricks')
        .setOrigin(0,0.5)
        .refreshBody() //refresca el cuerpo del objeto para que se ajuste a la imagen

    this.floor
        .create(200, config.height - 16, 'floorbricks')
        .setOrigin(0,0.5)
        .refreshBody()

    this.mario = this.physics.add.sprite(50, 100, 'mario')
        .setOrigin(0,1)
        .setCollideWorldBounds(true) //evita que el sprite salga de la pantalla
        .setGravityY(300) //gravedad del sprite

        
    this.physics.world.setBounds(0, 0, 2000, config.height) //limites del mundo
    
    this.physics.add.collider(this.mario, this.floor) //colision entre mario y el suelo

    this.cameras.main.setBounds(0, 0, 2000, config.height) //limites de la camara
    this.cameras.main.startFollow(this.mario) //la camara sigue a mario

    createAnimations(this) //creamos las animaciones de mario

    this.keys = this.input.keyboard.createCursorKeys()
        
}
function update() {

    const {keys, mario } = this
    const isMarioTouchingFloor = mario.body.touching.down //si mario toca el suelo
    const isLeftKeyDown = keys.left.isDown //si la tecla izquierda esta presionada
    const isRightKeyDown = keys.right.isDown //si la tecla derecha esta presionada
    const isUpKeyDown = keys.up.isDown //si la tecla arriba esta presionada

    if(this.mario.isDead) return

    if (isLeftKeyDown) {
        isMarioTouchingFloor && mario.anims.play('mario-walk', true)
        mario.x -=2
        mario.flipX = true //giramos el sprite de mario
    }
    else if (isRightKeyDown) {
        isMarioTouchingFloor && mario.anims.play('mario-walk', true)
        mario.x += 2
        mario.flipX = false //giramos el sprite de mario
    }else if (isMarioTouchingFloor) { //si mario toca el suelo
        mario.anims.play('mario-idle', true)
    }

    if (isUpKeyDown && isMarioTouchingFloor) { //si mario toca el suelo
        mario.setVelocityY(-300) //salto
        mario.anims.play('mario-jump', true)
        this.sound.add('jump', {volume: 0.01 }).play() //reproducimos el sonido de salto

    }

    if (mario.y >= config.height){
        mario.isDead = true //mario muere si cae al suelo
        mario.anims.play('mario-dead', true)
        mario.setCollideWorldBounds(false) //mario no colisiona con el mundo
        this.sound.add('gameover', { volume: 0.1 }).play() //reproducimos el sonido de game over;

        setTimeout(() => {
            gameOverSound.stop(); // detenemos el sonido después de un tiempo
        }, 3000); // el sonido se detendrá después de 1.5 segundos

        setTimeout(() => {
            mario.setVelocityY(-350)
        }, 100)


        setTimeout(() => {
            this.scene.restart() //reinicia la escena
        }, 3000) //reinicia la escena despues de 2 segundos
    }
}