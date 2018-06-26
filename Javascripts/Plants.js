
var plantsArray = [];
var rarityArray = [];
var locationArray = [];
var plantsJson, rarityJson, locationJson;

$.getJSON("https://jeremyhouser.github.io/PlantGathering/JSON/plants.json", function(data)
{
    plantsJson = data;
    $.each(data, function(i, field)
    {
        $('.scrollable').append("<a class='plantsClickable'>" + field.Name + "</a><br>");
    });
});

$.getJSON("https://jeremyhouser.github.io/PlantGathering/JSON/rarities.json", function(data)
{
    rarityJson = data;
});

$.getJSON("https://jeremyhouser.github.io/PlantGathering/JSON/locations.json", function(data)
{
    locationJson = data;
});



$(document).ready(function() {
    $(document).on('click', 'a.plantsClickable', function(event)
    {
        var desc;
        for (var i = 0, len = plantsJson.length; i < len; i++) 
        {
            if (plantsJson[i].Name === $(this).text())
            {
                $('#plantName').text(plantsJson[i].Name);
                $('#plantLocation').text(FindPlantInLocation(plantsJson[i].Name) + " • ");
                $('#plantRarity').text(FindPlantInRarity(plantsJson[i].Name));
                $('#plantInfo').text(plantsJson[i].Description);
                break;
            }
        }
    });
    
    function FindPlantInRarity(plantName)
    {    
        for (var i = 0, len = rarityJson.length; i < len; i++)
        {
            for (var a = 0, leng = rarityJson[i].Plants.length; a < leng; a++)
            {
                if (rarityJson[i].Plants[a] == plantName)
                {
                    return rarityJson[i].Name;
                }
            }
        } 
    }

    function FindPlantInLocation(plantName)
    {
        var location = "", location1 = "", location2 = "", location3 = "";
        var locCount = 0;
        for (var i = 0, len = locationJson.length; i < len; i++)
        {
            for (var a = 0, leng = locationJson[i].Plants.length; a < leng; a++)
            {
                if (locationJson[i].Plants[a] == plantName)
                {
                    ++locCount;
                    if(locCount === 1)
                    {
                        location = locationJson[i].Name;
                        location1 = locationJson[i].Name;
                    }
                    
                    if(locCount === 2)
                    {
                        location2 = locationJson[i].Name;
                        location = location1 + " and " + location2
                    }

                    if(locCount === 3)
                    { 
                        location3 = locationJson[i].Name;
                        location = location1 + ", " + location2 + ", and " + location3;
                    }
                }
            }
        }

        return location;
    }
    var $scrollable  = $(".scrollable"),
    $scrollbar   = $(".scrollbar"),
    height       = $scrollable.outerHeight(true),    // visible height
    scrollHeight = $scrollable.prop("scrollHeight"), // total height
    barHeight    = height * height / scrollHeight;   // Scrollbar height!

    

    // Scrollbar drag:
    $scrollbar.height(barHeight).draggable( {
        axis : "y",
        containment : "parent", 
        drag: function(e, ui) {
            $scrollable.scrollTop( scrollHeight / height * ui.position.top  );
        }
    });
    
    $scrollable.on("scroll", function() {
        $scrollbar.css({top: $scrollable.scrollTop() / height * barHeight });
    });
});




// Element scroll:
