$(document).ready(function () {

    /* $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
    }) */

    $("#team-submit").on("click", function() {
        var team = $("#team-selection").val().trim();
        // console.log(team);

        var queryUrl = "https://newsapi.org/v2/everything?country=us&category=sports&q=" + team + "&apiKey=661826d0bdfe4381ace783308aa9216c";

        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response) {
            console.log(response);
        });

    });
});

// News API 
// https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=661826d0bdfe4381ace783308aa9216c
