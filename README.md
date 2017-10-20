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
## License  
MIT License  
(c) 2017 [YOPEY YOPEY LLC](https://yopeyopey.com/) by [David Figatner](https://twitter.com/yopey_yopey/)
