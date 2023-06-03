// so complex and slow. lol

export default class Animation {
    constructor() {
        this.startValue = 0;
        this.duration = 5000;
        this.delay = 0;

        this.tweens = {}
        this.map = {
            x: {
                base: 'transform',
                property: 'translateX'
            },
            y: {
                base: 'transform',
                property: 'translateY'
            },
            alpha: {
                base: 'opacity',
                property: ''
            }
        }
    }
    /**
     * @param {element} HTMLElement element
     * @param {duration} number duration
     * @param {animation} Object animation
     * @param {offset} number offset 
     */
    to(element, duration, animation, offset) {
        this.startValue = 0;
        this.duration = (duration || this.duration) * 1e3;
        this.delay = (offset || this.delay) * 1e3;

        if(animation instanceof window.Object) for (let key in animation) {
            if (animation.hasOwnProperty(key) && this.map.hasOwnProperty(key)) {
                console.log('this should be call three times, toooooo')
                console.log(element, duration, animation, offset)
                console.log(element, this.map[key], animation[key]);
                this._animate.bind(this)(element, this.duration, this.map[key], animation[key], this.delay)
            }
        }
        else return


        window.addEventListener('visibilitychange', (e) => {
            if (document.visibilityState === "visible") {
                if (this.pausedTime) {
                  // Animation was paused, resume from the paused time
                  this.startTime += (Date.now() - this.pausedTime);
                  this.pausedTime = null;
                  console.log('hiii');
                  requestAnimationFrame(this._animate.bind(this));
                }
            } else {
                if (this.startTime  && !this.pausedTime) {
                  this.pausedTime = Date.now();
                }
            }
        })
    }

    _animate(element, duration, properties, value, delay) {
        function to(element, duration, properties, value, delay, lerp = this.lerp) {
            if (!document.visibilityState === "visible") return
            if(!this.lerp) this.lerp = lerp
            if(!this.element) this.element = element
            if(!this.properties) this.properties = properties
            if(!this.delay) this.delay = delay
            if(!this.duration) this.duration = duration
            if(!this.targetValue) this.targetValue = value
            if(!this.startValue) this.startValue = 0

            if(this.animationState == 'complete') return
            if(!this.startTime) this.startTime = +new Date()
            this.currentTime = Date.now();
            this.elapsedTime = (this.currentTime - this.startTime);
            if(this.delay) {
                this.element.style[this.properties.base] = this.properties.property ? `${this.properties.property}(${this.startValue}${this.properties.base == 'transform' ? '%' : ''})` : this.startValue
                if(this.elapsedTime > this.delay) {
                    if (this.elapsedTime >= this.duration + this.delay) {
                        this.property = this.targetValue;
                        this.animationState = 'complete'

                        
                        this.element.style[this.properties.base] = this.properties.property ? `${this.properties.property}(${this.property}${this.properties.base == 'transform' ? '%' : ''})` : this.property
                      } else {
                        this.total = (this.elapsedTime - this.delay) / this.duration;
                        this.property = this.lerp(this.startValue, this.targetValue, this.total);
                        
                        this.element.style[this.properties.base] = this.properties.property ? `${this.properties.property}(${this.property}${this.properties.base == 'transform' ? '%' : ''})` : this.property
    
                        requestAnimationFrame(to.bind(this));
                      }
                }
                
                requestAnimationFrame(to.bind(this));
            } else {
                if (this.elapsedTime >= this.duration) {
                    this.property = this.targetValue;
                    this.element.style[this.properties.base] = this.properties.property ? `${this.properties.property}(${this.property}${this.properties.base == 'transform' ? '%' : ''})` : this.property
                    this.animationState = 'complete'
                  } else {
                    this.total = this.elapsedTime / this.duration;
                    this.property = this.lerp(this.startValue, this.targetValue, this.total);

                    this.element.style[this.properties.base] = this.properties.property ? `${this.properties.property}(${this.property}${this.properties.base == 'transform' ? '%' : ''})` : this.property

                    requestAnimationFrame(to.bind(this));
                  }
            }
        }
        let pp = new to(element, duration, properties, value, delay, this.lerp)
        console.log(pp);  
    }

    // Linear interpolation function (lerp)
    lerp(a, e, t) {
        return a * (1 - t) + e * t;
    }
}