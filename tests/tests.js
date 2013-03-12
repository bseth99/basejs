
module("Prototyping Checks");

/**
* Validate the starting Base object is setup as expected.
*/

test( "Check for Base and Confirm members", function() {

   ok( Base instanceof Object, "Base is an instance of Object" );
   ok( Base instanceof Function, "Base is an instance of Function" );
   ok( typeof(Base) == 'function', "Base is an type of Function" );

   var s = 0;
   $.each( Base, function ( m ) {
      s++;
   });

   var p = 0;
   $.each( Base.prototype, function ( m ) {
      p++;
   });

   ok( (Base.extend && typeof( Base.extend ) == 'function'), "extend() exists and is a function" );
   ok( (Base.mix && typeof( Base.extend ) == 'function'), "mix() exists and is a function" );
   ok( (s === 2), "Base has 2 static members" );
   ok( (p === 0), "Base has an empty prototype" );
});

/**
* Check single inheritance.  Validate parent is not affected by
* the prototyping process
*/

test( "Extend Sub1 from Base and Confirm members", function() {

   var Sub1 = Base.extend({
      constructor: function () {},
      init: function () {},
      a_string: "string",
      a_date: new Date(),
      a_number: 100,
      a_array: [1,2,3],
      a_object: { x: 1 },
      a_bool: true
   });

   ok( Sub1 instanceof Object, "Sub1 is an instance of Object" );
   ok( Sub1 instanceof Function, "Sub1 is an instance of Function" );
   ok( typeof(Sub1) == 'function', "Sub1 is an type of Function" );

   var s = 0;
   $.each( Sub1, function ( m ) {
      s++;
   });

   var p = 0;
   $.each( Sub1.prototype, function ( m ) {
      p++;
   });

   ok( (Sub1.extend && typeof( Sub1.extend ) == 'function'), "extend() exists and is a function" );
   ok( (Sub1.mix && typeof( Sub1.extend ) == 'function'), "mix() exists and is a function" );
   ok( (s === 2), "Sub1 has 2 static members" );
   ok( (p === 7), "Sub1 has 7 prototype members" );


   ok( (Sub1.prototype.init && $.isFunction(Sub1.prototype.init)), "Sub1 prototype has an init function" );
   ok( (Sub1.prototype.a_string && typeof(Sub1.prototype.a_string) == 'string'), "Sub1 prototype has an a_string member and its a string" );
   ok( (Sub1.prototype.a_date && Sub1.prototype.a_date instanceof Date), "Sub1 prototype has an a_date member and its a date" );
   ok( (Sub1.prototype.a_number && typeof(Sub1.prototype.a_number) == 'number'), "Sub1 prototype has an a_number member and its a number" );
   ok( (Sub1.prototype.a_array && $.isArray(Sub1.prototype.a_array)), "Sub1 prototype has an a_array member and its a array" );
   ok( (Sub1.prototype.a_object && typeof(Sub1.prototype.a_object) == 'object'), "Sub1 prototype has an a_object member and its a object" );
   ok( (Sub1.prototype.a_bool && typeof(Sub1.prototype.a_bool) == 'boolean'), "Sub1 prototype has an a_bool member and its a boolean" );

   deepEqual( Sub1.prototype.a_array, [1,2,3], "Sub1 prototype member a_array has correct value" );
   deepEqual( Sub1.prototype.a_object, { x: 1 }, "Sub1 prototype member a_object has correct value" );

});

/**
* Check multiple inheritance.  Validate parent is not affected by
* the prototyping process
*/

test( "Extend Sub2 from Sub1 ensure Sub1 is unchanged", function() {

   var Sub1 = Base.extend({
      constructor: function () {},
      init: function () {},
      a_string: "string",
      a_date: new Date(),
      a_number: 100,
      a_array: [1,2,3],
      a_object: { x: 1 },
      a_bool: true
   });

   var Sub2 = Sub1.extend({
      init: function () {},
      foo: function () {},
      a_string: "string2",
      a_date: null,
      a_number: 500,
      a_array: [2,3,4],
      a_object: { x: 5 },
      a_bool: false
   });

   ok( Sub1 instanceof Object, "Sub1 is an instance of Object" );
   ok( Sub1 instanceof Function, "Sub1 is an instance of Function" );
   ok( typeof(Sub1) == 'function', "Sub1 is an type of Function" );

   var s = 0;
   $.each( Sub1, function ( m ) {
      s++;
   });

   var p = 0;
   $.each( Sub1.prototype, function ( m ) {
      p++;
   });

   ok( (Sub1.extend && typeof( Sub1.extend ) == 'function'), "extend() exists and is a function" );
   ok( (Sub1.mix && typeof( Sub1.extend ) == 'function'), "mix() exists and is a function" );
   ok( (s === 2), "Sub1 has 2 static members" );
   ok( (p === 7), "Sub1 has 7 prototype members" );

   equal( Sub1.prototype.a_string, 'string', "Sub1 prototype member a_string has correct value" );
   ok( Sub1.prototype.a_date !== null, "Sub1 prototype member a_date has correct value" );
   equal( Sub1.prototype.a_number, 100, "Sub1 prototype member a_number has correct value" );
   deepEqual( Sub1.prototype.a_array, [1,2,3], "Sub1 prototype member a_array has correct value" );
   deepEqual( Sub1.prototype.a_object, { x: 1 }, "Sub1 prototype member a_object has correct value" );
   equal( Sub1.prototype.a_bool, true, "Sub1 prototype member a_bool has correct value" );

});

