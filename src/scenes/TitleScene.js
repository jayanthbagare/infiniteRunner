class TitleScene extends Phaser.Scene{
	constructor(){
		super({
			key:'TitleScene'
		});
		var character;
		var width;
		var height;
		var animation;
		var spacebarButton;
	}

	preload(){
		this.width = window.innerWidth
		this.height = window.innerHeight;

		this.load.spritesheet('runner','assets/player/player.png',{ frameWidth: 96, frameHeight: 90 });
		this.load.image('startButton','assets/startButton.png');
		this.spacebarButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
	}

	create(){
		let main_title_text = this.add.text(this.width/2,this.height/2,'Infinite Runner',{fontSize:'32px', fill:'#000'});
		main_title_text.setOrigin(0.5);

		let startButton = this.add.image(this.width/2,this.height/2 + 100,'startButton').setInteractive();
		startButton.setScale(0.2);
		startButton.on('pointerdown',function(event){
			//this.scene.start('GameScene');
			this.scene.start('ForestLevel');
		},this);

		this.character = this.add.sprite(this.width/2,this.height/2 - 100,'runner');
		this.character.setScale(1.5,1.5);

		this.anims.create({
            key:'run',
            frames:this.anims.generateFrameNumbers('runner',{start:1,end:9}),
            frameRate:9,
            repeat: -1
		});
		
		//this.cursors = this.input.keyboard.createCursorKeys();
		//this.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

	}

	update(){
		this.character.anims.play("run",true,2);
		if(this.spacebarButton.isDown){
			this.scene.start('ForestLevel');
		}
	}
}

export default TitleScene;