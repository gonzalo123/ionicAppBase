describe('HttpSpec', function () {
    var timerCallback;
    beforeEach(module('G'));


    it('handle token', inject(function (http) {
        http.setToken("token");
        expect(http.getToken()).toBe('token');
    }));

    it('do get', inject(function (http, $http, $ionicLoading) {
        http.setToken("token");
        spyOn($ionicLoading, 'show');
        spyOn($http, 'get').and.returnValue({
            success: function () {
            },
            error: function () {
            }
        });

        var baseTime = new Date(2013, 9, 23);
        jasmine.clock().mockDate(baseTime);
        http.get("/uri", {param1: 1});
        expect($ionicLoading.show).toHaveBeenCalled();
        expect($http.get).toHaveBeenCalledWith('/api/uri', {
            params: {
                _token: 'token',
                _version: 1,
                _unique: 1382479200000,
                param1: 1
            }
        });
    }));

    it('do post', inject(function (http, $http, $ionicLoading) {
        http.setToken("token");
        spyOn($ionicLoading, 'show');
        spyOn($http, 'post').and.returnValue({
            success: function () {
            },
            error: function () {
            }
        });

        var baseTime = new Date(2013, 9, 23);
        jasmine.clock().mockDate(baseTime);
        http.post("/uri", {param1: 1});
        expect($ionicLoading.show).toHaveBeenCalled();
        expect($http.post).toHaveBeenCalledWith('/api/uri', {
            _token: 'token',
            _version: 1,
            _unique: 1382479200000,
            param1: 1
        });
    }));

    it('do get Background', inject(function (http, $http, $ionicLoading) {
        http.setToken("token");
        spyOn($ionicLoading, 'show');
        spyOn($http, 'get').and.returnValue({
            success: function () {
            },
            error: function () {
            }
        });

        var baseTime = new Date(2013, 9, 23);
        jasmine.clock().mockDate(baseTime);
        http.getBackground("/uri", {param1: 1});
        expect($ionicLoading.show).not.toHaveBeenCalled();
        expect($http.get).toHaveBeenCalledWith('/api/uri', {
            params: {
                _token: 'token',
                _version: 1,
                _unique: 1382479200000,
                param1: 1
            }
        });
    }));

    it('do post Background', inject(function (http, $http, $ionicLoading) {
        http.setToken("token");
        spyOn($ionicLoading, 'show');
        spyOn($http, 'post').and.returnValue({
            success: function () {
            },
            error: function () {
            }
        });

        var baseTime = new Date(2013, 9, 23);
        jasmine.clock().mockDate(baseTime);
        http.postBackground("/uri", {param1: 1});
        expect($ionicLoading.show).not.toHaveBeenCalled();
        expect($http.post).toHaveBeenCalledWith('/api/uri', {
            _token: 'token',
            _version: 1,
            _unique: 1382479200000,
            param1: 1
        });
    }));
});