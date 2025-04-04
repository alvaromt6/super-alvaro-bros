import { createAnimations } from './animations.js'
import { initAudio, playAudio } from './audio.js'
import { checkControls } from './controls.js'
import { initSpritesheets } from './spritesheet.js'

const config ={
    autoFocus: false, //no enfoca el juego al cargarlo
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

    this.load.image(
        'supermushroom',
        'assets/collectibles/super-mushroom.png'
      )

    initSpritesheets(this) //spritesheet.js
    initAudio(this) //audio.js
}

function create() {
    createAnimations(this) //animations.js

    //image(x,y,id-del-asset)
    this.add.image(100, 50, 'cloud1')
        .setOrigin(0, 0)
        .setScale(0.15)

    this.floor = this.physics.add.staticGroup() //grupo de objetos estaticos

    this.floor
        .create(0, config.height - 16, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()

    this.floor
        .create(150, config.height - 16, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()

    this.mario = this.physics.add.sprite(50, 100, 'mario')
        .setOrigin(0,1)
        .setCollideWorldBounds(true) //evita que salga de la pantalla
        .setGravityY(300) //gravedad individual

    this.enemy = this.physics.add.sprite(120, config.height -30 , 'goomba')
        .setOrigin(0,1)
        .setGravityY(300)
        .setVelocityX(-50)
    this.enemy.anims.play('goomba-walk', true) 
    
    this.collectibles = this.physics.add.staticGroup()
    this.collectibles
        .create(150,150, 'coin')
        .anims.play('coin-idle', true)
    this.collectibles
        .create(300,100, 'coin')
        .anims.play('coin-idle', true)


    this.physics.add.overlap(this.mario, this.collectibles,
        collectItem, null, this) 
    

        
    this.physics.world.setBounds(0, 0, 2000, config.height) //limites del mundo
    this.physics.add.collider(this.mario, this.floor) //colision entre mario y el suelo
    this.physics.add.collider(this.enemy, this.floor) //colision entre el enemigo y el suelo
    this.physics.add.collider(this.mario, this.enemy, onHitEnemy, null, this) //colision entre mario y el enemigo
   
    this.cameras.main.setBounds(0, 0, 2000, config.height) //limites de la camara
    this.cameras.main.startFollow(this.mario) //la camara sigue a mario

    this.keys = this.input.keyboard.createCursorKeys()

}

      
function update() {
    const { mario } = this 

    checkControls(this) //controls.js

    // Comprobar si Mario ha muerto
    if (mario.y >= config.height){
        killMario(this)
    }
}


function onHitEnemy(mario, enemy) {
    if (mario.body.touching.down && enemy.body.touching.up){
        enemy.anims.play('goomba-dead', true) 
        enemy.setVelocityX(0)
        mario.setVelocityY(-200)

        playAudio('goomba-stomp', this)
        addToScore(100, enemy, this)

        setTimeout(() => {
            enemy.destroy()
        },300)


    }else{
        killMario(this)
    }
}

function collectItem(mario, item) {
    if (item.texture.key === 'coin') {
        item.destroy()
        playAudio('coin-pickup', this, {volume: 0.2})
        addToScore(100, item, this)
    }else{
        console.log('la seta')
    }
}


function killMario (game){
    const {mario, scene } = game
        
    if (mario.isDead) return

    mario.isDead = true //mario muere si cae al suelo
    mario.anims.play('mario-dead', true)
    mario.setCollideWorldBounds(false) //mario no colisiona con el mundo
        
    playAudio('gameover', game, {volume: 0.2} ) 

    mario.body.checkCollision.none = true
    mario.setVelocityX(0)

    setTimeout(() => {
        mario.setVelocityY(-250)
    }, 100)

    setTimeout(() => {
        scene.restart() //reinicia la escena
    }, 3000) 
}


function addToScore(scoreToAdd, origin, game){
    const scoreText = game.add.text(
        origin.x,
        origin.y,
        scoreToAdd,
        {
            fontFamaily: 'pixel',
            fontSize: config.width / 25
        }
    )

    game.tweens.add({        
        targets: scoreText,
        duration: 500,
        y: scoreText.y - 20,
        onComplete:() => {
            game.tweens.add({            targets: scoreText,
                duration: 100,
                alpha: 0,
                onComplete: () => {
                    scoreText.destroy()
                }
            })
        }
    })
}
    