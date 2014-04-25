'use strict';

describe('controllers', function () {
    var scope;



    describe('LoginDirectiveController', function () {
        var url = 'scope-url-value';

        beforeEach(function () {
            module('login.controller');
        });

        beforeEach(function () {
            module(function ($provide) {
                //jasmine.createSpyObj('Auth', ['authenticate', 'getAuthenticatedUser', 'isAuthorizedToAccess', 'isAuthenticated'])
                $provide.factory('Auth', function () {
                    var credentials = {};
                    var succesfulLogin = true;

                    function authenticate(credentials, successCallback, errorCallback) {
                        this.credentials = credentials;
                        if (credentials.username != '') {
                            successCallback();
                        } else {
                            errorCallback('ERROR-MESSAGE-FROM-REST');
                        }
                    }

                    function logoutShouldFail() {
                        succesfulLogin = false;
                    }

                    function logout(successCallback, errorCallback) {
                        if (succesfulLogin) {
                            successCallback();
                        } else {
                            errorCallback('ERROR-MESSAGE-FROM-REST');
                        }
                    }

                    return {
                        authenticate: authenticate,
                        credentials: credentials,
                        logout: logout,
                        logoutShouldFail: logoutShouldFail
                    }
                });
            });

            inject(function ($controller, $rootScope) {
                $rootScope.alerts = [];
                scope = $rootScope.$new();
                scope.url = url;
                scope.afterLogin = function () {
                };
                scope.username = 'username';
                scope.password = 'password';
                $controller('LoginDirectiveController', {$scope: scope});
            });
        });

        it('should delegate authentication to Auth', inject(function (Auth) {
            scope.login();
            expect(Auth.credentials).toEqual({username: scope.username, password: scope.password});
        }));

        it('should call afterLogin method given a successful login', inject(function (Auth) {
            spyOn(scope, 'afterLogin');

            scope.login();

            expect(Auth.credentials).toEqual({username: scope.username, password: scope.password});
            expect(scope.afterLogin).toHaveBeenCalled();
        }));

        it('should add error message on scope given a failed login', inject(function () {
            var responseErrorMessage = 'ERROR-MESSAGE-FROM-REST';
            scope.username = '';

            scope.login();

            expect(scope.alerts).toContain({ type: 'danger', msg: 'Login failed: ' + responseErrorMessage });
        }));

        it('should redirect to root path when logout was successful', inject(function (Auth, $location) {
            scope.logout();

            expect($location.path()).toBe('/');
        }));

        it('should display error message on failed logout', inject(function (Auth) {
            Auth.logoutShouldFail();
            scope.logout();

            expect(scope.alerts).toContain({ type: 'danger', msg: 'There was an error: ERROR-MESSAGE-FROM-REST' });
        }));
    });

});
