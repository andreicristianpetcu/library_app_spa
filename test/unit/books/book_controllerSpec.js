'use strict';

describe('Books controller', function () {
    var scope;

    beforeEach(function () {
        module('book.bookController');
    });

    var alertsMock, booksMock, authMock, BooksController, routeParamsMock;

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('Books', {});
        });

        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            booksMock = jasmine.createSpyObj('Books', ['getBooks', 'getBook', 'addBook', 'borrowBook']);
            alertsMock = jasmine.createSpyObj('Alerts', ['handler']);
            authMock = jasmine.createSpyObj('Auth', ['handler']);
            routeParamsMock = {bookId: "10"};
            BooksController = $controller('BooksController', {$scope: scope, Books: booksMock, Alerts: alertsMock, Auth: authMock, $routeParams: routeParamsMock});
        });

    });

    it('should get books from Books factory', function () {
        expect(booksMock.getBooks).toHaveBeenCalled();
    });

//        it('should call addBooks from Books factory', function () {
//            scope.addBook({});
//            expect(booksMock.addBook).toHaveBeenCalled();
//        });
//
//        it('should call borrowBooks from Books factory', function () {
//            scope.borrowBook({});
//            expect(booksMock.borrowBook).toHaveBeenCalled();
//        });

    it('should simulate promise', inject(function ($q, $rootScope) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var resolvedValue;

        promise.then(function (value) {
            resolvedValue = value;
        });
        expect(resolvedValue).toBeUndefined();

        // Simulate resolving of promise
        deferred.resolve(123);
        // Note that the 'then' function does not get called synchronously.
        // This is because we want the promise API to always be async, whether or not
        // it got called synchronously or asynchronously.
        expect(resolvedValue).toBeUndefined();

        // Propagate promise resolution to 'then' functions using $apply().
        $rootScope.$apply();
        expect(resolvedValue).toEqual(123);
    }));
});

