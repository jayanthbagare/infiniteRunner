class TitleScene extends Phaser.Scene{
	constructor(){
		super({
			key:'TitleScene'
		});
		var player;
		var width;
		var height;
	}

	preload(){
		this.width = window.innerWidth
		this.height = window.innerHeight;

		this.load.spritesheet('runner','assets/player/player.png',{ frameWidth: 96, frameHeight: 90 });
		this.load.image('startButton','assets/startButton.png');

		//this.load.sceneFile('GameScene','GameScene.js');	
	}

	create(){
		let main_title_text = this.add.text(this.width/2,this.height/2,'Infinite Runner',{fontSize:'32px', fill:'#000'});
		main_title_text.setOrigin(0.5);

		let startButton = this.add.image(this.width/2,this.height/2 + 100,'startButton').setInteractive();
		startButton.setScale(0.2);
		startButton.on("pointerdown",function(event){
			this.scene.start('GameScene');
		},this);

		this.player = this.add.sprite(this.width/2,this.height/2 - 170,'runner');
		this.player.setScale(1.5,1.5);

		// this.anims.create({
        //     key:'run',
        //     frames:this.anims.generateFrameNumbers('runner',{start:1,end:9}),
        //     frameRate:9,
        //     repeat: -1
		// });
		this.player.animations.add()

	}

	update(){
		
		this.player.anims.play("run");

	}

	gotoGame(){
		console.log('Going to Game');
		
	}
}

export default TitleScene;