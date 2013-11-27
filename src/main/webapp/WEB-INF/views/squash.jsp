<!DOCTYPE html>
<html lang="en" ng-app>
<head>
    <meta charset="utf-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.3/angular.min.js"></script>
    <script src="resources/js/squash.js"></script>
    
    <link href="resources/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <link href="resources/bootstrap/css/bootstrap-theme.min.css" rel="stylesheet">

    <title>Let's all have a lovely game of squash</title>

</head>
<body>
<div id="content">
    <h1>Squash time</h1>
    <div ng-controller="SquashCtrl">

        <p ng-repeat="day in squashDays">
            {{day.name}}
        </p> 
        
    </div>
</div>

<script src="http://code.jquery.com/jquery.js"></script>
<script src="resources/bootstrap/js/bootstrap.min.js"></script>
</body>
</html>