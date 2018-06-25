
var plantsArray = [];
$.getJSON("https://jeremyhouser.github.io/PlantGathering/JSON/plants.json", function(data){
    $.each(data, function(i, field){
        $('#ScrollbarBox').append("<a class='plantsClickable'>" + field.Name + "</a><br>");
        var plantObject = new Object();
        plantObject.Name = field.Name;
        plantObject.Description = field.Description;
        plantsArray.Add(plantObject);
    });
});

$('.plantsClickable').on( "click", function(event){
       alert(plantsArray.find(plantOjbect.Name($(this).text())).Description);
});
