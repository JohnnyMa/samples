define([], function () {
    'use strict';

    require.config({
        baseUrl: 'dist/'
    });

    require(['main'], function (main) {
        new main.default();
    });
});
//# sourceMappingURL=index.js.map
