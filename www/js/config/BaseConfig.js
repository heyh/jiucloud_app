/**
 * Created by Stomic on 2015/12/5.
 */
angular.module('baseConfig', ['routeConfig', 'httpConfig', 'pascalprecht.translate'])
  .config(function ($translateProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.swipeBackEnabled(false);
    /*config multi language*/
    $translateProvider.useStaticFilesLoader({
      files: [{
        prefix: './i18n/locale_',
        suffix: '.json'
      }]
    });
    $translateProvider.registerAvailableLanguageKeys(['en', 'zh'], {
      'en_*': 'en',
      'zh_*': 'zh'
    });
    //set preferred lang
    //$translateProvider.preferredLanguage('zh');
    //auto determine preferred lang
    $translateProvider.determinePreferredLanguage();
    //when can not determine lang, choose en lang.
    $translateProvider.fallbackLanguage('en');

        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('bottom');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('center');

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');

  })
  .config(function ($provide) {
    // Workaround for https://github.com/angular/angular.js/issues/10083
    $provide.decorator('$rootScope', ['$delegate', '$exceptionHandler',
      function ($delegate, $exceptionHandler) {
        var proto = Object.getPrototypeOf($delegate);
        var originalDigest = proto.$digest, originalApply = proto.$apply;
        proto.$digest = function () {
          if ($delegate.$$phase === '$digest' || $delegate.$$phase === '$apply') return;
          originalDigest.call(this);
        };
        proto.$apply = function (fn) {
          if ($delegate.$$phase === '$digest' || $delegate.$$phase === '$apply') {
            try {
              this.$eval(fn);
            } catch (e) {
              $exceptionHandler(e);
            }
          } else {
            originalApply.call(this, fn);
          }
        };
        return $delegate;
      }
    ]);
  }).
  config(function ($httpProvider) {
    $httpProvider.interceptors.push(['$rootScope', '$q',
      function ($rootScope, $q) {
        return {
          'request': function (config) {
            //处理AJAX请求（否则后台IsAjaxRequest()始终false）
            config.headers['X-Requested-With'] = 'XMLHttpRequest';
            return config || $q.when(config);
          },
          'requestError': function (rejection) {
            return rejection;
          },
          'response': function (response) {
            return response || $q.when(response);
          },
          'responseError': function (response) {
            return $q.reject(response);
          }
        };
      }]);
  });
