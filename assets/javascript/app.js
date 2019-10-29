$(document).ready(function () {

    var team;
    var teamAbbr;
    var teamDashed;

    $("#scoreboard-div").hide();
    $("#articles").hide();

    $(".dropdown-item").on("click", function () {
        team = $(this).text();
        teamDashed = team.split(/\s+/).join('-');
        teamAbbr = $(this).attr("id");

        $("#team-selection").text(team);
    })

    $("#team-submit").on("click", function () {
        event.preventDefault();
        $("#team-selection").text("Select Your Team!");
        $("#articles").empty();
        $("#seatgeek-info").empty();
        $("#away-abbr").empty();
        $("#home-abbr").empty();
        $(".away-qtr").remove();
        $(".home-qtr").remove();
        $(".final-score").remove();
        $("#scoreboard-div").show();
        $("#articles").show();

        var newsUrl = "https://newsapi.org/v2/everything?qInTitle=" + teamDashed +
            "&language=en&sortBy=publishedAt&from=2019-10-15&apiKey=661826d0bdfe4381ace783308aa9216c";
        var seatgeekUrl = "https://api.seatgeek.com/2/events?performers.slug=" + teamDashed + "&client_id=MTkwNTE3NjN8MTU3MTg1OTczOS4yNA";
        var mySportsFeedsUrl = "https://api.mysportsfeeds.com/v1.2/pull/nfl/2019-regular/scoreboard.json?fordate=20191027&team=" + teamAbbr;

        // NEWS AJAX CALL
        // ========================================================================================
        $.ajax({
            url: newsUrl,
            method: "GET"
        }).then(function (response) {
            console.log("NEWS");
            console.log(response.articles);
            console.log("========================");

            var article = response.articles;

            $("#articles").append("<h3 class='article-text' id='article-header'>Recent " + team + " News</h3>");
            $("#articles").append("<hr>");

            for (var i = 0; i < 10; i++) {
                var articleDiv = $("<div>");
                articleDiv.addClass("article-content");

                var articleTitle = $("<h5 class='article-text' id='article-title'>").text(article[i].title);
                var articleAuthor = $("<p class='article-text' id='article-author'>").text("By: " + article[i].author);
                var articleSource = $("<p class='article-text' id='article-source'>").text("Source: " + article[i].source.name);
                var articleUrl = $("<p class='article-text' id='article-url'>").html("<a href=" + article[i].url + " target='_blank'>Read Full Article</a>");

                articleDiv.append(articleTitle);
                articleDiv.append(articleAuthor);
                articleDiv.append(articleSource);
                articleDiv.append(articleUrl);
                articleDiv.append("<hr>");

                $("#articles").append(articleDiv);
            }
        });


        // SEATGEEK AJAX CALL
        // ========================================================================================
        $.ajax({
            url: seatgeekUrl,
            method: "GET"
        }).then(function (response) {
            console.log("SEATGEEK");
            console.log(response.events);
            console.log("========================");
            // console.log(toDateString(teamEvent[0].datetime_local));

            var teamEvent = response.events;

            var time = teamEvent[0].datetime_local; // NEEDS TO BE CONVERTED
            // newTime = time.toDateString();
            // console.log(newTime);

            // dynamically generate elements
            var seatgeekDiv = $("<div>");
            seatgeekDiv.addClass("seatgeek-content");

            var nextMatchup = $("<p class='seatgeek-text' id='next-matchup'>").text(teamEvent[0].short_title);
            var nextVenue = $("<p class='seatgeek-text' id='next-venue'>").text("Location: " + teamEvent[0].venue.name);
            var venueAddress = $("<p class='seetgeek-text' id='venue-address'>").text(teamEvent[0].venue.extended_address);
            var eventTime = $("<p class='seatgeek-text' id='event-time'>").text(time);
            var ticketsUrl = $("<p class='seatgeek-text' id='tickets-url'>").html("<a href=" + teamEvent[0].url + " target='_blank'>Buy Tickets Here</a>");

            seatgeekDiv.append("<h3 class='seatgeek-text' id='seatgeek-header'>Next Matchup:</h3>");
            seatgeekDiv.append("<hr>");
            seatgeekDiv.append(nextMatchup);
            seatgeekDiv.append(nextVenue);
            seatgeekDiv.append(venueAddress);
            seatgeekDiv.append(eventTime);
            seatgeekDiv.append(ticketsUrl);

            $("#seatgeek-info").append(seatgeekDiv);

        });


        // MYSPORTSFEEDS AJAX CALL
        // ========================================================================================
        $.ajax({
            url: mySportsFeedsUrl,
            method: "GET",
            headers: {
                "Authorization": "Basic " + btoa("23eb33fc-e785-49c6-854b-caefbc:cfeL!StY!4BSZHk")
            }
        }).then(function (response) {
            // ====================================================================================
            console.log("MYSPORTSFEEDS");
            console.log(response);
            console.log("========================");

            var gameStats = response.scoreboard.gameScore;

            // ====================================================================================

            var away = gameStats[0].game.awayTeam.City + " " + gameStats[0].game.awayTeam.Name;
            var home = gameStats[0].game.homeTeam.City + " " + gameStats[0].game.homeTeam.Name;
            var awayAbbr = gameStats[0].game.awayTeam.Abbreviation;
            var homeAbbr = gameStats[0].game.homeTeam.Abbreviation;
            var quarterScore = gameStats[0].quarterSummary.quarter;

            // adding info to table 
            $("#away-abbr").text(awayAbbr);
            $("#home-abbr").text(homeAbbr);
            
            for (var i = 0; i < quarterScore.length; i++) {
                var awayQuarter = $("<td>");
                var homeQuarter = $("<td>");

                awayQuarter.addClass("away-qtr");
                homeQuarter.addClass("home-qtr");

                awayQuarter.text(quarterScore[i].awayScore);
                homeQuarter.text(quarterScore[i].homeScore);

                $("#away-qtrs").append(awayQuarter);
                $("#home-qtrs").append(homeQuarter);
            }

            $("#away-qtrs").append("<td class='final-score'>" + gameStats[0].awayScore + "</td>");
            $("#home-qtrs").append("<td class='final-score'>" + gameStats[0].homeScore + "</td>");

        });

    });

});