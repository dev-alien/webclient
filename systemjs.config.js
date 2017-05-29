(function (global) {
    System.config({
        paths: {
            'npm:': 'node_modules/'
        },
        map: {
            app: 'app',
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            'rxjs': 'npm:rxjs',
            'ng2-google-recaptcha': 'node_modules/ng2-google-recaptcha',
            'ng2-overlay': 'node_modules/ng2-overlay/dist',
            '@angular2-material': 'node_modules/@angular2-material',
            '@angular2-material/core': 'npm:@angular2-material/core/core.umd.js',
            '@angular2-material/card': 'npm:@angular2-material/card/card.umd.js',
            '@angular2-material/button': 'npm:@angular2-material/button/button.umd.js',
            '@angular2-material/icon': 'npm:@angular2-material/icon/icon.umd.js',
            'angular2-perfect-scrollbar': 'node_modules/angular2-perfect-scrollbar/bundles/angular2-perfect-scrollbar.umd.js'
        },
        packages: {
            app: {
                main: './main.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            },
            'ng2-google-recaptcha': { main: 'index.js', defaultExtension: 'js' }
        }
    });
})(this);