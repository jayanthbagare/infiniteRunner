class ForestLevel extends Phaser.Scene{
    constructor(){

        var sky;
        var mountains;
        var forest;
        var ground;
        var player;
        var enemy;
        var coins;
        var cursors;
        var jumpTimer = 0;
        var playerDied;
        var enemyExit;
        var distanceTravelled;
        var txtDistanceTravelled;
        var scoreCoinsCollected;
        var gravity;

        super({
            key:'ForestLevel'
        });

        
    }

    init(){
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enemyExit = false;
        this.playerDied = false;
        this.distanceTravelled = 0;
        this.scoreCoinsCollected = 0;
        this.gravity = this.physics.world.gravity.y;
    }

    preload(){
        this.load.image('sky','/assets/backgrounds/sky.png');
        this.load.image('mountains','/assets/backgrounds/mountains.png');
        this.load.image('forest','/assets/backgrounds/forest.png');
        this.load.image('ground','/assets/backgrounds/ground.png');
        

        this.load.spritesheet('player','./assets/player/player.png',{frameWidth:96,frameHeight:80});
        this.load.spritesheet('playerIdle','./assets/player/idle.png',{frameWidth:96,frameHeight:80});
        this.load.spritesheet('enemy','./assets/player/enemySheet.png',{frameWidth:96,frameHeight:80});
        this.load.spritesheet('playerDies','./assets/player/playerDie.png',{frameWidth:96,frameHeight:75});
        this.load.spritesheet('coins','./assets/rewards/coins.png',{frameWidth:32,frameHeight:32});
    }

    create(){
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.tileSprite(0,0,width,height,"sky").setOrigin(0,0).setScrollFactor(0);

        this.mountains = this.add.tileSprite(0,0,width,height,"mountains").setOrigin(0,0);
        
        this.forest = this.add.tileSprite(0,0,width,height,"forest").setOrigin(0,0);

        this.ground = this.add.tileSprite(0,height - 50,width,80,"ground").setOrigin(0,0);
        this.physics.add.existing(this.ground,true);

        //Setup the Player
        this.player = this.physics.add.sprite(width/3, height/2, 'player');
        this.player.setCollideWorldBounds(true);
        this.physics.add.existing(this.player,false);
        this.player.body.setSize(this.player.body.width - 40,this.player.body.height,true);

        //Setup the Enemy
        this.enemy = this.physics.add.sprite(width - 100, height - 140,'enemy');
        this.enemy.setCollideWorldBounds(true);
        this.physics.add.existing(this.enemy,false);
        this.enemy.flipX = true;
        this.enemy.body.setSize(this.enemy.body.width - 40,this.enemy.body.height,true);




        //Add the Score and Distance Travelled text
        this.txtDistanceTravelled = this.add.text(10,10,"Distance Travelled : 0",{fontSize:'18px',fill:'#000'});
        this.txtCoinsCollected = this.add.text(10,30,"Coins Collected : 0",{fontSize:'18px',fill:'#000'});
        this.scoreCoinsCollected = 0;

        //Add the animations
        //Animation to run to the right.
        this.anims.create({
            key:'run',
            frames:this.anims.generateFrameNumbers('player',{start:0,end:9}),
            frameRate:20,
            repeat: -1
        });

        this.anims.create({
            key:'idle',
            frames:this.anims.generateFrameNumbers('playerIdle',{start:0,end:7}),
            frameRate:20,
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

         //Setup the Camera
        this.cameras.main.startFollow(this.player,true);
        this.cameras.main.setBounds(0,0,Number.MAX_SAFE_INTEGER,height - 140,true);

         this.physics.add.collider(this.ground,this.player);
         this.physics.add.collider(this.enemy,this.ground);
         this.enemyCollider = this.physics.add.collider(this.player,this.enemy,function(){
             this.playerDied = true;
         },null,this);

        //Setup Rewards
        this.spawnCoins()
    }

    update(){

        var mountainSpeed = 2.5;
        var forestSpeed = 5;
        var groundSpeed = 7.5;
        var enemySpeed = 200;
        var jumpHeight = 250;
        var playerSpeed = 200;
        var uom;
        var factor = 0;
        var jumpCount = 0;
        

        if(this.playerDied){
            this.input.keyboard.resetKeys();
            this.endGame();
        }

        if(this.distanceTravelled > 15 && this.distanceTravelled < 30){
            factor = 1.2;
        }else if(this.distanceTravelled > 31 && this.distanceTravelled < 100){
            factor = 1.8; 
        }else if(this.distanceTravelled > 100){
            factor = 4; 
        }else{
            factor = 1
        }

        //Remove Coins if they are no longer available & add if none are there
        this.coins.children.iterate(function(child){
            if(child.body.position.x < 0){
                child.disableBody(true,true);
            }
        },this);

        if(this.coins.countActive() == 0){
            this.spawnCoins();
        }

        if(this.enemyExit == false){
            if(this.enemy.body.position.x <= 10 && this.playerDied != true){
                this.enemy.disableBody(true,true);
                this.enemy.destroy();
                this.enemyExit = true;          
            }
            else if(this.playerDied != true){
                this.enemy.setVelocityX(-enemySpeed * factor);
                this.enemy.anims.play("enemyRun",true);
                this.enemyExit = false;
            }
        }else{
            this.spawnEnemy();
        }

        if(this.cursors.right.isDown)
        {
            this.mountains.tilePositionX += mountainSpeed * factor;
            this.forest.tilePositionX += forestSpeed * factor;
            this.ground.tilePositionX += groundSpeed * factor;
            
            this.player.flipX = false;
            this.player.anims.play("run",true);

            this.coins.children.iterate(function(child){
                child.body.position.x -= groundSpeed * factor;
            },this);

            this.distanceTravelled += groundSpeed/1000
            if(this.distanceTravelled > 8000){
                uom = " Yojanas";
            }else{
                uom = " Dandas"
            }
            this.txtDistanceTravelled.setText("Distance Travelled : " + Math.ceil(this.distanceTravelled) + uom);
         }
        else{
            this.player.anims.stop();
            this.player.setVelocityX(0);
            //this.player.anims.setCurrentFrame(this.player.anims.currentAnim.frames[2]);
        }


        if(this.jumpButton.isDown && this.player.body.touching.down){
            this.jumpTimer = 1;
            this.player.setVelocityY(-jumpHeight);
            this.jumpCount++;
        }else if(this.jumpButton.isDown && (this.jumpTimer != 0)){
            if(this.jumpTimer > 50){

                this.player.setGravityY(this.gravity + jumpHeight);
                this.jumpTimer = 0;
            }else{
                if(this.jumpCount >3){
                    this.jumpCount++;
                }
                this.jumpTimer++;
                this.player.setVelocityY(-jumpHeight);
            }
        } else if(this.jumpTimer != 0){
            this.jumpTimer = 0;
            this.jumpCount = 0;
        }

    }

    spawnEnemy(){
        this.enemy = this.physics.add.sprite(window.innerWidth, window.innerHeight - 140,'enemy');
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

    endGame(){
        this.player.anims.stop();
        this.player.anims.play("playerDies");
        this.enemy.anims.stop();
        this.enemy.active = false;
        this.player.active = false;
        this.enemyCollider.active = false;
    }

    spawnCoins(){
        var randomHeight = Phaser.Math.Between(150,300);
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

export default ForestLevel;