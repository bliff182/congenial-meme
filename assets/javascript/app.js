$(document).ready(function () {

    /* $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
    }) */

    $("#team-submit").on("click", function () {
        var team = $("#team-selection").val().trim().split(/\s+/).join('-');
        console.log(team);

        var newsUrl = "https://newsapi.org/v2/everything?qInTitle=" + team + 
        "&language=en&sortBy=publishedAt&from=2019-10-15&apiKey=661826d0bdfe4381ace783308aa9216c";

        var seatgeekUrl = "https://api.seatgeek.com/2/events?performers.slug=" + team + "&client_id=MTkwNTE3NjN8MTU3MTg1OTczOS4yNA";

        $.ajax({
            url: newsUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);
        });

        $.ajax({
            url: seatgeekUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            // console.log(response.events);
        });

    });
});

// News API 
// https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=661826d0bdfe4381ace783308aa9216c
