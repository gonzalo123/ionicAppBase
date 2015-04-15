describe('PrivateState', function () {

    var provider;

    beforeEach(module('G', function (privateStateProvider) {
        provider = privateStateProvider;
    }));

    it('PrivateState append routes', inject(function (UserService) {
        provider.get({
            url: '/home',
            templateUrl: 'templates/home.html',
            controller: 'HomeController'
        });
        expect(provider.$get()).toBeDefined();
    }));

});