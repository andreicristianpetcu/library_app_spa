'use strict';

describe('Users controller', function () {
    var scope, alertsMock, usersMock, UsersController;

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('Users', {});
        });

        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            usersMock = jasmine.createSpyObj('Users', ['getUsers']);
            alertsMock = jasmine.createSpyObj('Alerts', ['handler']);

            UsersController = $controller('UsersController', {$scope: scope, Users: usersMock, Alerts: alertsMock});
        });

    });

    it('should get users from User factory', function () {
        expect(usersMock.getUsers).toHaveBeenCalled();
    });

    it('success callback should put users on scope', function () {
        var success = usersMock.getUsers.mostRecentCall.args[0];
        var users = [
            {id: 1, name: 'name'}
        ];

        success(users);

        expect(scope.users).toBe(users);
    });
});

