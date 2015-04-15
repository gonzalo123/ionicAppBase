angular.module('G', ['gMain'])
    .constant('conf', {
        version: 1,
        lang: 'es',
        //host: 'https://www.ris.arcelormittal.net/eris/s/sa'
        //host: 'http://192.168.1.104:8080'
        //host: "http://10.237.106.146:8080/api"
        host: "/api"
    })
    .value('Lang', {
        "Hello": {
            en: "Hello",
            es: "Hola"
        },
        "Are you sure?": {
            en: "Are you sure?",
            es: "¿Está seguro?"
        },
        "Logout": {
            en: "Logout",
            es: "Salir"
        },
        "Title": {
            en: "Title",
            es: "Título"
        }
    });