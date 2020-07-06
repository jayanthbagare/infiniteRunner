class GameScene extends Phaser.Scene{

    constructor(){
        var ground;
        var player;
        var cursors;
        var map;
        var backgroundLayer;
        var groundLayer;
        var keySpace;
        var scene;

        super({
            key:'GameScene'
        });
    }

    preload(){
        this.load.image('scene','assets/backgrounds/scene.png');
        this.load.image('ground','assets/backgrounds/map1.png');
        this.load.spritesheet('player','assets/player/player.png',{frameWidth:96,frameHeight:80});
        this.load.spritesheet('attack','assets/player/attack.png',{frameWidth:96,frameHeight:71});
    }

    create(){
        //Setup the background
        this.scene = this.add.tileSprite(0,170,window.innerWidth,window.innerHeight - 100,"scene").setOrigin(0).setScrollFactor(0);

        //Setup the platform
        this.ground = this.add.tileSprite(0,window.innerHeight - 100,window.innerWidth,100,"ground").setOrigin(0).setScrollFactor(0);
        this.physics.add.existing(this.ground,true);
        
        //Setup the Player
        this.player = this.physics.add.sprite(window.innerWidth/3, window.innerHeight/2, 'player');
        this.player.setCollideWorldBounds(true);
        this.physics.add.existing(this.player,false);

        //Setup the Camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0,0,Number.MAX_SAFE_INTEGER,window.innerHeight - 100);

        // this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.physics.add.collider(this.player,this.ground);


        //Animation to run to the right. Do not add left run animation, this is not the intent of the game
        this.anims.create({
            key:'run',
            frames:this.anims.generateFrameNumbers('player',{start:1,end:9}),
            frameRate:8,
            repeat: -1
        });

        this.anims.create({
            key:'attack',
            frames:this.anims.generateFrameNumbers('attack',{start:0,end:6}),
            frameRate:8,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();

                
    }
    
    update(){
        const touchingDown = this.player.body.touching.down;
       
        //Here is the animation that I wanted for the horizontal movement
        /*
            the way I look at the movement is the character is moving and the
            scrolling of the tileset also is happening. The camera is in alignment with the 
            character moving and not the tileset. I tried the approach of moving the camera to expose the screen when
            the character reaches the end of the screen but with no luck. if somebody has a better idea, on how
            I can achieve that would love to take feedback/code.
        */
        if(this.cursors.right.isDown){
            this.player.setVelocityX(6);
            this.scene.tilePositionX += 2;
            this.ground.tilePositionX += 6;
            this.player.anims.play("run",true);
        }else if(touchingDown){
            this.player.setVelocityX(0);
            this.player.anims.stop();
            if(this.player.anims.currentAnim != null){
                this.player.anims.setCurrentFrame(this.player.anims.currentAnim.frames[3]);
            }
            
        }

        //Here is the jump animation
        //Still the mechanics are not very clean that i'm happy about.
        if(this.cursors.up.isDown && touchingDown){
            this.player.body.velocity.y += -250;
            this.ground.tilePositionX += 6;
            this.player.anims.play("run",true);
        }

        //Add spacebar here to handle the attach animation.
        // if(this.keySpace.isDown){
        //     this.player.anims.play("attack",true);
        // }else if(touchingDown){
        //     this.player.setVelocityX(0);
        //     this.player.anims.stop();
        //     if(this.player.anims.currentAnim != null){
        //         this.player.anims.setCurrentFrame(this.player.anims.currentAnim.frames[0]);
        //     }
        // }
    }
}

export default GameScene;
