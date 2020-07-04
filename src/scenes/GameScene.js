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
        //Setup the platform
        this.ground = this.add.tileSprite(0,window.innerHeight - 100,window.innerWidth,109,"ground").setOrigin(0).setScrollFactor(0);
        this.physics.add.existing(this.ground);
        
        this.ground.body.immovable = true;
        this.ground.body.collideWorldBounds = true;
        this.ground.body.allowGravity = false;

        //Setup the Player
        this.player = this.physics.add.sprite(0, window.innerHeight/2, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.body.checkCollision.right = false

        //Setup the Camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0,0,Number.MAX_SAFE_INTEGER,window.innerHeight - 100);


        this.physics.add.collider(this.player,this.ground);

        this.anims.create({
            key:'static',
            frames:[{key:'player',frame:0}],
            frameRate:9
        });

        this.anims.create({
            key:'run',
            frames:this.anims.generateFrameNumbers('player',{start:1,end:9}),
            frameRate:8,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();

                
    }
    
    update(){
       if(this.cursors.right.isDown){
            this.player.setVelocityX(6);
            this.ground.tilePositionX += 6;
            this.player.anims.play("run",true);
        }
        else{
            this.player.setVelocityX(0);
            this.player.anims.play('static');
        }

           
    }
}

export default GameScene;