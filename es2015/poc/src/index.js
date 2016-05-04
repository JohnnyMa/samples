require.config({  
    baseUrl: 'dist/'
});

require(['main'], function(main) {  
    new main.default();
});