const Renderer = require('yy-renderer')
const Random = require('yy-random')
const Loop = require('yy-loop')
const Ease = require('pixi-ease')
const PIXI = require('pixi.js')
const clicked = require('clicked')

const FPS = require('..')

const STARTING = 500

let _renderer, _loop, _fps, _count, _meter, _move, _place

function test()
{
    _fps = new FPS()
}

function update(elapsed)
{
    _fps.frame()
    for (let box of _renderer.stage.children)
    {
        box.ease.loop(elapsed)
    }
    _renderer.render()
}

function box()
{
    const box = _renderer.stage.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
    box.anchor.set(0.5)
    box.tint = Random.color()
    box.alpha = 0.1
    box.width = box.height = Random.range(10, 100)
    box.position.set(Random.range(-box.width / 2, window.innerWidth + box.width / 2), -box.height / 2)
    box.ease = new Ease.list()
    box.ease.to(box, { rotation: Random.sign() * 2 * Math.PI }, Random.range(100, 5000), { repeat: true })
    target(box)
}

function target(box)
{
    const to = box.ease.to(box, { x: Random.range(-box.width / 2, window.innerWidth + box.width / 2), y: Random.range(-box.width / 2, window.innerHeight + box.height / 2) }, Random.range(1000, 5000), { ease: 'easeInOutSine' })
    to.on('done', target)
}

function count()
{
    const count = document.createElement('div')
    document.body.appendChild(count)
    count.style.borderRadius = '10%'
    count.style.position = 'fixed'
    count.style.right = '1em'
    count.style.top = '50%'
    count.style.transform = 'translate(0, -50%)'
    count.style.background = 'rgba(0, 100, 0, 0.5)'
    count.style.color = 'white'
    count.style.padding = '0.1em 0.25em'
    count.style.fontSize = '2em'
    count.style.textAlign = 'center'
    const up = document.createElement('i')
    up.className = 'fa fa-arrow-up'
    up.ariaHidden = 'true'
    up.style.cursor = 'pointer'
    count.appendChild(up)
    clicked(up, () => change(500))
    _count = document.createElement('div')
    count.appendChild(_count)
    _count.innerText = STARTING
    const down = document.createElement('div')
    count.appendChild(down)
    down.className = 'fa fa-arrow-down'
    down.ariaHidden = 'true'
    down.style.cursor = 'pointer'
    clicked(down, () => change(-500))
}

function meter()
{
    _meter = document.createElement('div')
    document.body.appendChild(_meter)
    _meter.style.borderRadius = '5%'
    _meter.style.position = 'fixed'
    _meter.style.left = '1em'
    _meter.style.top = '50%'
    _meter.style.transform = 'translate(0, -60%)'
    _meter.style.background = 'rgba(0, 100, 0, 0.5)'
    _meter.style.color = 'white'
    _meter.style.padding = '0.1em 0.5em'
    _meter.style.fontSize = '2em'
    _meter.style.textAlign = 'center'
    _meter.style.cursor = 'pointer'
    _meter.innerText = 'meter on'
    clicked(_meter, meterChange)
}

function meterChange()
{
    if (_meter.innerText === 'meter on')
    {
        _meter.innerText = 'meter off'
        _meter.style.background = 'rgba(100, 0, 0, 0.5)'
        _fps.meter = false
    }
    else
    {
        _meter.innerText = 'meter on'
        _meter.style.background = 'rgba(0, 100, 0, 0.5)'
        _fps.meter = true
    }
}

function move()
{
    _place = 'bottom-right'
    _move = document.createElement('div')
    document.body.appendChild(_move)
    _move.style.borderRadius = '5%'
    _move.style.position = 'fixed'
    _move.style.left = '1em'
    _move.style.top = '50%'
    _move.style.transform = 'translate(0, 60%)'
    _move.style.background = 'rgba(0, 100, 0, 0.5)'
    _move.style.color = 'white'
    _move.style.padding = '0.1em 0.5em'
    _move.style.fontSize = '2em'
    _move.style.textAlign = 'center'
    _move.style.cursor = 'pointer'
    _move.innerText = 'move'
    clicked(_move, moveChange)
}

function moveChange()
{
    switch (_place)
    {
        case 'bottom-right':
            _place = 'bottom-left'
            break
        case 'bottom-left':
            _place = 'top-left'
            break
        case 'top-left':
            _place = 'top-right'
            break
        case 'top-right':
            _place = 'bottom-right'
            break
    }
    const meter = _fps.meter
    _fps.remove()
    _fps = new FPS({ meter, side: _place })
}

function change(amount)
{
    if (parseInt(_count.innerText) + amount >= 0)
    {
        _count.innerText = parseInt(_count.innerText) + amount
        for (let i = 0; i < Math.abs(amount); i++)
        {
            if (amount > 0)
            {
                box()
            }
            else
            {

                _renderer.stage.removeChild(_renderer.stage.children[0])
            }
        }
    }
}

function init()
{
    _renderer = new Renderer()
    _loop = new Loop({ pauseOnBlur: true })
    _loop.on('each', update)
    _loop.start()
}

window.onload = function ()
{
    test()
    init()
    for (let i = 0; i < STARTING; i++) box()
    count()
    meter()
    move()
    require('fork-me-github')('https://github.com/davidfig/loop')
    require('./highlight')()
}