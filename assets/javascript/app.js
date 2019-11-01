$(document).ready(function () {
    // ============================================================================================
    // VARIABLES
    // ============================================================================================

    var team;
    var teamAbbr;
    var teamDashed;
    var teamLogo;

    // local storage variables
    var favoriteTeams = JSON.parse(localStorage.getItem("favoriteTeams"));
    if (!Array.isArray(favoriteTeams)) {
        favoriteTeams = [];
    }
    var favoriteAbbr = JSON.parse(localStorage.getItem("favoriteAbbr"));
    if (!Array.isArray(favoriteAbbr)) {
        favoriteAbbr = [];
    }
    var favoriteLogo = JSON.parse(localStorage.getItem("favoriteLogo"));
    if (!Array.isArray(favoriteLogo)) {
        favoriteLogo = [];
    }

    // ============================================================================================
    // FUNCTIONS 
    // ============================================================================================

    // add favorite teams to dropdown in navbar
    function renderFavorites(favoriteTeams) {
        $("#favorites-dropdown").empty();
        for (var i = 0; i < favoriteTeams.length; i++) {
            var favorite = $("<a>");
            favorite.addClass("dropdown-item");
            favorite.attr("href", "#");
            favorite.attr("abbr", favoriteAbbr[i]);
            favorite.attr("img", favoriteLogo[i]);
            favorite.attr("id", "team-submit");
            favorite.text(favoriteTeams[i]);
            $("#favorites-dropdown").append(favorite);
        }
    }

    // add articles to news.html
    function topHeadlines() {
        var newsUrl = "https://newsapi.org/v2/top-headlines?country=us&category=sports&q=nfl&apiKey=661826d0bdfe4381ace783308aa9216c"
        $.ajax({
            url: newsUrl,
            method: "GET"
        }).then(function (response) {

            var article = response.articles;

            $("#top-headlines").append("<h3 class='article-text' id='article-header'>Top NFL Headlines</h3>");
            $("#top-headlines").append("<hr>");

            for (var i = 0; i < article.length; i++) {
                var articleDiv = $("<div>");
                articleDiv.addClass("article-content");

                var articleTitle = $("<h5 class='article-text' id='article-title'>").text(article[i].title);
                var articleDescription = $("<p class='article-text' id='article-description'>").text(article[i].description);
                var articleAuthor = $("<p class='article-text' id='article-author'>").text("By: " + article[i].author);
                var articleSource = $("<p class='article-text' id='article-source'>").text("Source: " + article[i].source.name);
                var articleUrl = $("<p class='article-text' id='article-url'>").html("<a href=" + article[i].url + " target='_blank'>Read Full Article</a>");

                articleDiv.append(articleTitle);
                articleDiv.append(articleDescription);
                articleDiv.append(articleAuthor);
                articleDiv.append(articleSource);
                articleDiv.append(articleUrl);
                articleDiv.append("<hr>");

                $("#top-headlines").append(articleDiv);
            }
        });
    }

    // display name and logo of selected team 
    function displayTeam() {
        $("#team-logo").empty();
        $("#team-logo").show();
        var logo = $("<img>");
        logo.attr("src", teamLogo);
        logo.addClass("logo");
        $("#team-logo").append("<h2>" + team + "</h2>");
        $("#team-logo").prepend(logo);
        if (favoriteTeams.indexOf(team) > -1) {
            $("#team-logo").append("<button type='button' class='btn btn-danger' id='remove-button'>Remove From Favorites</button>");
        }
        else {
            $("#team-logo").append("<button type='button' class='btn btn-danger' id='favorites-button'>Add to Your Favorites</button>");
        }
    }

    // ============================================================================================
    // FUNCTION EXECUTION 
    // ============================================================================================

    $("#scoreboard-div").hide();
    $("#articles").hide();
    $("#favorites-button").hide();
    $("#team-logo").hide();

    topHeadlines();

    renderFavorites(favoriteTeams);

    // $(".dropdown-item").on("click", function () {
    $(document).on("click", ".dropdown-item", function () {
        team = $(this).text();
        teamDashed = team.split(/\s+/).join('-');
        teamAbbr = $(this).attr("abbr");
        teamLogo = $(this).attr("img");

        $("#team-selection").text(team);
    });

    // adding team to favorites
    $(document).on("click", "#favorites-button", function () {
        favoriteTeams.push(team);
        favoriteAbbr.push(teamAbbr);
        favoriteLogo.push(teamLogo)

        renderFavorites(favoriteTeams);

        localStorage.setItem("favoriteTeams", JSON.stringify(favoriteTeams));
        localStorage.setItem("favoriteAbbr", JSON.stringify(favoriteAbbr));
        localStorage.setItem("favoriteLogo", JSON.stringify(favoriteLogo));

        // $("#favorites-button").text(team + " Added to Favorites!");
        $("#favorites-button").remove();
        $("#team-logo").append("<button type='button' class='btn btn-danger' id='remove-button'>Remove From Favorites</button>");
        // }
    });
    // removing team from favorites
    $(document).on("click", "#remove-button", function () {
        favoriteTeams.splice(team, 1);
        favoriteAbbr.splice(teamAbbr, 1);
        favoriteLogo.splice(teamLogo, 1);
        renderFavorites(favoriteTeams);
        localStorage.setItem("favoriteTeams", JSON.stringify(favoriteTeams));
        localStorage.setItem("favoriteAbbr", JSON.stringify(favoriteAbbr));
        localStorage.setItem("favoriteLogo", JSON.stringify(favoriteLogo));
        $("#remove-button").remove();
        $("#team-logo").append("<button type='button' class='btn btn-danger' id='favorites-button'>Add to Your Favorites</button>");
    });

    $(document).on("click", "#team-submit", function (event) {

        event.preventDefault();

        // html to edit
        $("#team-selection").text(team);
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
        
        displayTeam();

        // begin ajax 
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

            var article = response.articles;

            $("#articles").append("<h3 class='article-text' id='article-header'>Recent " + team + " News</h3>");
            $("#articles").append("<hr>");

            for (var i = 0; i < 10; i++) {
                var articleDiv = $("<div>");
                articleDiv.addClass("article-content");

                var articleTitle = $("<h5 class='article-text' id='article-title'>").text(article[i].title);
                var articleDescription = $("<p class='article-text' id='article-description'>").text(article[i].description);
                var articleAuthor = $("<p class='article-text' id='article-author'>").text("By: " + article[i].author);
                var articleSource = $("<p class='article-text' id='article-source'>").text("Source: " + article[i].source.name);
                var articleUrl = $("<p class='article-text' id='article-url'>").html("<a href=" + article[i].url + " target='_blank'>Read Full Article</a>");

                articleDiv.append(articleTitle);
                articleDiv.append(articleDescription);
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

            var teamEvent = response.events;

            var time = teamEvent[0].datetime_local;
            // converting time from ISO format
            var newTime = time.split("T");
            var newerTime = newTime[0].split("-");
            var date = newerTime[1] + "-" + newerTime[2] + "-" + newerTime[0];


            // dynamically generate elements
            var seatgeekDiv = $("<div>");
            seatgeekDiv.addClass("seatgeek-content");

            var nextMatchup = $("<p class='seatgeek-text' id='next-matchup'>").text(teamEvent[0].short_title);
            var nextVenue = $("<p class='seatgeek-text' id='next-venue'>").text("Location: " + teamEvent[0].venue.name);
            var venueAddress = $("<p class='seetgeek-text' id='venue-address'>").text(teamEvent[0].venue.extended_address);
            var eventTime = $("<p class='seatgeek-text' id='event-time'>").text(date);
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

            var gameStats = response.scoreboard.gameScore;

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