/**
* Check multiple inheritance.  Validate property merging
*/

test( "Extend Sub2 from Sub1 and Confirm members", function() {

   var Sub1 = Base.extend({
      constructor: function () {},
      init: function () {},
      foo: function () {},
      a_string: "string",
      a_date: new Date(),
      a_number: 100,
      a_array1: [1,2,3,0],
      a_array2: [{ a: 1, x: 2 },2,1],
      a_array4: [9,7,8],
      a_object1: { x: 1 },
      a_object2: { x: 9 },
      a_object4: { n: 5 },
      a_bool: true
   });

   var Sub2 = Sub1.extend({
      foo: function () {},
      bar: function () {},
      a_string: "string2",
      a_date: null,
      a_number: 500,
      a_array1: [0,2,3,4],
      a_array2: [{ a: 5, z: 2 },8,9],
      a_array3: [5,3,1],
      a_object1: { x: 5 },
      a_object2: { y: 7 },
      a_object3: { m: 9 },
      a_bool: false
   });

   ok( Sub2 instanceof Object, "Sub2 is an instance of Object" );
   ok( Sub2 instanceof Function, "Sub2 is an instance of Function" );
   ok( typeof(Sub2) == 'function', "Sub2 is an type of Function" );

   var s = 0;
   $.each( Sub2, function ( m ) {
      s++;
   });

   var p = 0;
   $.each( Sub2.prototype, function ( m ) {
      p++;
   });

   ok( (Sub2.extend && typeof( Sub2.extend ) == 'function'), "Sub2.extend() exists and is a function" );
   ok( (Sub2.mix && typeof( Sub2.extend ) == 'function'), "Sub2.mix() exists and is a function" );
   ok( (s === 2), "Sub2 has 2 static members" );
   ok( (p === 15), "Sub2 has 15 prototype members" );

   equal( Sub2.prototype.a_string, 'string2', "Sub2 prototype member a_string has correct value" );
   equal( Sub2.prototype.a_date, null, "Sub2 prototype member a_date has correct value" );
   equal( Sub2.prototype.a_number, 500, "Sub2 prototype member a_number has correct value" );

   deepEqual( Sub2.prototype.a_array1, [0,2,3,4], "Sub2 prototype member a_array1 has correct value" );
   deepEqual( Sub2.prototype.a_array2, [{ a: 5, x: 2, z: 2 },8,9], "Sub2 prototype member a_array2 has correct value" );
   deepEqual( Sub2.prototype.a_array3, [5,3,1], "Sub2 prototype member a_array3 has correct value" );
   deepEqual( Sub2.prototype.a_array4, [9,7,8], "Sub2 prototype member a_array4 has correct value" );

   deepEqual( Sub2.prototype.a_object1, { x: 5 }, "Sub2 prototype member a_object1 has correct value" );
   deepEqual( Sub2.prototype.a_object2, { x: 9, y: 7 }, "Sub2 prototype member a_object2 has correct value" );
   deepEqual( Sub2.prototype.a_object3, { m: 9 }, "Sub2 prototype member a_object3 has correct value" );
   deepEqual( Sub2.prototype.a_object4, { n: 5 }, "Sub2 prototype member a_object4 has correct value" );

   equal( Sub2.prototype.a_bool, false, "Sub2 prototype member a_bool has correct value" );

});

/**
* Make sure static members are retained/added during prototyping
*/

test( "Test static members and ensure they are preserved", function() {

   var Sub1 = Base.extend({
      constructor: function () {},
      init: function () {},
      foo: function () {}
   },{
      static_method1: function () {},
      static_prop1: 'string1',
      static_method2: function () {},
      static_prop2: 'string2'
   });

   var Sub2 = Sub1.extend({
      foo: function () {},
      bar: function () {}
   },{
      static_method2: function () {},
      static_prop2: 'string2_O',
      static_method3: function () {},
      static_prop3: 'string3'
   });

   var s = 0;
   $.each( Sub1, function ( m ) {
      s++;
   });

   ok( (s === 6), "Sub1 has 6 static members" );

   var s = 0;
   $.each( Sub2, function ( m ) {
      s++;
   });

   ok( (s === 8), "Sub2 has 8 static members" );

   ok( Sub1.extend === Sub2.extend, "Sub1.extend and Sub2.extend is the same" );
   ok( Sub1.mix === Sub2.mix, "Sub1.mix and Sub2.mix is the same" );

   ok( Sub1.static_method1 === Sub2.static_method1, "Sub1.mix and Sub2.mix is the same" );
   ok( Sub1.static_prop1 === Sub2.static_prop1, "Sub1.mix and Sub2.mix is the same" );

   ok( Sub1.static_method2 !== Sub2.static_method2, "Sub1.static_method2 and Sub2.static_method2 are NOT the same" );
   ok( Sub1.static_prop2 !== Sub2.static_prop2, "Sub1.static_prop2 and Sub2.static_prop2 are NOT the same" );

   ok( typeof(Sub1.static_method3) === 'undefined', "Sub1 does not have static_method3" );
   ok( typeof(Sub2.static_method3) !== 'undefined', "Sub2 DOES have static_method3" );
   ok( typeof(Sub1.static_prop3) === 'undefined', "Sub1 does not have static_method3" );
   ok( typeof(Sub2.static_prop3) !== 'undefined', "Sub2 DOES have static_method3" );

});

