$.getJSON("https://jeremyhouser.github.io/PlantGathering/JSON/plants.json", function(data){
    $.each(data.content, function(i, field){
        $('#ScrollbarBox').append("<li>" + field.Name + "</li>");
    });
});
