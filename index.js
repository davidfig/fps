'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Color = require('tinycolor2');
var Counter = require('yy-counter');

var STYLES = {
    'background': 'rgba(0, 0, 0, 0.5)',
    'color': 'white'
};

var STYLES_FPS = {
    'padding': '0.1em 0.5em'
};

var STYLES_METER = {};

module.exports = function () {
    /**
     * @param {object} [options]
     * @param {boolean} [options.meter=true] include a meter with the FPS
     * @param {string} [options.side=bottom-right] include any combination of left/right and top/bottom
     * @param {number} [options.FPS=60] desired FPS
     * @param {number} [options.tolerance=1] minimum tolerance for fluctuations in FPS number
     * @param {number} [options.meterWidth=100] width of meter div
     * @param {number} [options.meterHeight=25] height of meter div
     * @param {number} [options.meterLineHeight=4] height of meter line
     * @param {styles[]} [options.styles] CSS styles to apply to the div (in javascript format)
     * @param {styles[]} [options.stylesFPS] CSS styles to apply to the FPS text (in javascript format)
     * @param {styles[]} [options.stylesMeter] CSS styles to apply to the FPS meter (in javascript format)
     * @param {string} [options.text=" FPS"] change the text to the right of the FPS
     */
    function FPS(options) {
        _classCallCheck(this, FPS);

        this.options = options || {};
        this.tolerance = this.options.tolerance || 1;
        this.FPS = this.options.FPS || 60;
        this.meterWidth = this.options.meterWidth || 100;
        this.meterHeight = this.options.meterHeight || 25;
        this.meterLineHeight = this.options.meterLineHeight || 4;
        this.div = document.createElement('div');
        Counter.findParent(this.options.side || 'bottom-right').appendChild(this.div);
        this.style(this.div, STYLES, this.options.styles);
        this.divFPS();
        this.meter = typeof this.options.meter === 'undefined' || this.options.meter;
        this.lastTime = 0;
        this.frameNumber = 0;
        this.lastUpdate = 0;
        this.lastFPS = '--';
    }

    /**
     * change desired FPS
     * @type {number}
     */


    _createClass(FPS, [{
        key: 'remove',


        /**
         * remove meter from DOM
         */
        value: function remove() {
            this.div.remove();
        }

        /**
         * @type {boolean} meter (the FPS graph) is on or off
         */

    }, {
        key: 'style',
        value: function style(div, style1, style2) {
            for (var style in style1) {
                div.style[style] = style1[style];
            }
            if (style2) {
                for (var _style in style2) {
                    div.style[_style] = style2[_style];
                }
            }
        }

        /**
         * create div for text FPS
         * @private
         * @param {HTMLElement} div
         * @param {object} options (see contructor)
         */

    }, {
        key: 'divFPS',
        value: function divFPS() {
            var div = this.div;
            var options = this.options;
            var divFPS = document.createElement('div');
            div.appendChild(divFPS);
            this.fpsSpan = document.createElement('span');
            divFPS.appendChild(this.fpsSpan);
            var span = document.createElement('span');
            divFPS.appendChild(span);
            span.innerText = typeof options.text !== 'undefined' ? options.text : ' FPS';
            this.style(div, STYLES_FPS, options.stylesFPS);
        }

        /**
         * create div for FPS meter
         * @private
         * @param {HTMLElement} div
         * @param {object} options (see contructor)
         */

    }, {
        key: 'divMeter',
        value: function divMeter() {
            var div = this.div;
            var options = this.options;
            if (!this.meterCanvas) {
                this.meterCanvas = document.createElement('canvas');
                div.appendChild(this.meterCanvas);
                this.meterCanvas.width = this.meterWidth;
                this.meterCanvas.height = this.meterHeight;
                this.meterCanvas.style.width = div.width + 'px';
                this.meterCanvas.style.height = div.height + 'px';
                this.style(this.meterCanvas, STYLES_METER, options.stylesMeter);
            } else {
                this.meterCanvas.style.display = 'block';
            }
        }

        /**
         * call this at the start of the frame to calculate FPS
         */

    }, {
        key: 'frame',
        value: function frame() {
            this.frameNumber++;
            var currentTime = performance.now() - this.lastTime;

            // skip large differences to remove garbage
            if (currentTime > 500) {
                if (this.lastTime !== 0) {
                    this.lastFPS = Math.floor(this.frameNumber / (currentTime / 1000));
                    if (this.lastFPS >= this.FPS - this.tolerance && this.lastFPS <= this.FPS + this.tolerance) {
                        this.lastFPS = this.FPS;
                    }
                }
                this.lastTime = performance.now();
                this.frameNumber = 0;
            }
            this.fpsSpan.innerText = this.lastFPS;
            if (this.meterCanvas && this.lastFPS !== '--') {
                this.meterUpdate(this.lastFPS / this.FPS);
            }
        }
    }, {
        key: 'meterUpdate',
        value: function meterUpdate(percent) {
            var c = this.meterCanvas.getContext('2d');
            var data = c.getImageData(0, 0, this.meterCanvas.width, this.meterCanvas.height);
            c.putImageData(data, -1, 0);
            c.clearRect(this.meterCanvas.width - 1, 0, 1, this.meterCanvas.height);
            if (percent < 0.5) {
                c.fillStyle = Color.mix('#ff0000', '0xffa500', percent * 200).toHexString();
            } else {
                c.fillStyle = Color.mix('#ffa500', '#00ff00', (percent - 0.5) * 200).toHexString();
            }
            var height = (this.meterCanvas.height - this.meterLineHeight) * (1 - percent);
            c.fillRect(this.meterCanvas.width - 1, height, 1, this.meterLineHeight);
        }
    }, {
        key: 'side',
        value: function side(options) {
            if (options.side) {
                options.side = options.side.toLowerCase();
                if (options.side.indexOf('left') !== -1) {
                    STYLES['left'] = 0;
                    delete STYLES['right'];
                } else {
                    STYLES['right'] = 0;
                    delete STYLES['left'];
                }
                if (options.side.indexOf('top') !== -1) {
                    STYLES['top'] = 0;
                    delete STYLES['bottom'];
                } else {
                    STYLES['bottom'] = 0;
                    delete STYLES['top'];
                }
            } else {
                STYLES['right'] = 0;
                STYLES['bottom'] = 0;
            }
        }
    }, {
        key: 'fps',
        get: function get() {
            return this.FPS;
        },
        set: function set(value) {
            this.FPS = value;
        }
    }, {
        key: 'meter',
        get: function get() {
            return this._meter;
        },
        set: function set(value) {
            if (value) {
                this.divMeter();
            } else if (this.meterCanvas) {
                this.meterCanvas.style.display = 'none';
            }
        }
    }]);

    return FPS;
}();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SCxTQTlETDtBQUFBLDBCQStEYyxLQS9EZCxFQWdFSTtBQUNJLGdCQUFJLEtBQUosRUFDQTtBQUNJLHFCQUFLLFFBQUw7QUFDSCxhQUhELE1BSUssSUFBSSxLQUFLLFdBQVQsRUFDTDtBQUNJLHFCQUFLLFdBQUwsQ0FBaUIsS0FBakIsQ0FBdUIsT0FBdkIsR0FBaUMsTUFBakM7QUFDSDtBQUNKO0FBekVMOztBQUFBO0FBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBDb2xvciA9IHJlcXVpcmUoJ3Rpbnljb2xvcjInKVxyXG5jb25zdCBDb3VudGVyID0gcmVxdWlyZSgneXktY291bnRlcicpXHJcblxyXG5jb25zdCBTVFlMRVMgPSB7XHJcbiAgICAnYmFja2dyb3VuZCc6ICdyZ2JhKDAsIDAsIDAsIDAuNSknLFxyXG4gICAgJ2NvbG9yJzogJ3doaXRlJyxcclxufVxyXG5cclxuY29uc3QgU1RZTEVTX0ZQUyA9IHtcclxuICAgICdwYWRkaW5nJzogJzAuMWVtIDAuNWVtJ1xyXG59XHJcblxyXG5jb25zdCBTVFlMRVNfTUVURVIgPSB7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRlBTXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5tZXRlcj10cnVlXSBpbmNsdWRlIGEgbWV0ZXIgd2l0aCB0aGUgRlBTXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuc2lkZT1ib3R0b20tcmlnaHRdIGluY2x1ZGUgYW55IGNvbWJpbmF0aW9uIG9mIGxlZnQvcmlnaHQgYW5kIHRvcC9ib3R0b21cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5GUFM9NjBdIGRlc2lyZWQgRlBTXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMudG9sZXJhbmNlPTFdIG1pbmltdW0gdG9sZXJhbmNlIGZvciBmbHVjdHVhdGlvbnMgaW4gRlBTIG51bWJlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1ldGVyV2lkdGg9MTAwXSB3aWR0aCBvZiBtZXRlciBkaXZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tZXRlckhlaWdodD0yNV0gaGVpZ2h0IG9mIG1ldGVyIGRpdlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1ldGVyTGluZUhlaWdodD00XSBoZWlnaHQgb2YgbWV0ZXIgbGluZVxyXG4gICAgICogQHBhcmFtIHtzdHlsZXNbXX0gW29wdGlvbnMuc3R5bGVzXSBDU1Mgc3R5bGVzIHRvIGFwcGx5IHRvIHRoZSBkaXYgKGluIGphdmFzY3JpcHQgZm9ybWF0KVxyXG4gICAgICogQHBhcmFtIHtzdHlsZXNbXX0gW29wdGlvbnMuc3R5bGVzRlBTXSBDU1Mgc3R5bGVzIHRvIGFwcGx5IHRvIHRoZSBGUFMgdGV4dCAoaW4gamF2YXNjcmlwdCBmb3JtYXQpXHJcbiAgICAgKiBAcGFyYW0ge3N0eWxlc1tdfSBbb3B0aW9ucy5zdHlsZXNNZXRlcl0gQ1NTIHN0eWxlcyB0byBhcHBseSB0byB0aGUgRlBTIG1ldGVyIChpbiBqYXZhc2NyaXB0IGZvcm1hdClcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy50ZXh0PVwiIEZQU1wiXSBjaGFuZ2UgdGhlIHRleHQgdG8gdGhlIHJpZ2h0IG9mIHRoZSBGUFNcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucylcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XHJcbiAgICAgICAgdGhpcy50b2xlcmFuY2UgPSB0aGlzLm9wdGlvbnMudG9sZXJhbmNlIHx8IDFcclxuICAgICAgICB0aGlzLkZQUyA9IHRoaXMub3B0aW9ucy5GUFMgfHwgNjBcclxuICAgICAgICB0aGlzLm1ldGVyV2lkdGggPSB0aGlzLm9wdGlvbnMubWV0ZXJXaWR0aCB8fCAxMDBcclxuICAgICAgICB0aGlzLm1ldGVySGVpZ2h0ID0gdGhpcy5vcHRpb25zLm1ldGVySGVpZ2h0IHx8IDI1XHJcbiAgICAgICAgdGhpcy5tZXRlckxpbmVIZWlnaHQgPSB0aGlzLm9wdGlvbnMubWV0ZXJMaW5lSGVpZ2h0IHx8IDRcclxuICAgICAgICB0aGlzLmRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgQ291bnRlci5maW5kUGFyZW50KHRoaXMub3B0aW9ucy5zaWRlIHx8ICdib3R0b20tcmlnaHQnKS5hcHBlbmRDaGlsZCh0aGlzLmRpdilcclxuICAgICAgICB0aGlzLnN0eWxlKHRoaXMuZGl2LCBTVFlMRVMsIHRoaXMub3B0aW9ucy5zdHlsZXMpXHJcbiAgICAgICAgdGhpcy5kaXZGUFMoKVxyXG4gICAgICAgIHRoaXMubWV0ZXIgPSB0eXBlb2YgdGhpcy5vcHRpb25zLm1ldGVyID09PSAndW5kZWZpbmVkJyB8fCB0aGlzLm9wdGlvbnMubWV0ZXJcclxuICAgICAgICB0aGlzLmxhc3RUaW1lID0gMFxyXG4gICAgICAgIHRoaXMuZnJhbWVOdW1iZXIgPSAwXHJcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gMFxyXG4gICAgICAgIHRoaXMubGFzdEZQUyA9ICctLSdcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNoYW5nZSBkZXNpcmVkIEZQU1xyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGZwcygpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRlBTXHJcbiAgICB9XHJcbiAgICBzZXQgZnBzKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuRlBTID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJlbW92ZSBtZXRlciBmcm9tIERPTVxyXG4gICAgICovXHJcbiAgICByZW1vdmUoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZGl2LnJlbW92ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn0gbWV0ZXIgKHRoZSBGUFMgZ3JhcGgpIGlzIG9uIG9yIG9mZlxyXG4gICAgICovXHJcbiAgICBnZXQgbWV0ZXIoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tZXRlclxyXG4gICAgfVxyXG4gICAgc2V0IG1ldGVyKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZGl2TWV0ZXIoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLm1ldGVyQ2FudmFzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5tZXRlckNhbnZhcy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0eWxlKGRpdiwgc3R5bGUxLCBzdHlsZTIpXHJcbiAgICB7XHJcbiAgICAgICAgZm9yIChsZXQgc3R5bGUgaW4gc3R5bGUxKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGl2LnN0eWxlW3N0eWxlXSA9IHN0eWxlMVtzdHlsZV1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN0eWxlMilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHN0eWxlIGluIHN0eWxlMilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZGl2LnN0eWxlW3N0eWxlXSA9IHN0eWxlMltzdHlsZV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSBkaXYgZm9yIHRleHQgRlBTXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZGl2XHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAoc2VlIGNvbnRydWN0b3IpXHJcbiAgICAgKi9cclxuICAgIGRpdkZQUygpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgZGl2ID0gdGhpcy5kaXZcclxuICAgICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zXHJcbiAgICAgICAgY29uc3QgZGl2RlBTID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZGl2RlBTKVxyXG4gICAgICAgIHRoaXMuZnBzU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgICAgIGRpdkZQUy5hcHBlbmRDaGlsZCh0aGlzLmZwc1NwYW4pXHJcbiAgICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgICAgIGRpdkZQUy5hcHBlbmRDaGlsZChzcGFuKVxyXG4gICAgICAgIHNwYW4uaW5uZXJUZXh0ID0gdHlwZW9mIG9wdGlvbnMudGV4dCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnRleHQgOiAnIEZQUydcclxuICAgICAgICB0aGlzLnN0eWxlKGRpdiwgU1RZTEVTX0ZQUywgb3B0aW9ucy5zdHlsZXNGUFMpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjcmVhdGUgZGl2IGZvciBGUFMgbWV0ZXJcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBkaXZcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIChzZWUgY29udHJ1Y3RvcilcclxuICAgICAqL1xyXG4gICAgZGl2TWV0ZXIoKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGRpdiA9IHRoaXMuZGl2XHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc1xyXG4gICAgICAgIGlmICghdGhpcy5tZXRlckNhbnZhcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubWV0ZXJDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxyXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQodGhpcy5tZXRlckNhbnZhcylcclxuICAgICAgICAgICAgdGhpcy5tZXRlckNhbnZhcy53aWR0aCA9IHRoaXMubWV0ZXJXaWR0aFxyXG4gICAgICAgICAgICB0aGlzLm1ldGVyQ2FudmFzLmhlaWdodCA9IHRoaXMubWV0ZXJIZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5tZXRlckNhbnZhcy5zdHlsZS53aWR0aCA9IGRpdi53aWR0aCArICdweCdcclxuICAgICAgICAgICAgdGhpcy5tZXRlckNhbnZhcy5zdHlsZS5oZWlnaHQgPSBkaXYuaGVpZ2h0ICsgJ3B4J1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlKHRoaXMubWV0ZXJDYW52YXMsIFNUWUxFU19NRVRFUiwgb3B0aW9ucy5zdHlsZXNNZXRlcilcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5tZXRlckNhbnZhcy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNhbGwgdGhpcyBhdCB0aGUgc3RhcnQgb2YgdGhlIGZyYW1lIHRvIGNhbGN1bGF0ZSBGUFNcclxuICAgICAqL1xyXG4gICAgZnJhbWUoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZnJhbWVOdW1iZXIrK1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLmxhc3RUaW1lXHJcblxyXG4gICAgICAgIC8vIHNraXAgbGFyZ2UgZGlmZmVyZW5jZXMgdG8gcmVtb3ZlIGdhcmJhZ2VcclxuICAgICAgICBpZiAoY3VycmVudFRpbWUgPiA1MDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5sYXN0VGltZSAhPT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0RlBTID0gTWF0aC5mbG9vcih0aGlzLmZyYW1lTnVtYmVyIC8gKGN1cnJlbnRUaW1lIC8gMTAwMCkpXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0RlBTID49IHRoaXMuRlBTIC0gdGhpcy50b2xlcmFuY2UgJiYgdGhpcy5sYXN0RlBTIDw9IHRoaXMuRlBTICsgdGhpcy50b2xlcmFuY2UpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0RlBTID0gdGhpcy5GUFNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmxhc3RUaW1lID0gcGVyZm9ybWFuY2Uubm93KClcclxuICAgICAgICAgICAgdGhpcy5mcmFtZU51bWJlciA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5mcHNTcGFuLmlubmVyVGV4dCA9IHRoaXMubGFzdEZQU1xyXG4gICAgICAgIGlmICh0aGlzLm1ldGVyQ2FudmFzICYmIHRoaXMubGFzdEZQUyAhPT0gJy0tJylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubWV0ZXJVcGRhdGUodGhpcy5sYXN0RlBTIC8gdGhpcy5GUFMpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1ldGVyVXBkYXRlKHBlcmNlbnQpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgYyA9IHRoaXMubWV0ZXJDYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBjLmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLm1ldGVyQ2FudmFzLndpZHRoLCB0aGlzLm1ldGVyQ2FudmFzLmhlaWdodClcclxuICAgICAgICBjLnB1dEltYWdlRGF0YShkYXRhLCAtMSwgMClcclxuICAgICAgICBjLmNsZWFyUmVjdCh0aGlzLm1ldGVyQ2FudmFzLndpZHRoIC0gMSwgMCwgMSwgdGhpcy5tZXRlckNhbnZhcy5oZWlnaHQpXHJcbiAgICAgICAgaWYgKHBlcmNlbnQgPCAwLjUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjLmZpbGxTdHlsZSA9IENvbG9yLm1peCgnI2ZmMDAwMCcsICcweGZmYTUwMCcsIHBlcmNlbnQgKiAyMDApLnRvSGV4U3RyaW5nKClcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYy5maWxsU3R5bGUgPSBDb2xvci5taXgoJyNmZmE1MDAnLCAnIzAwZmYwMCcsIChwZXJjZW50IC0gMC41KSAqIDIwMCkudG9IZXhTdHJpbmcoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBoZWlnaHQgPSAodGhpcy5tZXRlckNhbnZhcy5oZWlnaHQgLSB0aGlzLm1ldGVyTGluZUhlaWdodCkgKiAoMSAtIHBlcmNlbnQpXHJcbiAgICAgICAgYy5maWxsUmVjdCh0aGlzLm1ldGVyQ2FudmFzLndpZHRoIC0gMSwgaGVpZ2h0LCAxLCB0aGlzLm1ldGVyTGluZUhlaWdodClcclxuICAgIH1cclxuXHJcbiAgICBzaWRlKG9wdGlvbnMpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuc2lkZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuc2lkZSA9IG9wdGlvbnMuc2lkZS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNpZGUuaW5kZXhPZignbGVmdCcpICE9PSAtMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU1RZTEVTWydsZWZ0J10gPSAwXHJcbiAgICAgICAgICAgICAgICBkZWxldGUgU1RZTEVTWydyaWdodCddXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTVFlMRVNbJ3JpZ2h0J10gPSAwXHJcbiAgICAgICAgICAgICAgICBkZWxldGUgU1RZTEVTWydsZWZ0J11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zaWRlLmluZGV4T2YoJ3RvcCcpICE9PSAtMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU1RZTEVTWyd0b3AnXSA9IDBcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBTVFlMRVNbJ2JvdHRvbSddXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTVFlMRVNbJ2JvdHRvbSddID0gMFxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIFNUWUxFU1sndG9wJ11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTVFlMRVNbJ3JpZ2h0J10gPSAwXHJcbiAgICAgICAgICAgIFNUWUxFU1snYm90dG9tJ10gPSAwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19