import '../css/base.scss'

import Canvas from '../components/classes/canvas'
import AsyncLoader from '../components/classes/AsyncLoader'
import Animation from '../components/classes/Animation'

import p5 from 'p5';

let APP = {}
APP.__root = document.querySelector('._container')
APP.preloader = {
    element: APP.__root.querySelector('.__preloader')
}
APP.shaders = {}
APP.animate = new Animation({ paused: true, onComplete: () => APP.init() })

APP.preloader.manager = new AsyncLoader.manager()
APP.preloader.loader = new AsyncLoader.loader(APP.preloader.manager)

APP.preloader.loader.load('./assets/static/shaders/vertexShader.vert', function (text) {
    APP.shaders.vertexShader = text

})
APP.preloader.loader.load('./assets/static/shaders/fragmentShader.frag', function (text) {
    APP.shaders.fragmentShader = text
})
APP.preloader.manager.onProgress = function ( item, loaded, total ) {
    APP.preloader.update(loaded/total)
};

APP.preloader.manager.onLoad = () => {
    console.log('loaded')
    APP.preloader.hide()
}

APP.preloader.update = (value) => {
    value = Math.round(value * 100 / 100)
    APP.preloader.element.querySelector('.preloader_num').innerText = `${value * 100}%`
}


APP.animation = () => {
    APP.animate.fromTo('.preloader_text', 1.5, {
        autoAlpha: 0
    }, {
        autoAlpha: 1
    })
    APP.animate.to('.__preloader', 1.5, {
        autoAlpha: 0
    }, '+=2.2')
    APP.animate.to('.full_screen', .5, {
        scaleX: '4'
    }, '-=1.4')
    APP.animate.to('.preloader_num', .5, {
        alpha: 0
    }, '-=.5')
    APP.animate.to('.full_screen', .5, {
        scaleX: '1'
    }, '+=.5')
    APP.animate.fromTo('.separate_line', .5, {
        scaleY: '0'
    }, {
        scaleY: '1'
    }, '-=.5')
    APP.animate.fromTo('.service-logo', .5, {
        y: '-100%',
        alpha: 0
    }, {
        y: '0%',
        alpha: 1
    }, '-=.5')
    APP.animate.fromTo('.version', .5, {
        alpha: 0
    }, {
        alpha: 1
    }, '-=.5')
    APP.animate.fromTo('.date', .2, {
        x: '-100%',
        alpha: 0
    }, {
        x: '0%',
        alpha: 1
    }, '-=.2')
    APP.animate.fromTo('.img circle', 1.5, {
        strokeDasharray: 120,
        strokeDashoffset: 120
    }, {
        strokeDasharray: 120,
        strokeDashoffset: 0
    })
}
APP.animation()
APP.preloader.hide = () => {
    APP.animate.play()
}

APP.init = () => {
    APP.preloader.element.remove()

    APP.canvas = new Canvas({ element:  APP.__root.querySelector('main'), APP })
    new p5((e) => APP.canvas.init(e), APP.canvas.parent)

    APP.canvas.uniformWidth = { value: 0 }

    if(window.location.href.includes('#debug')) {
        document.body.classList.add('debug')
        APP.canvas.u_color = { value: .001 }
        APP.canvas.u_speed = { value: .001 }
        APP.canvas.u_width = { value: .001 }
        APP.canvas.u_step = { value: .001 }
        APP.canvas.u_circ = { value: .001 }
        APP.canvas.u_collision = { value: .001 }
        APP.__root.querySelector('#u_u').insertAdjacentHTML('beforeend', '<div class="u"><input class="u_color uu" placeholder="color" type="number"></div>')
        APP.__root.querySelector('#u_u').insertAdjacentHTML('beforeend', '<div class="u"><input class="u_speed uu" placeholder="speed" type="number"></div>')
        APP.__root.querySelector('#u_u').insertAdjacentHTML('beforeend', '<div class="u"><input class="u_width uu" placeholder="fragment" type="number"></div>')
        APP.__root.querySelector('#u_u').insertAdjacentHTML('beforeend', '<div class="u"><input class="u_circ uu" placeholder="mask" type="number"></div>')
        APP.__root.querySelector('#u_u').insertAdjacentHTML('beforeend', '<div class="u"><input class="u_step uu" placeholder="step" type="number"></div>')
        APP.__root.querySelector('#u_u').insertAdjacentHTML('beforeend', '<div class="u"><input class="u_collision uu" placeholder="collision" type="number"></div>')
        APP.__root.querySelector('input.u_color').addEventListener('keypress', e => (e.key === 'Enter' && e.keyCode === 13) && new Animation({ onUpdate: function() {
            APP.canvas.shader.setUniform('u_coloring',  APP.canvas.u_color.value);
        } }).to(APP.canvas.u_color, 5, {
            value: e.target.value.match(/^\d*\.\d+/) ? e.target.value : parseFloat('.' + e.target.value)
        }))
        APP.__root.querySelector('input.u_speed').addEventListener('keypress', e => (e.key === 'Enter' && e.keyCode === 13) && new Animation({ onUpdate: function() {
            APP.canvas.shader.setUniform('u_speed',  APP.canvas.u_speed.value);
        } }).to(APP.canvas.u_speed, 5, {
            value: e.target.value
        }))
        APP.__root.querySelector('input.u_width').addEventListener('keypress', e => (e.key === 'Enter' && e.keyCode === 13) && new Animation({ onUpdate: function() {
            APP.canvas.shader.setUniform('u_width',  APP.canvas.u_width.value);
        } }).to(APP.canvas.u_width, 5, {
            value: e.target.value
        }))
        APP.__root.querySelector('input.u_circ').addEventListener('keypress', e => (e.key === 'Enter' && e.keyCode === 13) && new Animation({ onUpdate: function() {
            APP.canvas.shader.setUniform('u_circ',  APP.canvas.u_circ.value);
        } }).to(APP.canvas.u_circ, 5, {
            value: e.target.value
        }))
        APP.__root.querySelector('input.u_step').addEventListener('keypress', e => (e.key === 'Enter' && e.keyCode === 13) && new Animation({ onUpdate: function() {
            APP.canvas.shader.setUniform('u_step',  APP.canvas.u_step.value);
        } }).to(APP.canvas.u_step, 5, {
            value: e.target.value
        }))
        APP.__root.querySelector('input.u_collision').addEventListener('keypress', e => (e.key === 'Enter' && e.keyCode === 13) && new Animation({ onUpdate: function() {
            APP.canvas.shader.setUniform('u_collision',  APP.canvas.u_collision.value);
        } }).to(APP.canvas.u_collision, 5, {
            value: e.target.value
        }))
    }


    new Animation({ onUpdate: function() {
        APP.canvas.shader.setUniform('u_width',  APP.canvas.uniformWidth.value);
    } }).to(APP.canvas.uniformWidth, 2, {
        value: APP.canvas.sketch.width / 1.5 < 370 ? APP.canvas.sketch.width / 1.5 : 370
    })
    APP.event = ['click', 'mouseup']

    APP.event.forEach(evt => APP.__root.querySelector('.full_screen').addEventListener(evt, toggleFullScreen))
}

function toggleFullScreen() {
    if (!document.fullscreenElement && // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) { // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}






