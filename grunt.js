module.exports = function( grunt ) {

grunt.initConfig({

   pkg: '<json:package.json>',

   meta: {
      banner: "/*! <%= pkg.name %>: <%= pkg.title %> (v<%= pkg.version %> built <%= grunt.template.today('isoDate') %>)\n" +
              "<%= pkg.homepage ? '* ' + pkg.homepage + '\n' : '' %>" +
              "* Copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>;" +
              " Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %> */"
   },

   concat: {
      dist: {
         src: [ "src/base.js" ],
         dest: "base.js"
      }
   },

   min: {
      "base.min.js": [ "<banner>", "base.js" ]
   }

});

grunt.registerTask( "default", "concat min" );

};
