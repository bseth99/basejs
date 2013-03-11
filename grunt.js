module.exports = function( grunt ) {

grunt.initConfig({

   pkg: '<json:package.json>',

   concat: {
      dist: {
         src: [ "src/base.js" ],
         dest: "base.js"
      }
   },

   min: {
      "base.min.js": [ "base.js" ]
   }

});

grunt.registerTask( "default", "concat min" );

};
