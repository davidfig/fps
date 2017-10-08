const Color = require('yy-color')

const STYLES = {
    'position': 'fixed',
    'right': 0,
    'bottom': 0,
    'background': 'rgba(0, 0, 0, 0.5)',
    'color': 'white',
    'zIndex': 1001
}

const STYLES_FPS = {
    'padding': '0.1em 0.5em'
}

const STYLES_METER = {
}

module.exports = class FPS
{
    /**
     * @param {object} [options]
     * @param {boolean} [options.meter=true] include a meter with the FPS
     * @param {number} [options.FPS=60] desired FPS
     * @param {number} [options.tolerance=1] minimum tolerance for fluctuations in FPS number
     * @param {number} [options.meterWidth=100] width of meter div
     * @param {number} [options.meterHeight=25] height of meter div
     * @param {number} [options.meterLineHeight=4] height of meter line
     * @param {HTMLElement} [options.parent=document.body]
     * @param {styles[]} [options.styles] CSS styles to apply to the div (in javascript format)
     * @param {styles[]} [options.stylesFPS] CSS styles to apply to the FPS text (in javascript format)
     * @param {styles[]} [options.stylesMeter] CSS styles to apply to the FPS meter (in javascript format)
     * @param {string} [options.text=" FPS"] change the text to the right of the FPS
     */
    constructor(options)
    {
        options = options || {}
        this.tolerance = options.tolerance || 1
        this.FPS = options.FPS || 60
        this.meterWidth = options.meterWidth || 100
        this.meterHeight = options.meterHeight || 25
        this.meterLineHeight = options.meterLineHeight || 4
        const div = document.createElement('div')
        const parent = options.parent || document.body
        parent.appendChild(div)
        this.style(div, STYLES, options.styles)
        this.divFPS(div, options)
        if (typeof options.meter === 'undefined' || options.meter)
        {
            this.divMeter(div, options)
        }
        this.lastTime = 0
        this.frameNumber = 0
        this.lastUpdate = 0
        this.lastFPS = '--'
    }


    style(div, style1, style2)
    {
        for (let style in style1)
        {
            div.style[style] = style1[style]
        }
        if (style2)
        {
            for (let style in style2)
            {
                div.style[style] = style2[style]
            }
        }
    }

    /**
     * create div for text FPS
     * @private
     * @param {HTMLElement} div
     * @param {object} options (see contructor)
     */
    divFPS(div, options)
    {
        const divFPS = document.createElement('div')
        div.appendChild(divFPS)
        this.fps = document.createElement('span')
        divFPS.appendChild(this.fps)
        const span = document.createElement('span')
        divFPS.appendChild(span)
        span.innerText = typeof options.text !== 'undefined' ? options.text : ' FPS'
        this.style(div, STYLES_FPS, options.stylesFPS)
    }

    /**
     * create div for FPS meter
     * @private
     * @param {HTMLElement} div
     * @param {object} options (see contructor)
     */
    divMeter(div, options)
    {
        this.meter = document.createElement('canvas')
        div.appendChild(this.meter)
        this.meter.width = this.meterWidth
        this.meter.height = this.meterHeight
        this.meter.style.width = div.width + 'px'
        this.meter.style.height = div.height + 'px'
        this.style(this.meter, STYLES_METER, options.stylesMeter)
    }

    /**
     * call this at the start of the frame to calculate FPS
     */
    frame()
    {
        this.frameNumber++
        const currentTime = performance.now() - this.lastTime

        // skip large differences to remove garbage
        if (currentTime > 500)
        {
            if (this.lastTime !== 0)
            {
                this.lastFPS = Math.floor(this.frameNumber / (currentTime / 1000))
                if (this.lastFPS >= FPS - this.tolerance && this.lastFPS <= FPS + this.tolerance)
                {
                    this.lastFPS = this.FPS
                }
            }
            this.lastTime = performance.now()
            this.frameNumber = 0
        }
        this.fps.innerText = this.lastFPS
        if (this.meter && this.lastFPS !== '--')
        {
            this.meterUpdate(this.lastFPS / this.FPS)
        }
    }

    meterUpdate(percent)
    {
        function clamp(x, max)
        {
            return (x > max) ? max : x
        }
        const c = this.meter.getContext('2d')
        const data = c.getImageData(0, 0, this.meter.width, this.meter.height)
        c.putImageData(data, -1, 0)
        c.clearRect(this.meter.width - 1, 0, 1, this.meter.height)
        if (percent < 0.5)
        {
            c.fillStyle = '#' + Color.blend(clamp(percent * 2, 1), 0xff0000, 0xffa500).toString(16)
        }
        else
        {
            c.fillStyle = '#' + Color.blend(clamp((percent - 0.5) * 2, 1), 0xffa500, 0x00ff00).toString(16)
        }
        const height = (this.meter.height - this.meterLineHeight) * (1 - percent)
        c.fillRect(this.meter.width - 1, height, 1, this.meterLineHeight)
    }
}