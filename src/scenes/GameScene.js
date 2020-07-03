class GameScene extends Phaser.Scene{

    constructor(){
        var ground;
        var player;
        var cursors;

        super({
            key:'GameScene'
        });
    }

    preload(){
        this.load.image('ground','assets/map1.png');
        this.load.spritesheet('player','assets/player/player.png',{frameWidth:96,frameHeight:90});
    }

    create(){

        var counter = 0;

        this.ground = this.physics.add.staticGroup();
        //this.ground = this.add.tileSprite(counter,window.innerHeight,window.innerWidth,180,'ground');
        this.ground.create(0,window.innerHeight - 10,'ground');
        
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setCollideWorldBounds(true);
        
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

        this.physics.add.collider(this.player,this.ground);        
    }
    
    update(){
            if(this.cursors.right.isDown){
                this.player.setVelocityX(90);
                this.player.anims.play("run",true,2);
            }else{
                this.player.setVelocityX(0);
                this.player.anims.play('static');
            }
           
    }
}

export default GameScene;