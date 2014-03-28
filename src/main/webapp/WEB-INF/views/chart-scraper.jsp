<%@ page language="java" contentType="text/html;" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Current Singles Chart</title>
    
    <style>
        th {
            text-align: left;
            padding-right: 30px;
        }
        
        td {
            padding-right: 30px;
        }
    </style>
    
</head>
<body>

<table>
    <thead>
    <tr>
        <th>Position</th>
        <th>Last Week</th>
        <th>Weeks</th>
        <th>Artist</th>
        <th>Title</th>
        <th>Change this week</th>
    </tr>
    </thead>
    <tbody>
    <c:forEach items="${chartEntries}" var="entry">
        <tr>
            <td>${entry.position}</td>
            <td>${entry.lastWeek}</td>
            <td>${entry.weeks}</td>
            <td>${entry.artist}</td>
            <td>${entry.title}</td>
            <td>${entry.changeThisWeek}</td>
        </tr>
    </c:forEach>

    </tbody>
</table>

</body>
</html>