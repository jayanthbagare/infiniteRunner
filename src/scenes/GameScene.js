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
        this.physics.add.existing(this.ground,true);
        
        //Setup the Player
        this.player = this.physics.add.sprite(window.innerWidth/3, window.innerHeight/2, 'player');
        this.player.setCollideWorldBounds(true);
        this.physics.add.existing(this.player,false);

        //Setup the Camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0,0,Number.MAX_SAFE_INTEGER,window.innerHeight - 100);


        this.physics.add.collider(this.player,this.ground);

        this.anims.create({
            key:'static',
            // frames:[{key:'player',frame:0}],
            frames:this.anims.generateFrameNumbers('player',{start:0,end:0}),
            frameRate:8
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
        const touchingDown = this.player.body.touching.down;
       
        if(this.cursors.right.isDown){
            this.player.setVelocityX(6);
            this.ground.tilePositionX += 6;
            this.player.anims.play("run",true);
        }else if(touchingDown){
            this.player.setVelocityX(0);
            this.player.anims.stop();
            if(this.player.anims.currentAnim != null){
                this.player.anims.setCurrentFrame(this.player.anims.currentAnim.frames[0]);
            }
            
        }

        if(this.cursors.up.isDown && touchingDown){
            this.player.setVelocityY(-270);
            this.ground.tilePositionX += 6;
            this.player.anims.play("run",true);
        }
    }
}

export default GameScene;
