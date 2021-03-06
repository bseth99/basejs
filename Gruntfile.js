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

   uglify: {
      "base.min.js": [ "<banner>", "base.js" ]
   },

   jshint: {
      options: {
         jshintrc: ".jshintrc"
      },
      files: {
        src: [ "src/base.js" ]
      }
   }

});

grunt.loadNpmTasks( "grunt-contrib-jshint" );
grunt.loadNpmTasks( "grunt-contrib-uglify" );
grunt.loadNpmTasks( "grunt-contrib-concat" );

grunt.registerTask( "default", [ "jshint", "concat", "uglify" ] );

};
