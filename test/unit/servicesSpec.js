'use strict';

/* jasmine specs for services go here */

describe('service', function () {

    beforeEach(module('userAdmin.services'));


    describe('version', function () {
        it('should return current version', inject(function (version) {
            expect(version).toEqual('0.1');
        }));
    });


    describe('Alerts', function () {

        it('shoould show a success message', inject(function (Alerts, $rootScope) {
            $rootScope.alerts = [];
            expect($rootScope.alerts.length).toEqual(0);
            Alerts.successHandler('Happy message')
            expect($rootScope.alerts.length).toEqual(1);
        }));


    });


    describe('Auth service', function () {
        var credentials = {
            username: 'username',
            password: 'password'
        };
        var authService,
            callbacks,
            cookieStore;

        beforeEach(function () {
            module('login.service');
            module(function ($provide) {
                $provide.factory('$cookieStore', function () {
                        cookieStore = jasmine.createSpyObj('$cookieStore', ['get', 'put', 'remove'])
                        return cookieStore;
                    }
                );
            });

            inject(function (Auth) {
                authService = Auth;
            });

            callbacks = jasmine.createSpyObj('callbacks', ['success', 'error']);
        });


        it('should set cookie with user details when successful login', inject(function ($httpBackend, LOGIN_URLS) {
            var user = {user: 'user'};
            $httpBackend.expectPOST(LOGIN_URLS.LOGIN, $.param(credentials)).respond(200, user);

            authService.authenticate(credentials, callbacks.success, callbacks.error);
            $httpBackend.flush();

            expect(cookieStore.put).toHaveBeenCalledWith('user', user);
        }));

        it('should not set any cookie when login fails', inject(function ($httpBackend, LOGIN_URLS) {
            $httpBackend.expectPOST(LOGIN_URLS.LOGIN, $.param(credentials)).respond(401, 'error');

            authService.authenticate(credentials, callbacks.success, callbacks.error);
            $httpBackend.flush();

            expect(cookieStore.put).not.toHaveBeenCalled();
        }));

        it('user from Auth should be initialized; otherwise values used in templates before http calls are finished will not be bounded to scope', function () {
            expect(authService.getAuthenticatedUser()).not.toBeUndefined();
            expect(authService.getAuthenticatedUser().userId).not.toBeUndefined();
            expect(authService.getAuthenticatedUser().roles).not.toBeUndefined();
        });

        it('should call login url when authenticating', inject(function ($httpBackend, LOGIN_URLS) {
            $httpBackend.expectPOST(LOGIN_URLS.LOGIN, $.param(credentials)).respond(200, '');

            authService.authenticate(credentials, callbacks.success, callbacks.error);

            $httpBackend.verifyNoOutstandingExpectation();
        }));

        it('should call logout url when logging out', inject(function ($httpBackend, LOGIN_URLS) {
            $httpBackend.expectPOST(LOGIN_URLS.LOGOUT).respond(200, '');

            authService.logout();

            $httpBackend.verifyNoOutstandingExpectation();
        }));


        it('should delete the cookie when logout is attempted', inject(function ($httpBackend, LOGIN_URLS) {
            $httpBackend.expectPOST(LOGIN_URLS.LOGOUT).respond(200, '');

            authService.logout();
            $httpBackend.verifyNoOutstandingExpectation();

            expect(cookieStore.remove).toHaveBeenCalledWith('useri');
        }));


//    it('should remove user credentials when logging out successfully',
//      inject(function ($httpBackend, REST_URLS) {
//        $httpBackend.expectPOST(REST_URLS.LOGIN, $.param(credentials)).respond(200, {userId: 'username', roles: ['USER']});
//        $httpBackend.expectPOST(REST_URLS.LOGOUT).respond(200, '');
//
//        authService.authenticate(credentials, callbacks.success, callbacks.error);
//        authService.logout();
//        $httpBackend.flush();
//
//        $httpBackend.verifyNoOutstandingExpectation();
//        expect(authService.getAuthenticatedUser()).toEqual({userId: '', roles: []});
//      })
//    );

        it('should call successCallback on successful authentication ', inject(function ($httpBackend, LOGIN_URLS) {
            $httpBackend.expectPOST(LOGIN_URLS.LOGIN, $.param(credentials)).respond(200, '');

            authService.authenticate(credentials, callbacks.success, callbacks.error);
            $httpBackend.flush();

            expect(callbacks.success).toHaveBeenCalled();
        }));

        it('should call errorCallback on failed authentication ', inject(function ($httpBackend, LOGIN_URLS) {
            var responseErrorMessage = 'BAD-CREDENTIALS';
            $httpBackend.expectPOST(LOGIN_URLS.LOGIN, $.param(credentials)).respond(401, responseErrorMessage);

            authService.authenticate(credentials, callbacks.success, callbacks.error);
            $httpBackend.flush();

            expect(callbacks.error).toHaveBeenCalledWith(responseErrorMessage);
        }));

        it('should provide a copy of authenticated user rest response, when getAuthenticatedUser is called', inject(function ($httpBackend, LOGIN_URLS) {
            var user = {userId: 'userId', roles: ['USER']};
            $httpBackend.expectPOST(LOGIN_URLS.LOGIN, $.param(credentials)).respond(200, user);

            authService.authenticate(credentials, callbacks.success, callbacks.error);
            $httpBackend.flush();

            expect(authService.getAuthenticatedUser()).not.toBeUndefined();
            expect(authService.getAuthenticatedUser()).not.toBe(user);
            expect(authService.getAuthenticatedUser()).toEqual(user);
        }));

        it('should return false if user does not have role for given route', function () {
            expect(authService.isAuthorizedToAccess({role: 'ADMIN'})).toBeFalsy();
        });

        it('should return true if user has role for given route', inject(function ($httpBackend, LOGIN_URLS) {
            var user = {userId: 'userId', roles: ['ADMIN']};
            $httpBackend.expectPOST(LOGIN_URLS.LOGIN, $.param(credentials)).respond(200, user);
            authService.authenticate(credentials, callbacks.success, callbacks.error);
            $httpBackend.flush();

            expect(authService.isAuthorizedToAccess({role: 'ADMIN'})).toBeTruthy();
        }));

        it('should return a copy of user when getAuthenticatedUser is called', inject(function ($httpBackend, LOGIN_URLS) {
            var authenticatedUserBeforeStateChanges = authService.getAuthenticatedUser();
            $httpBackend.expectPOST(LOGIN_URLS.LOGIN, $.param(credentials)).respond(200, '');
            authService.authenticate(credentials, callbacks.success, callbacks.error);
            $httpBackend.flush();

            var authenticatedUserAfterStateChanges = authService.getAuthenticatedUser();

            expect(authenticatedUserBeforeStateChanges).not.toEqual(authenticatedUserAfterStateChanges);
        }));

        it('should return false if the user is not authenticated', function () {
            expect(authService.isAuthenticated()).toEqual(false);
        });

        it('should return true if the user is authenticated', inject(function ($httpBackend, LOGIN_URLS) {
            var user = {userId: 'userId', roles: ['USER']};
            $httpBackend.expectPOST(LOGIN_URLS.LOGIN, $.param(credentials)).respond(200, user);
            authService.authenticate(credentials, callbacks.success, callbacks.error);
            $httpBackend.flush();

            expect(authService.isAuthenticated()).toEqual(true);
        }));

        it('should call successCallback on successful logout',
            inject(function ($httpBackend, LOGIN_URLS) {
                $httpBackend.expectPOST(LOGIN_URLS.LOGOUT).respond(200, '');

                authService.logout(callbacks.success, callbacks.error);
                $httpBackend.flush();

                expect(callbacks.success).toHaveBeenCalled();
            })
        );

        it('should call errorCallback on errors while logging out',
            inject(function ($httpBackend, LOGIN_URLS) {
                $httpBackend.expectPOST(LOGIN_URLS.LOGOUT).respond(401, '');

                authService.logout(callbacks.success, callbacks.error);
                $httpBackend.flush();

                expect(callbacks.error).toHaveBeenCalled();
            })
        );
    });
});
