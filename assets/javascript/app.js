$(document).ready(function () {

    /* $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
    }) */

    // var team;
    var teamAbbr;
    var team;
    var teamDashed;

    $(".dropdown-item").on("click", function() {
        team = $(this).text();
        teamDashed = team.split(/\s+/).join('-');
        teamAbbr = $(this).attr("id");
        console.log(team);
        console.log(teamAbbr);
        console.log(teamDashed);
        $("#team-selection").text(team);
    })

    $("#team-submit").on("click", function () {
        event.preventDefault();

        console.log(team);
        console.log(teamAbbr);

        var newsUrl = "https://newsapi.org/v2/everything?qInTitle=" + teamDashed +
            "&language=en&sortBy=publishedAt&from=2019-10-15&apiKey=661826d0bdfe4381ace783308aa9216c";

        var seatgeekUrl = "https://api.seatgeek.com/2/events?performers.slug=" + teamDashed + "&client_id=MTkwNTE3NjN8MTU3MTg1OTczOS4yNA";

        var mySportsFeedsUrl = "https://api.mysportsfeeds.com/v1.2/pull/nfl/2019-regular/scoreboard.json?fordate=20191013&team=" + teamDashed;
        // var mySportsFeedsUrl = "https://api.mysportsfeeds.com/v1.2/pull/nfl/2019-regular/game_boxscore.json?gameid=20190905-GB-CHI"

        // NEWS AJAX CALL
        // ========================================================================================
        $.ajax({
            url: newsUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var article = response.articles;

            for (var i = 0; i < 10; i++) {
                console.log("Title: " + article[i].title);
                console.log("By: " + article[i].author);
                console.log("Source: " + article[i].source.name);
                console.log("Link: " + article[i].url);
                console.log("==========================================");

            }
        });


        // SEATGEEK AJAX CALL
        // ========================================================================================
        $.ajax({
            url: seatgeekUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(response.events);

            var teamEvent = response.events;

            console.log("NEXT GAME");
            console.log(teamEvent[0].short_title);
            console.log(teamEvent[0].venue.name);
            console.log(teamEvent[0].venue.extended_address);
            console.log("Time: " + teamEvent[0].datetime_local);
            console.log("Buy Tickets Here: " + teamEvent[0].url);

        }); 


        // MYSPORTSFEEDS AJAX CALL
        // ========================================================================================
        $.ajax({
            url: mySportsFeedsUrl,
            method: "GET",
            headers: {
                "Authorization": "Basic " + btoa("23eb33fc-e785-49c6-854b-caefbc:cfeL!StY!4BSZHk")
            },
        }).then(function (response) {
            console.log(response);
            var gameStats = response.scoreboard.gameScore;
            
            console.log("Away team: " + gameStats[0].game.awayTeam.City + " " + gameStats[0].game.awayTeam.Name);
            console.log("Home Team: " + gameStats[0].game.homeTeam.City + " " + gameStats[0].game.homeTeam.Name);

            console.log("Quarter Summary:")
            for (var i = 0; i < gameStats[0].quarterSummary.quarter.length; i++) {
                console.log("Q1: " + gameStats[0].game.awayTeam.Abbreviation + ": " + gameStats[0].quarterSummary.quarter[i].awayScore + " " + gameStats[0].game.homeTeam.Abbreviation + ": " + gameStats[0].quarterSummary.quarter[i].homeScore);
            }
            console.log("FINAL");
            console.log(gameStats[0].game.awayTeam.Abbreviation + ": " + gameStats[0].awayScore);
            console.log(gameStats[0].game.homeTeam.Abbreviation + ": " + gameStats[0].homeScore);

        });

    });
});