/**
* Check that adding mixins results in the expected
* definition
*/

test( "Test mixins are added", function() {

   var Mix1 = {

      mix_method1: function () {},
      mix_prop1: 'string1',
      mix_prop2: { a: 1, b: 2, m: 10 }

   };

   var Mix2 = {

      mix_method2: function () {},
      mix_prop1: 'string2',
      mix_prop2: { m: 20, x: 3, y: 4 }

   };

   var Sub1 = Base.extend([Mix1, Mix2], {
      foo: function () {}
   });

   var p = 0;
   $.each( Sub1.prototype, function ( m ) {
      p++;
   });

   ok( (p === 5), "Sub1 has 5 prototype members" );

   equal( Sub1.prototype.mix_prop1, 'string2', "Sub1 prototype member mix_prop1 has correct value" );

   deepEqual( Sub1.prototype.mix_prop2, { a: 1, b: 2, m: 20, x: 3, y: 4 }, "Sub1 prototype member mix_prop2 has correct value" );

});

module("Instance Checks");

/**
* Validate that instanceof will be true as expected
*/

test( "Validate prototype chain is intact", function() {

   var Animal = Base.extend({});

   var a = new Animal();

   ok( a instanceof Animal, "Instance a is an Animal object");
   ok( a instanceof Base, "Instance a is an Base object");
   ok( a instanceof Object, "Instance a is an Object object");

   var Dog = Animal.extend({});

   var d = new Dog();

   ok( d instanceof Dog, "Instance d is an Dog object");
   ok( d instanceof Animal, "Instance d is an Animal object");
   ok( d instanceof Base, "Instance d is an Base object");
   ok( d instanceof Object, "Instance d is an Object object");

});

/**
* Build an inheritance path Base --> Animal --> Dog
* Mix in Tricks and Habits to Dog
*
* Run all the functions and make sure they execute in the
* expected order
*
* Children must explicitly call _super() to invoke parent's
* funtionality.
*
* Function collisions with Mixins will execute the chain
* automatically unless _superStop() is called
*/
test( "Validate call sequencing", function() {

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

   // Tricks --> Habits --> Dog
   // instead of
   // Dog --> Tricks --> Habits
   // Dog.mix([Habits, Tricks]);

   var a = new Dog();

   a.eat();
   a.sleep();
   a.roam();
   a.rollover();
   a.speak();
   a.chaseTail();
   a.special();

   deepEqual( log,
              [
                  'Animal.constructor',
                  'Animal.init',
                  'Animal.eat',
                  'Dog.eat',
                  'Dog.sleep',
                  'Animal.sleep',
                  'Animal.roam',
                  'Tricks.rollover',
                  'Tricks.speak',
                  'Habits.chaseTail',
                  'Dog.special',
                  'Tricks.special',
                  'Habits.special'
              ],
              "Call sequence matches expected" );

});

/**
* Check that function parameters and return values
* are maintained across the call chains
*/
test( "Validate arguments and return values", function() {

   var Mix1 = {

      all: function ( x ) { return x; },
      undef: function ( x ) { return x; },
      undef2: function ( x ) { },
      args1: function ( x ) { return x; },
      args2: function ( ) { }

   };

   var Mix2 = {

      all: function ( x ) { return x; },
      skip: function ( x ) { return x; },
      undef: function ( x ) { },
      undef2: function ( x ) { return x; },
      args1: function ( ) { },
      args2: function ( x ) { return x; }

   };

   var Sub1 = Base.extend([Mix2, Mix1], {

      all: function ( x ) { return x; },
      skip: function ( x ) { return x; },
      undef: function ( x ) { return x; },
      undef2: function ( x ) { return x; },
      args2: function ( x ) { return x; }

   });

   var s = new Sub1();

   equal( s.all(1), 1, "all() returned the expected result" );
   equal( s.skip(4), 4, "skip() returned the expected result" );
   equal( s.undef(5), 5, "undef() returned the expected result" );
   equal( s.undef2(7), 7, "undef2() returned the expected result" );
   equal( s.args1(2), 2, "args1() returned the expected result" );
   equal( s.args2(3), 3, "args2() returned the expected result" );

});