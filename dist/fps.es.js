/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var defaultFPSOptions = {
    meter: true,
    side: 'bottom-right',
    FPS: 60,
    tolerance: 1,
    meterWidth: 100,
    meterHeight: 25,
    meterLineHeight: 4,
    styles: {
        'background': 'rgba(0, 0, 0, 0.5)',
        'color': 'white',
    },
    stylesFPS: {
        'padding': '0.1em 0.5em',
    },
    text: ' FPS',
    colorGreen: '#00ff00',
    colorOrange: '#ffa500',
    colorRed: '#ff0000',
    zIndex: 1000,
};
var FPS = /** @class */ (function () {
    /**
     * @param [options]
     * @param [options.meter=true] - include a meter with the FPS
     * @param [options.side=bottom-right] - include any combination of left/right and top/bottom
     * @param [options.FPS=60] - desired FPS
     * @param [options.tolerance=1] - minimum tolerance for fluctuations in FPS number
     * @param [options.meterWidth=100] - width of meter div
     * @param [options.meterHeight=25] - height of meter div
     * @param [options.meterLineHeight=4] - height of meter line
     * @param [options.styles] - CSS styles to apply to the div (in javascript format)
     * @param [options.stylesFPS] - CSS styles to apply to the FPS text (in javascript format)
     * @param [options.stylesMeter] - CSS styles to apply to the FPS meter (in javascript format)
     * @param [options.text=" FPS"] - change the text to the right of the FPS
     * @param [options.colorGreen=#ffa500] green (good) color on meter
     * @param [options.colorRed = #ff0000] red (bad) color on meter
     * @param [options.zIndex = 1000] zIndex to assign to div
     */
    function FPS(options) {
        if (options === void 0) { options = {}; }
        this.lastTime = 0;
        this.frameNumber = 0;
        this.lastFPS = 0;
        this.options = __assign(__assign({}, defaultFPSOptions), options);
        this.div = document.createElement('div');
        this.findParent(this.options.side || 'bottom-right').appendChild(this.div);
        this.style(this.div, this.options.styles);
        this.createDivFPS();
        if (this.options.meter) {
            this.createDivMeter();
        }
    }
    Object.defineProperty(FPS.prototype, "fps", {
        /** desired FPS */
        get: function () {
            return this.options.FPS;
        },
        set: function (value) {
            this.options.FPS = value;
        },
        enumerable: false,
        configurable: true
    });
    /** remove meter from DOM */
    FPS.prototype.remove = function () {
        this.div.remove();
    };
    Object.defineProperty(FPS.prototype, "meter", {
        /** meter (the FPS graph) is on or off */
        get: function () {
            return this.options.meter;
        },
        set: function (value) {
            if (value) {
                this.createDivMeter();
            }
            else if (this.meterCanvas) {
                this.meterCanvas.style.display = 'none';
            }
        },
        enumerable: false,
        configurable: true
    });
    FPS.prototype.style = function (div, style) {
        for (var entry in style) {
            div.style[entry] = style[entry];
        }
    };
    FPS.prototype.createDivFPS = function () {
        var divFPS = document.createElement('div');
        this.style(divFPS, this.options.stylesFPS);
        this.div.appendChild(divFPS);
        this.fpsSpan = document.createElement('span');
        divFPS.appendChild(this.fpsSpan);
        var span = document.createElement('span');
        divFPS.appendChild(span);
        span.innerText = this.options.text;
    };
    FPS.prototype.createDivMeter = function () {
        if (!this.meterCanvas) {
            this.meterCanvas = document.createElement('canvas');
            this.div.appendChild(this.meterCanvas);
            this.meterCanvas.width = this.options.meterWidth;
            this.meterCanvas.height = this.options.meterHeight;
            this.meterCanvas.style.width = this.options.meterWidth + 'px';
            this.meterCanvas.style.height = this.options.meterHeight + 'px';
            this.style(this.meterCanvas, this.options.stylesMeter);
            this.meterContext = this.meterCanvas.getContext('2d');
        }
        else {
            this.meterCanvas.style.display = 'block';
        }
    };
    /** call this at the end of the frame to calculate FPS */
    FPS.prototype.frame = function () {
        this.frameNumber++;
        var currentTime = performance.now() - this.lastTime;
        // skip large differences to remove garbage
        if (currentTime > 500) {
            if (this.lastTime !== 0) {
                this.lastFPS = Math.floor(this.frameNumber / (currentTime / 1000));
                if (this.lastFPS > this.options.FPS ||
                    (this.lastFPS >= this.options.FPS - this.options.tolerance &&
                        this.lastFPS <= this.options.FPS + this.options.tolerance)) {
                    this.lastFPS = this.options.FPS;
                }
            }
            this.lastTime = performance.now();
            this.frameNumber = 0;
        }
        this.fpsSpan.innerText = this.lastFPS === 0 ? '--' : this.lastFPS + '';
        if (this.options.meter && this.lastFPS !== 0) {
            this.meterUpdate(this.lastFPS / this.options.FPS);
        }
    };
    /**
     * From https://github.com/bgrins/TinyColor#readme
     * Mix two RGP colors
     * @param color1 - first color
     * @param color2 - second color
     * @param percent - percent to mix
     */
    FPS.prototype.mix = function (color1, color2, percent) {
        var rgb = function (color) {
            return {
                r: parseInt(color.substr(1, 2), 16),
                g: parseInt(color.substr(3, 2), 16),
                b: parseInt(color.substr(5, 2), 16),
            };
        };
        var digit2 = function (n) {
            n = Math.floor(n);
            if (n.toString().length === 1) {
                return '0' + n.toString(16);
            }
            else {
                return n.toString(16);
            }
        };
        var rgb1 = rgb(color1);
        var rgb2 = rgb(color2);
        var r = digit2(rgb1.r * percent + rgb2.r * (1 - percent));
        var g = digit2(rgb1.g * percent + rgb2.g * (1 - percent));
        var b = digit2(rgb1.b * percent + rgb2.b * (1 - percent));
        return "#" + r + g + b;
    };
    FPS.prototype.meterUpdate = function (percent) {
        var data = this.meterContext.getImageData(0, 0, this.meterCanvas.width, this.meterCanvas.height);
        this.meterContext.putImageData(data, -1, 0);
        this.meterContext.clearRect(this.meterCanvas.width - 1, 0, 1, this.meterCanvas.height);
        if (percent <= 0.5) {
            this.meterContext.fillStyle = this.mix(this.options.colorRed, this.options.colorOrange, 1 - percent * 2);
        }
        else {
            this.meterContext.fillStyle = this.mix(this.options.colorGreen, this.options.colorOrange, (percent - 0.5) * 2);
        }
        var height = (this.meterCanvas.height - this.options.meterLineHeight) * (1 - percent);
        this.meterContext.fillRect(this.meterCanvas.width - 1, height, 1, this.options.meterLineHeight);
    };
    /**
     * find the parent div for one of the corners
     * @param side side to place the panel (combination of right/left and bottom/top)
     * @return {HTMLElement}
     */
    FPS.prototype.findParent = function (side) {
        var styles = [];
        var name = 'yy-counter-';
        if (side.indexOf('left') !== -1) {
            name += 'left-';
            styles['left'] = 0;
        }
        else {
            name += 'right-';
            styles['right'] = 0;
        }
        if (side.indexOf('top') !== -1) {
            name += 'top';
            styles['top'] = 0;
        }
        else {
            name += 'bottom';
            styles['bottom'] = 0;
        }
        var test = document.getElementById(name);
        if (test) {
            return test;
        }
        var container = document.createElement('div');
        container.id = name;
        container.style.overflow = 'hidden';
        container.style.position = 'fixed';
        container.style.zIndex = this.options.zIndex.toString();
        container.style.pointerEvents = 'none';
        container.style.userSelect = 'none';
        for (var style in styles) {
            container.style[style] = styles[style];
        }
        document.body.appendChild(container);
        return container;
    };
    return FPS;
}());

export { FPS, defaultFPSOptions };
//# sourceMappingURL=fps.es.js.map
