import TitleScene from '/src/scenes/TitleScene.js';
import GameScene from '/src/scenes/GameScene.js';
import ForestLevel from '/src/scenes/ForestLevel.js'

const config = {
	type:Phaser.AUTO,
	backgroundColor:'0xffffff',
	width:window.innerWidth,
	height:window.innerHeight,
	pixelArt: false,
	physics:{
		default:'arcade',
		arcade:{
			debug:false,
			gravity:{y:400}
		}
	},
	dom:{
		createContainer: true
	},
	scene:[TitleScene,GameScene,ForestLevel]
};

const game = new Phaser.Game(config);