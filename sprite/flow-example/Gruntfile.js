module.exports = function (grunt) {
  // Configure grunt
  grunt.initConfig({
    sprite:{
      all: {
        src: 'WebContent/*.png',
        dest: 'WebContent/dest/spritesheet.png',
        destCss: 'WebContent/dest/sprites.css'
      }
    }
  });

  // Load in `grunt-spritesmith`
  grunt.loadNpmTasks('grunt-spritesmith');
}
