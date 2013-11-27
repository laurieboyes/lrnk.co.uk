<!DOCTYPE html>
<html lang="en" ng-app>
<head>
    <meta charset="utf-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.3/angular.min.js"></script>
    <script src="resources/js/squash.js"></script>

    <link href="resources/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <link href="resources/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet">

    <title>Squash planner</title>

</head>
<body>
<div class="container">
    <h1>Let's all have a lovely game of squash</h1>
    <div ng-controller="SquashCtrl">

        <div class="row" ng-repeat="day in squashDays">
            <h3>{{prettifyDate(day.date)}}</h3>
            <div class="col-sm-4" ng-repeat="venue in day.venues">                
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th colspan="2">{{venue.venueName}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="session in venue.sessions">
                            <td>{{session.time}}</td>
                            <td>{{session.availableSlots}} courts remaining</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</div>

<script src="http://code.jquery.com/jquery.js"></script>
<script src="resources/bootstrap/js/bootstrap.min.js"></script>
</body>
</html>