export default class Canvas {
    constructor({ element, APP }) {
        this.element = element
        this.app = APP

        this.parent = this.element.querySelector('#effect')
        this.pointer = { x: 0.5, y: 0.5 }
    }

    setup() {
        this.sketch.removeElements();
        this.sketch.createCanvas(this.element.clientWidth, this.element.clientHeight, this.sketch.WEBGL);
        this.shader = this.sketch.createShader(this.app.shaders.vertexShader, this.app.shaders.fragmentShader)
        this.sketch.canvas.removeAttribute('class')
        this.sketch.canvas.classList.add('sketch')
        this.sketch.canvas.removeAttribute('id')
        this.sketch.shader(this.shader);

        this.shader.setUniform('u_width', this.sketch.width / 1.5 < 370 ? this.sketch.width / 1.5 : 370);
        this.shader.setUniform('u_coloring', .05);
        this.shader.setUniform('u_speed', .1);
    }

    draw() {
        this.sketch.clear();

        this.pointer.x = this.sketch.mouseX /this. sketch.width;
        this.pointer.y = 1. - this.sketch.mouseY / this.sketch.height


        this.shader.setUniform('u_ratio', this.sketch.width / this.sketch.height);
        this.shader.setUniform('u_point', [this.pointer.x, this.pointer.y])
        this.shader.setUniform('u_time', this.sketch.frameCount * 0.01);
          
        this.sketch.rect(-((this.sketch.width / 2) / 1.5), -((this.sketch.height / 2) / 1.5), 0, 0);
    }

    resize = () => {
        this.sketch.resizeCanvas(this.element.clientWidth, this.element.clientHeight);
        this.shader.setUniform('u_width', this.sketch.width / 1.5 < 370 ? this.sketch.width / 1.5 : 370);
    }

    init(sketch) {
        this.sketch = sketch
        this.sketch.setup = this.setup.bind(this)
        this.sketch.draw = this.draw.bind(this)
        this.sketch.windowResized = this.resize.bind(this)
    }
  
  }