/**
 * letter 
 */
class Letter {
    
    /**
     * constructor
     * @param {string} - Letter string value
     */
    constructor(letter) {
        // grid setup
        this.grid = {x:10, y:10};
        this.offset = 5;

        this.initCanvas();
        if(letter) this.set(letter);
    }

    /**
     * create canvas and temporary canvas for flat letter
     */
    initCanvas(){
        this.canvas = document.getElementsByTagName('canvas')[0];
        this.context = this.canvas.getContext('2d');
        this.tempCanvas = document.createElement('canvas');
        this.tempContext = this.tempCanvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.tempCanvas.width = this.canvas.width;
        this.tempCanvas.height = this.canvas.height;
    }

    /**
     * set letter
     * @param {string} - Letter string value
     */
    set(letter) {
        
        // base
        this.letter = letter;
        this.pixels = [];
        this.color = Utils.getRandomHex();
        this.stepOffset = 0;

        
        // clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // create image letter
        this.tempContext.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        this.tempContext.font = '900 490px helvetica';
        this.tempContext.textBaseline = 'middle';
        this.tempContext.textAlign = "center";
        this.tempContext.fillText(this.letter, this.canvas.width/2 - 30, this.canvas.height/2);
        

        // get letter image data
        const data = this.tempContext.getImageData(0, 0, this.tempCanvas.width, this.tempCanvas.height).data;
        const buffer = new Uint32Array(data.buffer);
        
        
        const stretchPoint = Utils.getRandomNumber(this.canvas.width / 2 - 100 , this.canvas.width / 2 + 100);
        let isStretched = false;

        // parse data according to grid X/Y
        for (let x = 0; x <= this.tempCanvas.width; x += this.grid.x) {

            if(x >= stretchPoint && !isStretched) {
                
                //clone row
                let clonedPixels = [];
                for (let y = 0; y <= this.tempCanvas.height; y += this.grid.y) {

                    if (buffer[y * this.canvas.width + x]) {
                        let pixel = new Pixel(
                            x - this.offset / 1 + Math.random() * this.offset, 
                            y - this.offset / 1 + Math.random() * this.offset
                        )
                        this.pixels.push(pixel);
                        clonedPixels.push(pixel);
                    }

                }
                
                // stretch
                const stepMax = Utils.getRandomNumber(0, 40);
                const expo = [-200,-100, -10, -5, 0, 5, 10, 40][Math.round(Math.random()*8)]
                
                for (let step = 0; step <= stepMax; step++) {
                    for (let i in clonedPixels) {
                        this.stepOffset = this.grid.x * step;
                        let pixel = clonedPixels[i];
                        this.pixels.push(new Pixel(
                            (pixel.x+this.stepOffset) - this.offset / 1 + Math.random() * this.offset, 
                            (pixel.y - Utils.getRandomNumber(0, 20) * expo) - this.offset / 1 + Math.random() * this.offset
                        ));
                    }
                }
                
                isStretched = true;

            } else {

                for (let y = 0; y <= this.tempCanvas.height; y += this.grid.y) {

                    // create pixel according to buffer data
                    if (buffer[y * this.canvas.width + x]) {
                        this.pixels.push(new Pixel(
                            (x + this.stepOffset) - this.offset / 1 + Math.random() * this.offset, 
                            y - this.offset / 1 + Math.random() * this.offset
                        ));
                    }

                }

            }  

        }
    }


    /**
     * render
     */
    render() {

        // clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // parse pixels
        for(let i in this.pixels) {

            const pixel = this.pixels[i];

            // proximity detection LINER
            for(let j in this.pixels) {

                const otherPixel = this.pixels[j];
                const dx = otherPixel.x - pixel.x;
                const dy = otherPixel.y - pixel.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // draw line to proximited pixel
                if (distance <= Utils.getRandomNumber(30, 100)) {
                    new Liner(this.context, pixel, otherPixel, this.color);
                }
            }

            // draw pixel
            this.context.fillStyle = '#000000';
            this.context.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
            this.context.fill();
        }

    }
}



/**
 * pixel square
 */
class Pixel {

    /**
     * constructor
     * @param {x} - x value
     * @param {y} - y value
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Utils.getRandomNumber(0.05, 1);
    }

}


/**
 * liner under pixels
 */
class Liner {

    /**
     * constructor
     * @param {Context} - ctx
     * @param {Pixel} - from pixels
     * @param {Pixel} - to pixels
     * @param {string} - liner color
     */
    constructor(ctx, from, to, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = Utils.getRandomNumber(0.001, 0.15);
        ctx.beginPath();
        ctx.moveTo(to.x, to.y);
        ctx.lineTo(from.x, from.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

}


/**
 * utils statics
 */
class Utils {

    /**
     * get range number
     * @param {min} - Min value
     * @param {max} - Max value
     * @return {number}
     */
    static getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * get random hexadecimal 
     * @return {string}
     */
    static getRandomHex(){
        return '#' + ((1<<24) * Math.random()|0).toString(16);
    }

}



// module export for node
try{module.exports = Letter;
} catch(e){}