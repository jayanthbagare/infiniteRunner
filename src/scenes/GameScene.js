class GameScene extends Phaser.Scene{

    constructor(){
        var ground;
        super({
            key:'GameScene'
        });
    }

    preload(){
        this.load.image('ground','assets/map1.png');
        
    }

    create(){
        var counter = 0;

        while(counter < window.innerWidth -10 ){
            this.ground = this.add.tileSprite(counter,window.innerHeight,1024,180,'ground');
            counter += 1024;
        }
        
    }

    update(){

    }
}

export default GameScene;