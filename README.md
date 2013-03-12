BaseJS
=========

#### Helper Library for Prototyping Javascript Objects ####

BaseJS provides methods for building object inheritance and
mixing object definitions to promote consistent, reusable
patterns.  The objective of this project was to learn the
different concepts related to Javascript Prototypal Inheritance
add extra functionality where there seemed to be a gap in the
built-in features.

### Features ###

- Does not depend on any other library
- Provides a root object definition Base that can be extended to create new object classes via `extend()` method
- Handles function collisions and creates `_super()`, `_superApply()`, and `_superStop()` to enable invoking parent functionality seemlessly in child implementation
- Allows additional objects to be "mixed" into the object prototype and chains function name collisions automatically
- Adds support to ensure constructor is called with "new"
- Inserts a `_guid` property on each instance to help with debugging


Usage
---------------

To use BaseJS in your application, either download the 
[Minified](https://raw.github.com/bseth99/basejs/master/base.min.js) or 
[Full](https://raw.github.com/bseth99/basejs/master/base.js) version and copy it to a suitable location. 
Then include it in your HTML like so:

    <script type="text/javascript" src="/path/to/base.js"></script>


### Basics ###

The library contains a starting object Base which contains two static members - `extend()` and `mix()`.  To start
prototyping a new object definition, call `Base.extend()`:


      var Sub = Base.extend({

         do_something: function() {

         }

      });

      var s = new Sub();

`Base.extend()` will return a function with a prototype that has the function `do_something()` defined.  Additionally, `Sub` is a child of `Base` and 
will also contain the static members `extend()` and `mix()` which can be used to define new objects (via `extend`) or further enhance `Sub` (via `mix`):

      var Sub2 = Sub.extend({

         do_more: function() {

         }

      });

      var s = new Sub2();

Now `Sub2` is a child of `Sub` and `Base`.  Anything defined in `Sub` will also be available in `Sub2`.  If you want a constructor, you can either
pass it in the object hash or define it prior to calling extend:


      var Sub = Base.extend({

         constructor: function() {
            // initialize
         }

      });
   
or

      var Sub = function() {
         // initialize
      };

      Sub = Base.extend(Sub);

However, in the latter, you'd have to setup `Sub.prototype` outside `Base.extend()`.  


### Overrides and Chaining ###

Whenever there is an collision between a parent and child method, the library will wrap the colliding methods and
enable a means to call the parent's method from the child method via the `_super()` function.  The `_super()` function
refers only to the immediate parent of the child object.  If more than one object is in the chain, each ancester needs
to explicitly call `_super()` to continue invoking the next parent in the chain.  The exception is constructor and mixin
conllisions.  Constructors will automatically chain from the child up to the top-most parent automatically.  Collisions 
with mixin functions will also chain.  If you want to stop this behavior, call `_superStop()` to cancel the chaining to the
next parent.

      var Sub1 = Base.extend({

         constructor: function() {
            // initialize Sub1
         },

         foo: function() {
            // Sub1.foo
         }

      });

      var Sub2 = Sub1.extend({

         constructor: function() {
            // initialize Sub2
         },

         foo: function() {
            // override Sub1.foo
            // Call Sub1.foo
            this._super();
         },

         bar: function() {
            // Sub2.bar
         }

      });


      var Sub3 = Sub2.extend({

         constructor: function() {
            // initialize Sub3 
            // Implicit chaining to all the ancestors
            // Sub3 --> Sub2 --> Sub1
            // Could call this._superStop() to prevent
            // Sub2 and Sub1 from executing
         },

         bar: function() {
            // override Sub2.bar
            // Sub2.bar will not run
         }

      });   
   

### Object Properties ###

If there are properties defined on both the child and parent objects, the child will override the 
parent on all primative types.  Objects and Arrays will try to intelligently merge them when possible
using a deep comparison method:

      var Sub1 = Base.extend({

         a_string: 'string',      
         a_object: { x: 1, y: 2 },      
         a_array: [0,1,2]

      });

      var Sub2 = Sub1.extend({

         a_string: 'string2',      
         a_object: { y: 5, z: 3 },      
         a_array: [0,2,2,4]

      });
       
The prototype for `Sub2` would look like this after extending Sub1:

      a_string: 'string2',  /* child overrides */
      a_object: { x: 1, y: 5, z: 3 },  /* child overrides collisions, merges parent and child definitions */
      a_array: [0,2,2,4] /* each matching index is checked, sub-objects will be merge recursively, primatives overwritten.  Missing indexes added */

   
### Mixins ###

Additional objects variables can be defined with properties and functions to mix into an object definitions prototype.  This can be in the `extend()` call
or using the `mix()` function after defining the object with `extend()`:

      var Mix = {

         var1: 10,
         sum: function ( s ) {
            return this.var1 + s;
         }
      };
   
This object can be mixed:

      var Sub1 = Base.extend([Mix], {

         ...

      });   

or 

      var Sub1 = Base.extend({

         ...

      });  

      Sub1.mix([Mix]);

There is a difference in the two approaches.  In the former, any collisions between `Mix` and `Sub1` will result in a chain from `Sub1` to `Mix` and in the latter,
`Mix` will be called first then `Sub1`.  So if both `Mix` and `Sub1` implement a `sum()` function, the first case will call `sum()` in `Sub1` first followed by `sum()` in
`Mix`.  It will call in the opposite order in the second case.  The benefit of using `mix()` directly is you can control how collisions are handled.  By default, functions
are setup to automatically chain to each other and properties are merged (Objects and Arrays).  The option second argument to `mix()` enables finer control of this 
behavior by allowing a hash that specifies various options.  The general form of `mix` is:

      <Function>.mix(mixins, options);
      
      mixins = Array // ie [Mix1..MixN]
      options = 
      
       {
         functions: < true|false|Object >,
         properties: < true|false|Object >
       }
       
For functions, `true` means to auto-chain the collisions (`_superStop` can be to halt the chaining), `false` indicates it will be done manually via `_super`.  An
object hash of each function can be provided to override the behavior on a function-by-function basis.  If you have the following function defined:

      var Mix = {
         foo: function () {},
         bar: function () {}
      };
      
Then, `options.functions` can be set:

      {
         foo: false,         
         bar: true
      }

To cause `foo` not to auto-chain and `bar` to auto-chain.  The `properties` option follows the same rules.  In this case, `true` will attempt to merge collisions,
`false` will not, and an hash of properties will allow individual property-by-property control of the behavior.

A complete example that overrides at the function/property level might look like this:

      var Mix = {
         foo: function () {},
         bar: function () {},
         prop1: { x: 1, y: 2 },
         prop2: [0,1,2]
      };
      
      var Sub1 = Base.extend({
         ...
      });  

      Sub1.mix([Mix], {
         functions: {
            foo: false,
            bar: true
         },
         properties: {
            prop1: true,
            prop2: false
         }
      });
      

More than one object can be mixed at a time:

      var MixA = {      
         run: function () {}
      };

      var MixB = {      
         run: function () {}
      };

      var Sub1 = Base.extend([MixA, MixB], {   
         run: function () {}     
      }); 
   
Since all of the object define `sum()`, it will be automatically called on each object from the `Sub1`, then `MixB`, then `MixA`.  The order of presidence is from
right to left (child first, last mixin in the array, second to last mixin, and so on.

Finally, when using `extend()`, mixins can also be functions, with constructors and a prototype.  As each mixin is added, the contructor will be added to the call
chain after both the child and parent constructors are called.  When multiple mixins have contructors defined, the presidence is from left to right based on how they
are passed to `extend()` in the array:

      
      var MixA = function () {
         // constructor for MixA
      }
      
      MixA.prototype.run = function () {
         // define a function on the prototype
      }
      
      var MixB = {
         construnctor: function () {
            // constructor for MixB
         },
         
         run: function () {
         }
      };
      
      var Sub1 = Base.extend([MixA, MixB], {   
         construnctor: function () {
            // constructor for Sub1
         }
      }); 
      
Here, both alternatives for defining the constructor are shown.  `Sub1.constructor` will execute first, followed by `Base.constructor` (which is empty), then 
`MixB.constructor`, and finally, `MixA.constructor`.

You might be tempted to create mixins from a common ancestor.  Be careful with this approach when mixing in two or more mixins derived from the same base object.
Since there will most likely be collisions with common functions, they will be setup to chain.  It is possible cause duplicate calls due to the overlap.  At this
time, nothing in the library will detect this condition and resolve the extra calls.

   
### Static Methods/Properties ###

An optional object can be provided after the prototype definition that represents static properties and/or methods to add to the object:

      var Sub1 = Base.extend({

         /* prototype properties/methods */

      }, {

         /* static properties/methods */

      }); 


You can also do this when adding mixins as well:

      var Sub1 = Base.extend([MixA, MixB], {

         /* prototype properties/methods */

      }, {

         /* static properties/methods */

      }); 




Example
---------------

This example is taken from one of the [unit test cases](http://bseth99.github.com/basejs/tests/run.html) and shows the most common usage:

      var log = [];

      var Animal = Base.extend({

         constructor: function () {
            log.push('Animal.constructor');

            this.init();
         },

         init: function () {
            log.push('Animal.init');
         },

         state: 'sleep',

         eat: function () {
            log.push('Animal.eat');

            this.state = 'eat';
         },

         sleep: function () {
            log.push('Animal.sleep');

            this.state = 'sleep';
         },

         roam: function () {
            log.push('Animal.roam');

            this.state = 'roam';

         }

      });

      var Tricks = {

         speak: function () {
            log.push('Tricks.speak');
         },

         rollover: function () {
            log.push('Tricks.rollover');
         },

         special: function () {
            log.push('Tricks.special');
         }

      };

      var Habits = {

         chaseTail: function () {
            log.push('Habits.chaseTail');
         },

         special: function () {
            log.push('Habits.special');
         }

      };

      var Dog = Animal.extend([Habits, Tricks], {

         eat: function () {
            this._super();
            log.push('Dog.eat');
         },

         sleep: function () {
            log.push('Dog.sleep');
            this._super();
         },

         special: function () {
            log.push('Dog.special');
         }

      });

      var a = new Dog();

      a.eat();
      a.sleep();
      a.roam();
      a.rollover();
      a.speak();
      a.chaseTail();
      a.special();

      console.log( log );

