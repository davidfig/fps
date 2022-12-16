import * as PIXI from 'pixi.js'
import random from 'yy-random'
import { ease, Easing } from 'pixi-ease'
import { clicked } from 'clicked'
import 'fork-me-github'

import { highlight } from './highlight'

import { FPS } from '../fps'
// import { FPS } from '../dist/fps.es' // test es packages

// number of boxes
const STARTING = 300
const DELTA = 500

// how often to change when holding down arrows
const INTERVAL = 50

let renderer: PIXI.Renderer,
    stage: PIXI.Container,
    fps: FPS,
    count: HTMLDivElement,
    meter: HTMLDivElement,
    move: HTMLDivElement,
    place: string,
    interval: number

function test() {
    fps = new FPS()

    // to test bundled package
    // fps = new (window as any).FPS.FPS()
}

function update() {
    fps.frame()
}

function box() {
    const box = stage.addChild(new PIXI.Sprite(PIXI.Texture.WHITE)) as SpriteWithEase
    box.anchor.set(0.5)
    box.tint = random.color()
    box.alpha = 0.1
    box.width = box.height = random.range(10, 100)
    box.position.set(random.range(-box.width / 2, window.innerWidth + box.width / 2), 100)
    box.ease1 = ease.add(box, { rotation: random.sign() * 2 * Math.PI }, { duration: random.range(100, 5000), repeat: true })
    box.ease2 = ease.add(box, {
        x: random.range(-box.width / 2, window.innerWidth + box.width / 2),
        y: random.range(-box.width / 2, window.innerHeight + box.height / 2)
    }, { duration: random.range(1000, 5000), ease: 'easeInOutSine', reverse: true, repeat: true })
}

function createCount() {
    const countHolder = document.createElement('div')
    document.body.appendChild(countHolder)
    countHolder.style.borderRadius = '10%'
    countHolder.style.position = 'fixed'
    countHolder.style.right = '1em'
    countHolder.style.top = '50%'
    countHolder.style.transform = 'translate(0, -50%)'
    countHolder.style.background = 'rgba(0, 100, 0, 0.5)'
    countHolder.style.color = 'white'
    countHolder.style.padding = '0.1em 0.25em'
    countHolder.style.fontSize = '2em'
    countHolder.style.textAlign = 'center'
    const up = document.createElement('i')
    up.className = 'fa fa-arrow-up'
    up.style.cursor = 'pointer'
    countHolder.appendChild(up)
    document.body.addEventListener('touchend', () => pressCount(0))
    up.addEventListener('touchstart', () => pressCount(1))
    up.addEventListener('mousedown', () => pressCount(1))
    document.body.addEventListener('mouseup', () => pressCount(0))
    count = document.createElement('div')
    countHolder.appendChild(count)
    count.innerText = STARTING + ''
    const down = document.createElement('div')
    countHolder.appendChild(down)
    down.className = 'fa fa-arrow-down'
    down.style.cursor = 'pointer'
    down.addEventListener('touchstart', () => pressCount(-1))
    document.body.addEventListener('touchend', () => pressCount(0))
    down.addEventListener('mousedown', () => pressCount(-1))
    document.body.addEventListener('mouseup', () => pressCount(0))
}

function pressCount(delta: number) {
    if (delta === 0) {
        clearInterval(interval)
    } else {
        change(delta * DELTA)
        interval = window.setInterval(() => change(delta * DELTA), INTERVAL)
    }
}

function createMeter() {
    meter = document.createElement('div')
    document.body.appendChild(meter)
    meter.style.borderRadius = '5%'
    meter.style.position = 'fixed'
    meter.style.left = '1em'
    meter.style.top = '50%'
    meter.style.transform = 'translate(0, -60%)'
    meter.style.background = 'rgba(0, 100, 0, 0.5)'
    meter.style.color = 'white'
    meter.style.padding = '0.1em 0.5em'
    meter.style.fontSize = '2em'
    meter.style.textAlign = 'center'
    meter.style.cursor = 'pointer'
    meter.innerText = 'meter on'
    clicked(meter, meterChange)
}

function meterChange() {
    if (meter.innerText === 'meter on') {
        meter.innerText = 'meter off'
        meter.style.background = 'rgba(100, 0, 0, 0.5)'
        fps.meter = false
    }
    else {
        meter.innerText = 'meter on'
        meter.style.background = 'rgba(0, 100, 0, 0.5)'
        fps.meter = true
    }
}

function createMove() {
    place = 'bottom-right'
    move = document.createElement('div')
    document.body.appendChild(move)
    move.style.borderRadius = '5%'
    move.style.position = 'fixed'
    move.style.left = '1em'
    move.style.top = '50%'
    move.style.transform = 'translate(0, 60%)'
    move.style.background = 'rgba(0, 100, 0, 0.5)'
    move.style.color = 'white'
    move.style.padding = '0.1em 0.5em'
    move.style.fontSize = '2em'
    move.style.textAlign = 'center'
    move.style.cursor = 'pointer'
    move.innerText = 'move'
    clicked(move, moveChange)
}

function moveChange() {
    switch (place) {
        case 'bottom-right':
            place = 'bottom-left'
            break
        case 'bottom-left':
            place = 'top-left'
            break
        case 'top-left':
            place = 'top-right'
            break
        case 'top-right':
            place = 'bottom-right'
            break
    }
    const meter = fps.meter
    fps.remove()
    fps = new FPS({ meter, side: place })

    // to test bundled package
    // fps = new (window as any).FPS.FPS({ meter, side: place })
}

function change(amount: number) {
    if (parseInt(count.innerText) + amount >= 0) {
        count.innerText = parseInt(count.innerText) + amount + ''
        for (let i = 0; i < Math.abs(amount); i++) {
            if (amount > 0) {
                box()
            }
            else {
                const remove = stage.children[0] as SpriteWithEase
                remove.ease1.remove()
                remove.ease2.remove()
                stage.removeChild(remove)
            }
        }
    }
}

function init() {
    renderer = new PIXI.Renderer({ backgroundAlpha: 0, width: window.innerWidth, height: window.innerHeight })
    stage = new PIXI.Container()
    const view = renderer.view as HTMLCanvasElement;
    view.style.position = 'fixed'
    view.style.top = '0'
    view.style.left = '0'
    document.body.appendChild(view)
}

function loop() {
    update()
    renderer.render(stage)
    requestAnimationFrame(loop)
}

window.onload = function () {
    test()
    init()
    for (let i = 0; i < STARTING; i++) box()
    createCount()
    createMeter()
    createMove()
    highlight()
    loop()
}

interface SpriteWithEase extends PIXI.Sprite {
    ease1: Easing
    ease2: Easing
}