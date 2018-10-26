# Tear-able Cloth in Web Worker

[DEMO](http://volodalexey.github.io/cloth-web-worker)

## History

You can can see a lot of examples of this cloth in the internet.

Under the hood is used [Verlet integration scheme](http://www.gamasutra.com/resource_guide/20030121/jacobson_pfv.htm) by Thomas Jakobsen.

I faced with this cloth on the [Lonely-pixel](http://lonely-pixel.com) but it is not alive any more.

Take a look at [Creating a tear able cloth in javascript](http://blog.michaelpolycarpou.com/blog/2014/08/21/creating-a-tearable-cloth-in-javascript/) how to implement it.

Or just see the result at github [Tearable-Cloth](https://github.com/Dissimulate/Tearable-Cloth).

I refactored almost all code. Split it into pieces/modules.

## What is the difference from other clothes?

When I faced with the limitation of one thread in Browser, I implemented calculation of all points/constrains in separate thread.