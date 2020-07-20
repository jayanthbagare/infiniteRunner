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
        var txtDistanceTravelled;
        var scoreCoinsCollected;
        var gravity;

        super({
            key:'ForestLevel'
        });

        
    }

    init(){
        this.cursors = this.input.keyboard.createCursorKeys();
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

    }

    create(){
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.tileSprite(0,0,width,height,"sky").setOrigin(0,0).setScrollFactor(0);

        this.mountains = this.add.tileSprite(0,0,width,height,"mountains").setOrigin(0,0);
        
        this.forest = this.add.tileSprite(0,0,width,height,"forest").setOrigin(0,0);

        this.ground = this.add.tileSprite(0,height - 70,width,80,"ground").setOrigin(0,0);
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
            frameRate:8,
            repeat: -1
        });

        this.anims.create({
            key:'idle',
            frames:this.anims.generateFrameNumbers('playerIdle',{start:0,end:7}),
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

         //Setup the Camera
         this.cameras.main.startFollow(this.player);
         this.cameras.main.setBounds(0,0,Number.MAX_SAFE_INTEGER,height - 140,true);

         this.physics.add.collider(this.ground,this.player);
         this.physics.add.collider(this.enemy,this.ground);
         this.enemyCollider = this.physics.add.collider(this.player,this.enemy,function(){
             this.playerDied = true;
         },null,this);
    }

    update(){

        var mountainSpeed = 2.5;
        var forestSpeed = 5;
        var groundSpeed = 7.5;
        var enemySpeed = 200;
        var jumpHeight = 250;
        

        if(this.playerDied){
            this.input.keyboard.resetKeys();
            this.endGame();
        }

        if(this.enemyExit == false){
            if(this.enemy.body.position.x <= 10 && this.playerDied != true){
                this.enemy.disableBody(true,true);
                this.enemy.destroy();
                this.enemyExit = true;          
            }else if(this.playerDied != true){
                this.enemy.setVelocityX(-enemySpeed);
                this.enemy.anims.play("enemyRun",true);
                this.enemyExit = false;
            }
        }else{
            this.spawnEnemy();
        }

        if(this.cursors.right.isDown){
            this.mountains.tilePositionX += mountainSpeed;
            this.forest.tilePositionX += forestSpeed;
            this.ground.tilePositionX += groundSpeed;
            
            this.player.flipX = false;
            this.player.anims.play("run",true);

            this.distanceTravelled += groundSpeed/1000

            this.txtDistanceTravelled.setText("Distance Travelled : " + Math.ceil(this.distanceTravelled));
         }
        else{
            this.player.anims.stop();
            //this.player.anims.setCurrentFrame(this.player.anims.currentAnim.frames[0]);
        }
        
        
        if(this.cursors.up.isDown && this.player.body.touching.down){
            this.jumpTimer = 1;
            this.player.setVelocityY(-jumpHeight);
        }else if(this.cursors.up.isDown && (this.jumpTimer != 0)){
            if(this.jumpTimer > 50){
                this.player.setGravityY(this.gravity + 100);
                this.jumpTimer = 0;
            }else{
                this.jumpTimer++;
                this.player.setVelocityY(-jumpHeight);
            }
        } else if(this.jumpTimer != 0){
            this.jumpTimer = 0;
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
        this.player.active = false;
        this.enemyCollider.active = false;
    }
}

export default ForestLevel;