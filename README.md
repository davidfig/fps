# yy-fps
A vanilla, easy-to-use FPS meter with colored graph and no dependencies or separate CSS files

## Features
* vanilla javascript written in typescript
* simple one call per loop
* no dependencies
* no CSS files required (styles can be changed by passing a style object)
* placement in any corner
* restyle any part
* toggle the meter on or off

## New v2
* rewrote entire codebase in typescript with same functionality as v1
* improved demo
* improved packaging

## Installation

    npm i yy-fps

    or

    copy the dist/fps.min.js file to your app, and include it:
    <script src="fps.min.js"></script>


## Simple Example

    import { FPS } from 'yy-fps'
    const fps = new FPS()

    // or if including the file directly:
    // const fps = FPS.FPS()

    // update function
    function update() {
        // do stuff like rendering and dancing

        fps.frame()

        requestAnimationFrame(update)
    }

    update()

## Live Example
https://davidfig.github.io/fps/

## Documentation
https://davidfig.github.io/fps/jsdoc

## License
MIT License
(c) 2021 [YOPEY YOPEY LLC](https://yopeyopey.com/) by [David Figatner](https://twitter.com/yopey_yopey/)
