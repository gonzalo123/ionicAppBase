# ionicAppBase

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <title></title>

    <link href="lib/ionic/css/ionic.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">

    <script src="lib/ionic/js/ionic.bundle.js"></script>
    <script src="cordova.js"></script>
    <script src="lib/angular-locker/dist/angular-locker.min.js"></script>
    <script src="lib/gonzalo-ionic-app-base/dist/main.js"></script>
    <script src="js/app.js"></script>
</head>
<body ng-app="G">
<ion-pane>
    <ion-nav-view></ion-nav-view>
</ion-pane>
</body>
</html>
```

````json
{
  "name": "appName",
  "app_id": "",
  "proxies": [
        {
          "path": "/api",
          "proxyUrl": "http://localhost:8080"
        }
      ]
}
```
