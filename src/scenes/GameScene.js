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
        var distanceTravelled;
        var txtDistanceTravelled;
        var txtCoinsCollected;

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
        this.player = this.physics.add.sprite(window.innerWidth/5, window.innerHeight/2, 'player');
        this.player.setCollideWorldBounds(true);
        this.physics.add.existing(this.player,false);
        this.distanceTravelled = 0;
        this.player.body.setSize(this.player.body.width - 40,this.player.body.height,true);

        //Setup the Enemy
        this.enemy = this.physics.add.sprite(window.innerWidth - 100, window.innerHeight - 190,'enemy');
        this.enemy.setCollideWorldBounds(true);
        this.physics.add.existing(this.enemy,false);
        this.enemy.flipX = true;
        this.enemy.body.setSize(this.enemy.body.width - 40,this.enemy.body.height,true);

        //Add the Score and Distance Travelled text
        this.txtDistanceTravelled = this.add.text(10,10,"Distance Travelled : 0",{fontSize:'18px',fill:'#000'});

        //Setup the Camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0,0,Number.MAX_SAFE_INTEGER,window.innerHeight - 100);

        // Add the Physics.
        this.physics.add.collider(this.player,this.ground);
        this.physics.add.collider(this.enemy,this.ground);
        this.enemyCollider = this.physics.add.collider(this.player,this.enemy,function(){
            this.playerDied = true;
        },null,this);
        
        //Add the animations
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

        //Add the Key Controls 
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    update(){
        var groundSpeed = 6;
        var bgSpeed = 2;
        var playerSpeed = 6;
        var enemySpeed = -180;
        var no_of_enemies = 0;

        if(this.playerDied){
            this.input.keyboard.resetKeys();
            this.endGame();
        }

        if(this.distanceTravelled >= 30 && this.distanceTravelled < 70){
            groundSpeed *= 2;
            bgSpeed *= 2;
            playerSpeed *= 2;
            enemySpeed += enemySpeed;
        }else if(this.distanceTravelled >= 70 && this.distanceTravelled <= 400){
            groundSpeed *= 4;
            bgSpeed *= 4;
            playerSpeed *= 4;
            enemySpeed += 2 * enemySpeed;
        }else if(this.distanceTravelled > 400){
            groundSpeed *= 6;
            bgSpeed *= 6;
            playerSpeed *= 6;
            enemySpeed += 3 * enemySpeed;
        }

        var touchingDown = this.player.body.touching.down;
       
        if(this.enemyExit == false){
            if(this.enemy.body.position.x <= 10){
                this.enemy.disableBody(true,true);
                this.enemy.destroy();
                this.enemyExit = true;
                this.distanceTravelled += 10;
                this.txtDistanceTravelled.setText("Distance Travelled : " + this.distanceTravelled);
            }else{
                this.enemy.setVelocityX(enemySpeed);
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
            this.player.setVelocityX(playerSpeed);
            this.player.anims.play("run",true);
            this.scene.tilePositionX += bgSpeed;
            this.ground.tilePositionX += groundSpeed;
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
        this.enemy = this.physics.add.sprite(Phaser.Math.Between(window.innerWidth/2,window.innerWidth), window.innerHeight - 190,'enemy');
        this.physics.add.existing(this.enemy,false);
        this.enemy.setCollideWorldBounds(true);
        this.physics.add.collider(this.enemy,this.ground);
        this.enemyCollider = this.physics.add.collider(this.player,this.enemy,function(){
            this.playerDied = true;
        },null,this);
        this.enemy.flipX = true;
        this.enemy.body.setSize(this.enemy.body.width - 40,this.enemy.body.height,true);
        this.enemyExit = false;
    }

    spawnCoins(){
        //console.log('Spawning Coins');
    }
}

export default GameScene;
