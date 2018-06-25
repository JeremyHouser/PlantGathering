$.getJSON("http://jeremyhouser.github.io/PlantGathering/JSON/plants.json", function(data){
    $.each(data.content, function(i, field){
        $('#ScrollbarBox').append("<li>" + i + "</li>");
    });
});
