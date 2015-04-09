(function () {
    angular.module('gMain', ['main.tpls', 'ionic', 'angular-locker'])
        // providers
        .provider('privateState', function () {
            this.$get = function () {
                return {};
            };

            this.get = function (obj) {
                return angular.extend({
                    resolve: {
                        user: function (UserService) {
                            return UserService.init();
                        }
                    }
                }, obj);
            };
        })
        // services
        .service('UserService', ['$q', '$state', '$timeout', 'locker', 'http', 'conf', function ($q, $state, $timeout, locker, http, conf) {

            var initialized = false;
            var user = {};

            return {
                init: function () {
                    var deferred = $q.defer();

                    if (initialized === false) {
                        user = locker.get('user');
                        initialized = true;
                    }

                    if (user && user.hasOwnProperty('token')) {
                        http.setToken(user.token);
                    }

                    $timeout(function () {
                        if (user) {
                            deferred.resolve(user);
                        } else {
                            deferred.reject({error: "noUser"});
                        }
                    }, 100);

                    return deferred.promise;
                },

                login: function (userName, password) {
                    return http.post('/auth/validateCredentials', {user: userName, password: password})
                        .success(function (response) {
                            if (response.status) {
                                user = {
                                    user: userName,
                                    token: response.token,
                                    version: conf.version
                                };
                                http.setToken(user.token);
                                locker.put('user', user);
                                return user;
                            } else {
                                return $q.reject(response);
                            }

                        })
                        .error(function (response) {
                            return $q.reject(response);
                        });
                },

                logout: function () {
                    user = {};
                    http.setToken(undefined);
                    locker.forget('user');
                    $state.go('_login', {});
                }
            };
        }])
        // factories
        .factory('_', ['Lang', 'MainLang', 'conf', function (Lang, MainLang, conf) {
            return function (key) {
                if (Lang.hasOwnProperty(key)) {
                    return Lang[key][conf.lang] || key;
                } else if (MainLang.hasOwnProperty(key)) {
                    return MainLang[key][conf.lang] || key;
                } else {
                    return key;
                }
            };
        }])

        .factory('alert', ['$ionicPopup', function ($ionicPopup) {
            return function (message, title) {
                $ionicPopup.alert({
                    title: title,
                    template: message
                });
            };
        }])

        .factory('confirm', ['$ionicPopup', function ($ionicPopup) {
            return function (message, title, ok, nok) {
                var confirmPopup = $ionicPopup.confirm({
                    title: title,
                    template: message
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        if (ok) ok();
                    } else {
                        if (nok) nok();
                    }
                });
            };
        }])

        .factory('http', ['$http', '$state', '$ionicLoading', '$rootScope', '_', 'alert', 'conf', function ($http, $state, $ionicLoading, $rootScope, _, alert, conf) {
            var serviceHost = conf.host;
            var token;
            var handleSuccess = function (data, status) {
                $ionicLoading.hide();
                if (status == 206) {
                    $rootScope.$emit('wrong.regid');
                }
            };

            var handleHTTPErrors = function (err, status) {
                $ionicLoading.hide();
                switch (status) {
                    case 403:
                        alert(_('tokenError'));
                        $rootScope.$emit('logout');
                        break;
                }
            };

            var extendParams = function (params) {
                params = params || {};
                return angular.extend({
                    _token: token,
                    _version: conf.version,
                    _unique: new Date().getTime()
                }, params);

            };
            var http = {
                setToken: function (_token) {
                    token = _token;
                },

                getBackground: function (uri, params) {
                    return http.get(uri, params, true);
                },

                postBackground: function (uri, params) {
                    return http.post(uri, params, true);
                },

                get: function (uri, params, hideLoading) {
                    if (!hideLoading) {
                        $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
                    }
                    params = extendParams(params);

                    return $http
                        .get(serviceHost + uri, {params: params})
                        .success(handleSuccess).error(handleHTTPErrors);
                },

                post: function (uri, params, hideLoading) {
                    if (!hideLoading) {
                        $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
                    }
                    params = extendParams(params);
                    return $http
                        .post(serviceHost + uri, params)
                        .success(handleSuccess).error(handleHTTPErrors);
                }
            };

            return http;
        }])
        // filters
        .filter('_', ['_', function (_) {
            return function (key) {
                return _(key);
            };
        }])
        // values
        .value('MainLang', {
            "Not valid credentials": {
                en: "Not valid authentication. Please insert again your credentials",
                es: "credenciales de acceso no válidas. Por favor inténtelo de nuevo"
            },
            "Please Upgrade": {
                en: "You don't have the correct version version of the APP. Please upgrade.",
                es: "No tiene la última versión de la aplicación. Por favor actualicela"
            },
            "Upgrade": {
                en: "Upgrade",
                es: "Actualizar"
            },
            "Login": {
                en: "Login",
                es: "Login"
            },
            "Logout": {
                en: "Logout",
                es: "Salir"
            },
            "Are you sure?": {
                en: "Are you sure?",
                es: "¿Está seguro?"
            },
            "Username": {
                en: "Username",
                es: "Usuario"
            },
            "Password": {
                en: "Password",
                es: "Contraseña"
            },
            "tokenError": {
                en: "There's a problem with your credentials. Please login again.",
                es: "Ha existido un problema con sus credenciales de acceso. Por favor autentifíquese de nuevo.   "
            },
            "User blocked": {
                en: "Too many wrong tries. Your user is blocked. Please try again in a couple of minutes.",
                es: "Demasiados intentos erróneos. Su usuario se encuentra bloqueado. Intentelo de nuevo en un par de minutos."
            },
            "Close": {
                en: "Close",
                es: "Cerrar"
            }
        })
        // aplication
        .run(['$rootScope', '$ionicPlatform', '$state', 'UserService', function ($rootScope, $ionicPlatform, $state, UserService) {
            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }

                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }

                $rootScope.$on('logout', function () {
                    UserService.logout();
                });

                $rootScope.$on('$stateChangeError',
                    function (event, toState, toParams, fromState, fromParams, error) {
                        if (error) {
                            switch (error.error) {
                                case "noUser":
                                    $state.go('_login', {});
                                    break;
                            }
                        }
                    });
            });
        }])

        .config(['$stateProvider', '$httpProvider', 'lockerProvider', function ($stateProvider, $httpProvider, lockerProvider) {
            lockerProvider.setDefaultDriver('local')
                .setDefaultNamespace('gMobile')
                .setSeparator('.')
                .setEventsEnabled(false);

            $stateProvider
                .state('_login', {
                    url: '/login',
                    templateUrl: '_templates/login.html',
                    controller: 'LoginController',
                    data: {isPublic: true}
                })
            ;
        }])

        .controller('LoginController', ['$scope', '$state', 'UserService', 'alert', '_',
            function ($scope, $state, UserService, alert, _) {

                var initUser = function () {
                    $scope.user = {
                        username: '',
                        password: ''
                    };
                };

                initUser();

                $scope.doLoginAction = function () {
                    if ($scope.user.username !== '' && $scope.user.password !== '') {
                        UserService.login($scope.user.username, $scope.user.password)
                            .success(function (response) {
                                initUser();
                                if (response.status === false) {
                                    alert(_(response.message));
                                } else {
                                    $state.go('home', {});
                                }
                            });
                    }
                };
            }])
    ;

    angular.module("main.tpls", [])
        .run(["$templateCache", function ($templateCache) {
            $templateCache.put("_templates/login.html",
                "<ion-view title=\"{{'Login'| _ }}\"  hide-back-button=\"true\">" +
                "    <div class=\"bar bar-header bar-positive\">" +
                "        <div class=\"title\">RIS</div>" +
                "    </div>" +
                "    <ion-content padding=\"true\" class=\"has-header\">" +
                "        <form>" +
                "            <div class=\"list\">" +
                "                <label class=\"item item-input item-floating-label\">" +
                "                    <span class=\"input-label\">{{'Username'| _ }}</span>" +
                "                    <input ng-model=\"user.username\" type=\"text\" placeholder=\"{{'Username'| _ }}\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">" +
                "                </label>" +
                "                <label class=\"item item-input item-floating-label\">" +
                "                    <span class=\"input-label\">{{'Password'| _ }}</span>" +
                "                    <input ng-model=\"user.password\" type=\"password\" placeholder=\"{{'Password'| _ }}\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">" +
                "                </label>" +
                "            </div>" +
                "            <div class=\"spacer\" style=\"height: 40px;\"></div>" +
                "                <a  ng-click=\"doLoginAction()\"  class=\"button button-stable button-block\">{{'Login'| _ }}</a>" +
                "        </form>" +
                "    </ion-content>" +
                "</ion-view>");
        }]);

})();