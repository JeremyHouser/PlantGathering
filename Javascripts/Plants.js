
var plantsArray = [];
$.getJSON("https://jeremyhouser.github.io/PlantGathering/JSON/plants.json", function(data)
{
    $.each(data, function(i, field)
    {
        $('#ScrollbarBox').append("<a class='plantsClickable'>" + field.Name + "</a><br>");
        var plantObject = new Object();
        plantObject.Name = field.Name;
        plantObject.Description = field.Description;
        plantsArray.push(plantObject);
    });
});

$('.plantsClickable').on( "click", function(event)
{
    var desc;
    for (var i = 0, len = plantsArray.length; i < len; i++) 
    {
        if (plantsArray[i].Name === $(this).text())
        {
            desc = plantsArray[i].Description;
            break;
        }
    }
    
    alert(desc);
});
