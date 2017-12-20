# yy-fps
Yet another FPS indicator with graph

## features
* simple one call per loop
* fully customizeable and styleable

## rationale

My rationale, sadly, is that the existing npm libraries either did not have live demos or did not support modules. Totally worth an afternoon of work in terms of enjoyment.

## installation

    npm i yy-fps

## simple example

    const FPS = require('yy-fps')
    const Loop = require('yy-loop')

    const fps = new FPS()

    // start a loop
    const loop = new Loop()
    loop.add(update)
    loop.start()

    // update function
    function update()
    {
        fps.frame()

        // do stuff like rendering and dancing
    }

## live example
https://davidfig.github.io/fps/

## API
```js
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
    constructor(options)

    /**
     * change desired FPS
     * @type {number}
     */
    get fps()

    /**
     * remove meter from DOM
     */
    remove()

    /**
     * @type {boolean} meter (the FPS graph) is on or off
     */
    get meter()

    /**
     * call this at the start of the frame to calculate FPS
     */
    frame()

```
## License  
MIT License  
(c) 2017 [YOPEY YOPEY LLC](https://yopeyopey.com/) by [David Figatner](https://twitter.com/yopey_yopey/)
