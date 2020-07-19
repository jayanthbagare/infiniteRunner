class GameScene extends Phaser.Scene{

    constructor(){
        var ground;
        var player;
        var enemy;
        var coins;
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
        var scoreCoinsCollected;

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
        this.load.spritesheet('coins','assets/rewards/coins.png',{frameWidth:32,frameHeight:32});
    }

    create(){
        //Setup the background
        this.scene = this.add.tileSprite(0,0,window.innerWidth,window.innerHeight - 190,"scene").setOrigin(0).setScrollFactor(0.25).setScale(1.55);
        
        
        //Setup the platform
        this.ground = this.add.tileSprite(0,window.innerHeight - 100,window.innerWidth,100,"ground").setOrigin(0).setScrollFactor(1);
        this.physics.add.existing(this.ground,true);
        
        //Setup the Player
        this.player = this.physics.add.sprite(window.innerWidth/5, window.innerHeight/2, 'player');
        this.player.setCollideWorldBounds(true);
        this.physics.add.existing(this.player,false);
        this.distanceTravelled = 0;
        this.playerDied = false;
        this.player.body.setSize(this.player.body.width - 40,this.player.body.height,true);

        //Setup the Enemy
        this.enemy = this.physics.add.sprite(window.innerWidth - 100, window.innerHeight - 190,'enemy');
        this.enemy.setCollideWorldBounds(true);
        this.physics.add.existing(this.enemy,false);
        this.enemy.flipX = true;
        this.enemy.body.setSize(this.enemy.body.width - 40,this.enemy.body.height,true);
        this.enemyExit = false;


        //Add the Score and Distance Travelled text
        this.txtDistanceTravelled = this.add.text(10,10,"Distance Travelled : 0",{fontSize:'18px',fill:'#000'});
        this.txtCoinsCollected = this.add.text(10,30,"Coins Collected : 0",{fontSize:'18px',fill:'#000'});
        this.scoreCoinsCollected = 0;

        //Setup the Camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0,0,Number.MAX_SAFE_INTEGER,window.innerHeight - 100,true);

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

        this.anims.create({
            key:'coinTurn',
            frames:this.anims.generateFrameNumbers('coins',{start:0,end:7}),
            frameRate:8,
            repeat:-1
        });

        //Add the Key Controls 
        this.cursors = this.input.keyboard.createCursorKeys();

        //Spawn the coins for the very first time
        this.spawnCoins();
    }
    
    update(){
        var groundSpeed = 8;
        var bgSpeed = 2;
        var playerSpeed = 180;
        var enemySpeed = -180;
        var no_of_enemies = 0;

        if(this.playerDied){
            this.input.keyboard.resetKeys();
            this.endGame();
        }

        this.coins.children.iterate(function(child){
            if(child.body.position.x < 0){
                child.disableBody(true,true);
            }
        },this);


        
        if(this.coins.countActive() == 0){
            this.spawnCoins();
        }

        if(this.distanceTravelled >= 30 && this.distanceTravelled < 70){
            groundSpeed *= 1.5;
            bgSpeed *= 1.5;
            playerSpeed *= 1.5;
            enemySpeed *= 1.5;
        }else if(this.distanceTravelled >= 70 && this.distanceTravelled <= 400){
            groundSpeed *= 1.8;
            bgSpeed *= 1.8;
            playerSpeed *= 1.8;
            enemySpeed *= 1.8;
        }else if(this.distanceTravelled > 400){
            groundSpeed *= 2;
            bgSpeed *= 2;
            playerSpeed *= 2;
            enemySpeed *= 2;
        }

        var touchingDown = this.player.body.touching.down;
       
        if(this.enemyExit == false){
            if(this.enemy.body.position.x <= 10 && this.playerDied != true){
                this.enemy.disableBody(true,true);
                this.enemy.destroy();
                this.enemyExit = true;
                this.distanceTravelled += 10;
                this.txtDistanceTravelled.setText("Distance Travelled : " + this.distanceTravelled);
            }else if(this.playerDied != true){
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
            this.cameras.main.scrollX += groundSpeed;

            this.coins.children.iterate(function(child){
                child.body.position.x -= bgSpeed;
            },this);
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
        var randomHeight = Phaser.Math.Between(200,400);
        var randomStepX = Phaser.Math.Between(100,250);
        var randomStepY = Phaser.Math.Between(-20,40);

        this.coins = this.physics.add.group({
            key:'coin',
            repeat:2,
            setXY:{x:window.innerWidth - randomHeight,y:window.innerHeight - randomHeight,stepX:randomStepX,stepY:randomStepY}
        });
        this.coins.scaleXY(0.25);
        this.coins.children.iterate(function (child){
            child.body.isCircle = true;
            child.body.setAllowGravity(false);
        });
        this.coins.playAnimation("coinTurn","0");
        this.physics.add.overlap(this.player,this.coins,this.collectCoins,null,this);
    }

    collectCoins(player,coin){
        if(this.playerDied == false){
            coin.disableBody(true,true);
            this.scoreCoinsCollected += 1;
            this.txtCoinsCollected.setText("Coins Collected : " + this.scoreCoinsCollected);
        }
    }
}

export default GameScene;
