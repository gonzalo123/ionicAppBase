describe('PopupsSpec', function () {

    beforeEach(module('G'));

    it('check alert', inject(function ($ionicPopup, alert) {
        var message, title;

        spyOn($ionicPopup, 'alert');

        message = 'message';
        title = 'title';

        alert(message, title);

        expect($ionicPopup.alert).toHaveBeenCalledWith({ title: 'title', template: 'message' });
    }));

    it('check confirm clicking yes', inject(function ($ionicPopup, confirm) {
        var message, title;

        spyOn($ionicPopup, 'confirm').and.returnValue({
            then: function (onSuccess) {
                onSuccess(true);
            }
        });

        message = 'message';
        title = 'title';

        var actions = {
            ok: function() {},
            nok: function() {}
        };
        spyOn(actions, 'ok');
        spyOn(actions, 'nok');
        confirm(message, title, actions.ok, actions.nok);

        expect($ionicPopup.confirm).toHaveBeenCalledWith({ title: 'title', template: 'message' });
        expect(actions.ok).toHaveBeenCalled();
        expect(actions.nok).not.toHaveBeenCalled();
    }));

    it('check confirm clicking no', inject(function ($ionicPopup, confirm) {
        var message, title;

        spyOn($ionicPopup, 'confirm').and.returnValue({
            then: function (onSuccess) {
                onSuccess(false);
            }
        });

        message = 'message';
        title = 'title';

        var actions = {
            ok: function() {},
            nok: function() {}
        };
        spyOn(actions, 'ok');
        spyOn(actions, 'nok');
        confirm(message, title, actions.ok, actions.nok);

        expect($ionicPopup.confirm).toHaveBeenCalledWith({ title: 'title', template: 'message' });
        expect(actions.ok).not.toHaveBeenCalled();
        expect(actions.nok).toHaveBeenCalled();
    }));
});