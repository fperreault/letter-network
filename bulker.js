const Letter = require('./Letter');
const { createCanvas } = require('canvas');
const fs = require('fs');

/**
 * Bulker stack to create multiple png from random/argv letter 
 */
class Bulker extends Letter {

    constructor() {
        super();
    }

    /**
     * create canvas and temporary canvas for flat letter
     */
    initCanvas() {
        this.canvas = createCanvas(1700, 800);
        this.context = this.canvas.getContext('2d');
        this.tempCanvas = createCanvas(1700, 800);
        this.tempContext = this.tempCanvas.getContext('2d');
    }

    /**
     * render
     */
    render() {
        super.render();

        // set FS to save file from canvas render
        const file = fs.createWriteStream(__dirname + '/renders/' + this.letter + '.png');

        // save PNG file
        const stream = this.canvas.pngStream();
        stream.pipe(file);
    }

    /**
     * star bulk generator from random chars
     */
    start(maxfile) {

        const count = maxfile;
        let iteration = 0;
        
        let time = setInterval(() =>{
            iteration++;
            if(iteration >= count) clearInterval(time);
            else {
                this.set(
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                    .charAt( Math.round(
                        Math.random() * 62
                    ))
                )
                this.render();
            }
        }, 20);
    }

}

const args = process.argv.slice(2);
const bulker = new Bulker();
if(args[0]){
    bulker.set(args[0]);
    bulker.render();
} else bulker.start(20);
