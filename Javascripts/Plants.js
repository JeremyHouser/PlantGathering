
var plantsJson, rarityJson, locationJson;

//only works for rarityJson and locationJson
//or at least it will, when its FINISHED
function populateScrollable(data, text) {
    $.each(data, function(i, field)
    {
        $.each(field.Plants, function(j)
        {
            if (field.Name == text)
            {
                var containsPlant = true;
                $(".plantsClickable").each(function() {
                    if($.contains(field.Plants[j]))
                    {
                        containsPlant = false;
                    }
                });

                if (containsPlant) 
                {
                    $('.scrollable').append("<li class='plantsClickable'>" + field.Plants[j] + "</li>");
                }
            }
        });
    });
}

function FindPlantInRarity(plantName, jsonToSearch)
{    
    var plantRar;
    $.each(jsonToSearch, function(i, field) 
    {
        $.each(field.Plants, function(j, item)
        {
            if(item == plantName)
            {
                plantRar = field.Name;
                return false;
            }
        });
    });

    return plantRar;
}

function FindPlantInLocation(plantName)
{
    var location = "", location1 = "", location2 = "", location3 = "";
    var locCount = 0;
    $.each(locationJson, function(i, field)
    {
        $.each(field.Plants, function(j, item)
        {
            if(item == plantName)
            {
                ++locCount;
                if(locCount === 1)
                {
                    location = field.Name;
                    location1 = field.Name;
                }
                
                if(locCount === 2)
                {
                    location2 = field.Name;
                    location = location1 + " and " + location2
                }

                if(locCount === 3)
                { 
                    location3 = field.Name;
                    location = location1 + ", " + location2 + ", and " + location3;
                }
            }
        });
    });

    return location;
}

$.getJSON("https://jeremyhouser.github.io/PlantGathering/JSON/plants.json", function(data)
{
    plantsJson = data;
    $.each(plantsJson, function(i, field)
    {
        $('.scrollable').append("<li class='plantsClickable'>" + field.Name + "</li>");
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
    $(document).on('click', '.plantsClickable', function(event)
    {
        var desc;
        for (var i = 0, len = plantsJson.length; i < len; i++) 
        {
            if (plantsJson[i].Name === $(this).text())
            {
                $('#plantName').text(plantsJson[i].Name);
                $('#plantLocation').text(FindPlantInLocation(plantsJson[i].Name) + " • ");
                $('#plantRarity').text(FindPlantInRarity(plantsJson[i].Name, rarityJson));
                $('#plantInfo').text(plantsJson[i].Description);
                break;
            }
        }

        if($(this).text() == "Vortax")
        {
            $('#plantLocation').text("??? • ");
        }
    });
    
    $('#plantSearchBox').keyup(function() {
        var g = $(this).val().toLowerCase();
        if(g == ""){
            $('.plantsClickable').show();           
        } 
        else
        {
            $('li.plantsClickable').each(function(){
                var text = $(this).text().toLowerCase();
                (text.indexOf(g) >= 0) ? $(this).show() : $(this).hide();
            });
        }
    });  
    
    // click event that grabs name of clicked checkbox
    // and calls populateScrollable to populate ".scrollable"
    // with plants belonging to that rarity or environment
    $("#divRarGrp > input:checkbox").click(function() {
        $('.plantsClickable').remove();

                                                                    //foreach checked checkbox, call populate, check if name of plant is already in an li, order all li alphabetically by value
                                                                    //build here, turn into a function
        $("input:checkbox:checked").each(function () {
            populateScrollable(rarityJson, $(this).val());
        });
    });

    $("#divLocGrp1 > input:checkbox").click(function() {
        $('.plantsClickable').remove();

        $("input:checkbox:checked").each(function () {
            populateScrollable(rarityJson, $(this).val());
        });
    });

    $("#divLocGrp2 > input:checkbox").click(function() {
        $('.plantsClickable').remove();
        $("input:checkbox:checked").each(function () {
            populateScrollable(rarityJson, $(this).val());
        });
    });

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