describe('LoginController', function () {
    var scope;

    beforeEach(module('G'));

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('LoginController', {$scope: scope});
    }));

    it('user is initialized', function () {
        expect(scope.user.username).toEqual('');
        expect(scope.user.password).toEqual('');
    });

    it('UserService login is called with good user and password', inject(function ($state, UserService) {
        spyOn(UserService, "login").and.returnValue({
            success: function (onSuccess) {
                var response = {
                    status: true
                };
                onSuccess(response);
            }
        });
        spyOn($state, 'go');

        expect(scope.user.username).toEqual('');

        scope.user = {
            username: 'user',
            password: 'pass'
        };

        expect(scope.user.username).toEqual('user');
        scope.doLoginAction();

        expect(UserService.login).toHaveBeenCalled();
        expect(UserService.login).toHaveBeenCalledWith('user', 'pass');
        expect($state.go).toHaveBeenCalled();
        expect($state.go).toHaveBeenCalledWith('home', {});
        expect(scope.user.username).toEqual('');
        expect(scope.user.password).toEqual('');
    }));

    it('UserService login is called with wrong user and password', inject(function ($state, UserService) {
        expect(UserService).toBeDefined();
        spyOn(UserService, "login").and.returnValue({
            success: function (onSuccess) {
                var response = {
                    status: false
                };
                onSuccess(response);
            }
        });
        spyOn($state, 'go');

        expect(scope.user.username).toEqual('');

        scope.user = {
            username: 'user',
            password: 'pass'
        };

        expect(scope.user.username).toEqual('user');
        scope.doLoginAction();

        expect(UserService.login).toHaveBeenCalled();
        expect(UserService.login).toHaveBeenCalledWith('user', 'pass');
        expect($state.go).not.toHaveBeenCalled();
        expect(scope.user.username).toEqual('');
        expect(scope.user.password).toEqual('');
    }));
});