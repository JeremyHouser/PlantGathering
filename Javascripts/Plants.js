$.getJSON("https://jeremyhouser.github.io/PlantGathering/JSON/plants.json", function(data){
    $.each(data, function(i, field){
        $('#ScrollbarBox').append("<li>" + field.Name + "</li>");
    });
});
