module.exports = function(grunt) {
    grunt.initConfig({
        "babel": {
            options: {
                sourceMap: true,
                presets: ['es2015'],
                plugins: ['transform-es2015-modules-amd']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.js'],
                    dest: 'dist'
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-babel');
    grunt.registerTask("default", ["babel"]);
};