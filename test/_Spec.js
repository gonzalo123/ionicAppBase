describe('_', function () {
    beforeEach(module('G', function ($provide) {
        $provide.value('MainLang', {
            "xxx": {
                en: "xxxEN",
                es: "xxxES"
            }
        });
    }));

    it('check lang', inject(function (_) {
        expect(_("nonExistsKey")).toBe("nonExistsKey");
        expect(_("Hello")).toBe("Hola");

        expect(_("xxx")).toBe("xxxES");
    }));
});