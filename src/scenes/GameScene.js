class GameScene extends Phaser.Scene{

    constructor(){
        var ground;
        var player;
        var enemy;
        var cursors;
        var map;
        var backgroundLayer;
        var groundLayer;
        var keySpace;
        var scene;
        var enemyExit;
        var enemyCollider;
        var playerDied;

        super({
            key:'GameScene'
        });
    }

    preload(){
        this.load.image('scene','./assets/backgrounds/bgScene.png');
        this.load.image('ground','./assets/backgrounds/ground.png');
        this.load.spritesheet('player','./assets/player/player.png',{frameWidth:96,frameHeight:80});
        this.load.spritesheet('enemy','./assets/player/enemySheet.png',{frameWidth:96,frameHeight:80});
        this.load.spritesheet('playerDies','./assets/player/playerDie.png',{frameWidth:96,frameHeight:75});

        this.enemyExit = false;
    }

    create(){
        //Setup the background
        this.scene = this.add.tileSprite(0,0,window.innerWidth,window.innerHeight - 190,"scene").setOrigin(0).setScrollFactor(1).setScale(1.55);
        
        
        //Setup the platform
        this.ground = this.add.tileSprite(0,window.innerHeight - 100,window.innerWidth,100,"ground").setOrigin(0).setScrollFactor(0);
        this.physics.add.existing(this.ground,true);
        
        //Setup the Player
        this.player = this.physics.add.sprite(window.innerWidth/3, window.innerHeight/2, 'player');
        this.player.setCollideWorldBounds(true);
        this.physics.add.existing(this.player,false);

        //Setup the Enemy
        this.enemy = this.physics.add.sprite(window.innerWidth - 100, window.innerHeight - 190,'enemy');
        this.enemy.setCollideWorldBounds(true);
        this.physics.add.existing(this.enemy,false);
        this.enemy.flipX = true;

        //Setup the Camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0,0,Number.MAX_SAFE_INTEGER,window.innerHeight - 100);

        // this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.physics.add.collider(this.player,this.ground);
        this.physics.add.collider(this.enemy,this.ground);
        

        //Animation to run to the right. Do not add left run animation, this is not the intent of the game
        this.anims.create({
            key:'run',
            frames:this.anims.generateFrameNumbers('player',{start:1,end:9}),
            frameRate:8,
            repeat: -1
        });

        this.anims.create({
            key:'enemyRun',
            frames:this.anims.generateFrameNumbers('enemy',{start:1,end:9}),
            frameRate:20,
            repeat: -1
        });

        this.anims.create({
            key:'playerDies',
            frames:this.anims.generateFrameNumbers('playerDies',{start:0,end:7}),
            frameRate:20,
            repeat:-1
        });

        this.enemyCollider = this.physics.add.collider(this.player,this.enemy,function(){
            this.playerDied = true;
        },null,this);

        this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    update(){
        if(this.playerDied){
            this.input.keyboard.resetKeys();
            this.endGame();
        }

        var touchingDown = this.player.body.touching.down;

        console.log(touchingDown);
        
        if(this.enemyExit == false){
            if(this.enemy.body.position.x <= 10){
                this.enemy.disableBody(true,true);
                this.enemy.destroy();
                this.enemyExit = true;
                this.enemy = null;
            }else{
                this.enemy.setVelocityX(-180);
                this.enemy.anims.play("enemyRun",true);
                this.enemyExit = false;
            }
        }else{
            this.spawnEnemy();
        }
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
            this.player.anims.play("run",true);
            this.scene.tilePositionX += 2;
            this.ground.tilePositionX += 6;
        }else if(touchingDown){
            this.player.setVelocityX(0);
            this.player.anims.stop();
            if(this.player.anims.currentAnim != null){
                this.player.anims.setCurrentFrame(this.player.anims.currentAnim.frames[3]);
            }
            
        }
        
        if(Phaser.Input.Keyboard.JustDown(this.cursors.up) && touchingDown){
            this.player.body.velocity.y += -450;
        }

        this.spawnCoins();
    }

    endGame(){
        this.player.anims.stop();
        this.player.anims.play("playerDies");
        this.player.active = false;
        this.enemyCollider.active = false;
    }

    spawnEnemy(){
        this.enemy = this.physics.add.sprite(Phaser.Math.Between(window.innerWidth/2 + 100,window.innerWidth), window.innerHeight - 190,'enemy');
        this.physics.add.existing(this.enemy,false);
        this.enemy.setCollideWorldBounds(true);
        this.physics.add.collider(this.enemy,this.ground);
        this.enemyCollider = this.physics.add.collider(this.player,this.enemy,function(){
            this.playerDied = true;
        },null,this);
        this.enemy.flipX = true;
        this.enemyExit = false;
    }

    spawnCoins(){
        console.log('Spawning Coins');
    }
}

export default GameScene;
