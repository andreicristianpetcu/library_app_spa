'use strict';

/* jasmine specs for services go here */

describe('Users service', function () {
    var users = [
        {id: 1, name: 'user'}
    ];

    beforeEach(module('user.userService'));

    it('can get all users given a success rest call', inject(function (Users, $httpBackend, USER_URLS) {
        var callbacks = jasmine.createSpyObj('callbacks', ['success', 'error']);
        $httpBackend.expectPOST(USER_URLS.USERS).respond(200, users);

        Users.getUsers(callbacks.success, callbacks.error);
        $httpBackend.flush();

        expect(callbacks.success).toHaveBeenCalledWith(users);
    }));


//    it('can get all users given a success rest call', inject(function (Users, $httpBackend, REST_URLS) {
//      var callbacks = jasmine.createSpyObj('callbacks', ['success', 'error']);
//      var error = 'error object';
//      $httpBackend.expectPOST(REST_URLS.USERS).respond(400, error);
//
//      Users.getUsers(callbacks.success, callbacks.error);
//      $httpBackend.flush();
//
//      expect(callbacks.error).toHaveBeenCalledWith(error);
//    }));
});

