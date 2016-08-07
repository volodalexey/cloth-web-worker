# Tear-able Cloth in Web Worker

[DEMO](http://volodalexey.github.io/cloth-web-worker)

## History

Originally this tear-able cloth was made by ... I don't know )).

You can can see a lot of examples of this cloth in the internet.

I faced with this cloth on the [Lonely-pixel](http://lonely-pixel.com) but it is not alive any more.

Take a look at [Creating a tear able cloth in javascript](http://blog.michaelpolycarpou.com/blog/2014/08/21/creating-a-tearable-cloth-in-javascript/) how to implement it.

Or just see the result at github [Tearable-Cloth](https://github.com/Dissimulate/Tearable-Cloth).

I refactored almost all code. Split it into pieces/modules.

However it is still requires refactoring to do all things in pure-functions.

## What is the difference from other clothes?

When I faced with the limitation of one thread in Browser, I implemented calculation of all points/constrains in separate thread.

You can compare these examples in [SINGLE thread](http://volodalexey.github.io/cloth-web-worker/index.single.html) and in [Web Worker](http://volodalexey.github.io/cloth-web-worker/index.worker.html).

## Performance

Initial data: 100x100 points, calculation of each constrain 2 times

On my laptop it shows:
 - 16.5 fps in SINGLE thread
 - 28 fps in Web Worker, however visually it looks more deterministic than in SINGLE thread

If you increase the number of elements, it shows that you can not benefit too much from Web Worker.

## Workflow with Web Worker

Main thread sends command to start calculation, Web Worker begins to calculate each constrain per 1000/120 ms.

Main thread on each animation frame sends command to retrieve constrains position (so on current animation frame it draws previous positions).

Web Worker returns all constrains in Float64Array.

On mouse event main thread sends mouse data to Web Worker, so it can take into account new forces.