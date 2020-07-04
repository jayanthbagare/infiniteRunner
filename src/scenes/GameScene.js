class GameScene extends Phaser.Scene{

    constructor(){
        var ground;
        var player;
        var cursors;
        var map;
        var backgroundLayer;
        var groundLayer;

        super({
            key:'GameScene'
        });
    }

    preload(){
        this.load.image('ground','assets/ground.png');
        this.load.spritesheet('player','assets/player/player.png',{frameWidth:96,frameHeight:80});
    }

    create(){

        var counter = 0;
        this.add.tileSprite(counter,window.innerHeight - 100,window.innerWidth,109,"ground").setOrigin(0);
        
        this.player = this.physics.add.sprite(counter, window.innerHeight/2, 'player');
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player,this.ground);

        this.anims.create({
            key:'static',
            frames:[{key:'player',frame:0}],
            frameRate:20
        });

        this.anims.create({
            key:'run',
            frames:this.anims.generateFrameNumbers('player',{start:1,end:9}),
            frameRate:9,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();

                
    }
    
    update(){
            if(this.cursors.right.isDown){
                this.player.setVelocityX(120);
                this.player.anims.play("run",true);
            }else{
                this.player.setVelocityX(0);
                this.player.anims.play('static');
            }
           
    }
}

export default GameScene;