const Color = require('tinycolor2')

const STYLES = {
    'position': 'fixed',
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
     * @param {string} [options.side=bottom-right] include any combination of left/right and top/bottom
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
        this.options = options || {}
        this.tolerance = this.options.tolerance || 1
        this.FPS = this.options.FPS || 60
        this.meterWidth = this.options.meterWidth || 100
        this.meterHeight = this.options.meterHeight || 25
        this.meterLineHeight = this.options.meterLineHeight || 4
        this.div = document.createElement('div')
        this.parent = this.options.parent || document.body
        this.parent.appendChild(this.div)
        this.side(this.options)
        this.style(this.div, STYLES, this.options.styles)
        this.divFPS()
        this.meter = typeof this.options.meter === 'undefined' || this.options.meter
        this.lastTime = 0
        this.frameNumber = 0
        this.lastUpdate = 0
        this.lastFPS = '--'
    }

    /**
     * remove meter from DOM
     */
    remove()
    {
        this.div.remove()
    }

    /**
     * @type {boolean} meter (the FPS graph) is on or off
     */
    get meter()
    {
        return this._meter
    }
    set meter(value)
    {
        if (value)
        {
            this.divMeter()
        }
        else if (this.meterCanvas)
        {
            this.meterCanvas.style.display = 'none'
        }
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
    divFPS()
    {
        const div = this.div
        const options = this.options
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
    divMeter()
    {
        const div = this.div
        const options = this.options
        if (!this.meterCanvas)
        {
            this.meterCanvas = document.createElement('canvas')
            div.appendChild(this.meterCanvas)
            this.meterCanvas.width = this.meterWidth
            this.meterCanvas.height = this.meterHeight
            this.meterCanvas.style.width = div.width + 'px'
            this.meterCanvas.style.height = div.height + 'px'
            this.style(this.meterCanvas, STYLES_METER, options.stylesMeter)
        }
        else
        {
            this.meterCanvas.style.display = 'block'
        }
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
                if (this.lastFPS >= this.FPS - this.tolerance && this.lastFPS <= this.FPS + this.tolerance)
                {
                    this.lastFPS = this.FPS
                }
            }
            this.lastTime = performance.now()
            this.frameNumber = 0
        }
        this.fps.innerText = this.lastFPS
        if (this.meterCanvas && this.lastFPS !== '--')
        {
            this.meterUpdate(this.lastFPS / this.FPS)
        }
    }

    meterUpdate(percent)
    {
        const c = this.meterCanvas.getContext('2d')
        const data = c.getImageData(0, 0, this.meterCanvas.width, this.meterCanvas.height)
        c.putImageData(data, -1, 0)
        c.clearRect(this.meterCanvas.width - 1, 0, 1, this.meterCanvas.height)
        if (percent < 0.5)
        {
            c.fillStyle = Color.mix('#ff0000', '0xffa500', percent * 200).toHexString()
        }
        else
        {
            c.fillStyle = Color.mix('#ffa500', '#00ff00', (percent - 0.5) * 200).toHexString()
        }
        const height = (this.meterCanvas.height - this.meterLineHeight) * (1 - percent)
        c.fillRect(this.meterCanvas.width - 1, height, 1, this.meterLineHeight)
    }

    side(options)
    {
        if (options.side)
        {
            options.side = options.side.toLowerCase()
            if (options.side.indexOf('left') !== -1)
            {
                STYLES['left'] = 0
                delete STYLES['right']
            }
            else
            {
                STYLES['right'] = 0
                delete STYLES['left']
            }
            if (options.side.indexOf('top') !== -1)
            {
                STYLES['top'] = 0
                delete STYLES['bottom']
            }
            else
            {
                STYLES['bottom'] = 0
                delete STYLES['top']
            }
        }
        else
        {
            STYLES['right'] = 0
            STYLES['bottom'] = 0
        }
    }
}