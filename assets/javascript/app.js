$(document).ready(function () {

    var team;
    var teamAbbr;
    var teamDashed;
    var teamLogo;
    var favoriteTeams = JSON.parse(localStorage.getItem("favoriteTeams"));
    if (!Array.isArray(favoriteTeams)) {
        favoriteTeams = [];
    }
    var favoriteAbbr = JSON.parse(localStorage.getItem("favoriteAbbr"));
    if (!Array.isArray(favoriteAbbr)) {
        favoriteAbbr = [];
    }
    var isFavorite = false;
    var teamSelected = false;


    function renderFavorites(favoriteTeams) {
        $("#favorites-dropdown").empty();
        for (var i = 0; i < favoriteTeams.length; i++) {
            var favorite = $("<a>");
            favorite.addClass("dropdown-item");
            favorite.attr("href", "#");
            favorite.attr("abbr", favoriteAbbr[i]);
            favorite.attr("id", "team-submit");
            favorite.text(favoriteTeams[i]);
            $("#favorites-dropdown").append(favorite);
        }
    }

    // for news page
    function topHeadlines() {
        var newsUrl = "https://newsapi.org/v2/top-headlines?country=us&category=sports&q=nfl&apiKey=661826d0bdfe4381ace783308aa9216c"
        $.ajax({
            url: newsUrl,
            method: "GET"
        }).then(function (response) {
            console.log("TOP HEADLINES");
            console.log(response.articles);

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

    function displayLogo () {
        var logo = $("<img>");
        logo.attr("src", teamLogo);
        logo.addClass("logo");
        $("#team-logo").prepend(logo);
    }

    $("#scoreboard-div").hide();
    $("#articles").hide();
    $("#team-logo").hide();

    // $(".dropdown-item").on("click", function () {
    $(document).on("click", ".dropdown-item", function () {
        team = $(this).text();
        teamDashed = team.split(/\s+/).join('-');
        teamAbbr = $(this).attr("abbr");
        teamLogo = $(this).attr("img");

        $("#team-selection").text(team);
    });

    // adding to favorites
    $("#favorites-button").on("click", function () {
        if (!isFavorite && teamSelected) {
            isFavorite = true;
            // console.log(team);
            favoriteTeams.push(team);
            favoriteAbbr.push(teamAbbr);

            renderFavorites(favoriteTeams);

            localStorage.setItem("favoriteTeams", JSON.stringify(favoriteTeams));
            localStorage.setItem("favoriteAbbr", JSON.stringify(favoriteAbbr));

            $("#favorites-button").text(team + " Added to Favorites!");
        }
    });


    // $("#team-submit").on("click", function () {
    $(document).on("click", "#team-submit", function () {
        event.preventDefault();


        /* function mySelectValue() {
            // Add an event listener for the value
            document.getElementById('mySelectValue').addEventListener('change', function() {
              // Get the value of the name field.
              var mySelectValue = document.getElementById('mySelectValue').value;
        
              // Save the name in localStorage.
              localStorage.setItem('mySelectValue', mySelectValue);
            });
        } */

        // console.log(team);



        isFavorite = false;
        teamSelected = true;
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
        $("#team-logo").show();
        $("#team-logo").empty();
        $("#favorites-button").text("Add to Your Favorites");

        displayLogo();
        $("#team-logo").append("<h2>" + team + "</h3>");



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
            // console.log("========================");

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
            // console.log("SEATGEEK");
            // console.log(response.events);
            // console.log("========================");
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
            // console.log("MYSPORTSFEEDS");
            // console.log(response);
            // console.log("========================");

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
        // $("#team-submit").on("click", function(event){
        //     event.preventDefault();
        //     var teamName = $("#team-selection").val().trim();
        //     // alert(userTeamChoice)
        //     console.log("run")

        // }) 



    });

    topHeadlines();

    renderFavorites(favoriteTeams);

});