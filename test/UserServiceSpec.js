describe('UserService', function () {
    beforeEach(module('G'));

    it('do login with good credentials', inject(function (http, locker, $q, UserService) {
        expect(UserService).toBeDefined();
        spyOn(http, 'setToken');
        spyOn(http, 'post').and.returnValue({
            success: function (onSuccess) {
                var response = {
                    status: true
                };

                onSuccess(response);
            },
            error: function (onError) {
            }
        });
        spyOn(locker, 'put');
        spyOn($q, 'reject');

        var credentials = {user: "user", password: "pass"};
        UserService.login(credentials.user, credentials.password);

        expect(http.setToken).toHaveBeenCalled();
        expect(http.post).toHaveBeenCalledWith('/auth/validateCredentials', credentials);
        expect(locker.put).toHaveBeenCalled();

    }));

    it('do login with bad credentials', inject(function (http, locker, $q, UserService) {
        expect(UserService).toBeDefined();
        spyOn(http, 'setToken');

        spyOn(http, 'post').and.returnValue({
            success: function (onSuccess) {
                var response = {
                    status: false
                };

                onSuccess(response);
            },
            error: function (onError) {
            }
        });
        spyOn(locker, 'put');
        spyOn($q, 'reject');

        var credentials = {user: "user", password: "pass"};
        UserService.login(credentials.user, credentials.password);

        expect(http.setToken).not.toHaveBeenCalled();
        expect(http.post).toHaveBeenCalledWith('/auth/validateCredentials', credentials);
        expect($q.reject).toHaveBeenCalled();
        expect(locker.put).not.toHaveBeenCalled();

    }));

    it('init first time', inject(function (UserService) {
        expect(UserService).toBeDefined();

        UserService.init();
        expect(UserService.getUser()).toBe(undefined);
    }));

    it('init with user defined', inject(function (http, locker, UserService) {
        expect(UserService).toBeDefined();
        spyOn(http, 'setToken');
        var user = {user: "Gonzalo", token: 123};
        spyOn(locker, 'get').and.callFake(function () {
            return user;
        });
        UserService.init();
        expect(UserService.getUser().user).toBe("Gonzalo");
        expect(http.setToken).toHaveBeenCalled();
        expect(http.setToken).toHaveBeenCalledWith(user.token);
    }));

    it('logout', inject(function (UserService, $state) {
        expect(UserService).toBeDefined();
        spyOn($state, 'go');
        UserService.logout();
        expect($state.go).toHaveBeenCalledWith('_login', {});
    }));

});