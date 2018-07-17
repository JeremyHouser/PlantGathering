var plantsJson, rarityJson, locationJson;
$.getJSON("https://jeremyhouser.github.io/PlantGathering/JSON/plants.json", function(data)
{
    plantsJson = data;
    populateScrollable();
});

$.getJSON("https://jeremyhouser.github.io/PlantGathering/JSON/rarities.json", function(data)
{
    rarityJson = data;

    $.each(rarityJson, function(i, field)
    {
        $('#raritySelect').append("<option class='rarityOption'>" + field.Name + "</option>");
    });
});

$.getJSON("https://jeremyhouser.github.io/PlantGathering/JSON/locations.json", function(data)
{
    locationJson = data;

    $.each(locationJson, function(i, field)
    {
        $('#environmentSelect').append("<option class='environmentOption'>" + field.Name + "</option>");
    });
});

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

//only works for plantsJson
//populates all plants into .scrollable
function populateScrollable()
{
    $(".plantsClickable").remove();
    $.each(plantsJson, function(i, field)
    {
        $('.scrollable').append("<li class='plantsClickable'>" + field.Name + "</li>");
    });
}

function falseSubmit()
{
    return false;
}

function NoResults() 
{
    if(!($('.plantsClickable').is(':visible')))
    {
        if($('.noResults').length < 1)
        {
            $('.scrollable').append("<li class='noResults'>No Results!</li>");
        }
    }
    else if($('.noResults').length > 0)
    {
        $('.noResults').each(function()
        {
            $('.noResults').remove();
        });
    }
}

//this grabs anything matching the filters selected //////////////////////////////////////////???
function populateScrollableSelect(filterList)
{
    var currentlyIn = [];
    var exclNum = 0;
    $.each(filterList, function(i, v) 
    {
        if ($("input:radio:checked").val() == "include")
        {   
            //rarity filter
            //list of plants matching selected rarity
            $.each(rarityJson, function(i, field)
            {
                $.each(field.Plants, function(j, value)
                {
                    if (field.Name == v)
                    {
                        if ($.inArray(value, currentlyIn) == -1) {
                            currentlyIn.push(value);            
                        }
                    }
                });
            });      
            //location filter
            //list of plants matching selected location
            $.each(locationJson, function(i, field)
            {
                $.each(field.Plants, function(j, value)
                {
                    if (field.Name == v)
                    {
                        if ($.inArray(value, currentlyIn) == -1) {
                            currentlyIn.push(value);            
                        }
                    }
                });
            });
        }

        //exclusive
        else
        {
            if (exclNum == 0)
            {
                $.each(rarityJson, function(i, field)
                {
                    if (field.Name == v)
                    {
                        currentlyIn = field.Plants;
                    }
                });

                $.each(locationJson, function(i, field)
                {
                    if (field.Name == v)
                    {
                        currentlyIn = field.Plants;
                    }
                });
            }

            else
            {
                var temp = [];
                var crossCheck = [];
                $.each(rarityJson, function(i, field)
                {
                    if (field.Name == v)
                    {
                        crossCheck = field.Plants;
                    }
                });

                $.each(locationJson, function(i, field)
                {
                    if (field.Name == v)
                    {
                        crossCheck = field.Plants;
                    }
                });

                $.each(currentlyIn, function(ind, val) {
                    if ($.inArray(val, crossCheck) > -1) {
                    temp.push(val);            
                }});

                currentlyIn = temp;
            }

            exclNum++;
        }
    });
    
    currentlyIn.sort();

    //remove all elements for restock
    $('.plantsClickable').remove();

    if (currentlyIn.length == 0)
    {
        NoResults();
    }
    //restock fresh produce
    $.each(currentlyIn, function(k, pV)
    {
        $('.scrollable').append("<li class='plantsClickable'>" + pV + "</li>");
        NoResults();
    });
}   

//events
$(document).ready(function() {
    $('#plantSearchBox').val("");
    $('input:checkbox').prop('checked', false);

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
        
        if($('#plantLocation').text() == " • ")
        {
            $('#plantLocation').text("??? • ");
        }
    }); 
    
    //this is the search function, it searches only the li in .scrollable, completely isolating it from any bugs that exist in the populate methods
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
        
        //ensures that "No Results" only shows up once
        NoResults();
        
    });  
    
    // click event that grabs name of clicked checkbox and calls populateScrollable or populateScrollableSelect depending on if any checkbox is checked or not
    $(document).find("input:checkbox").click(function() {
        if ($("input:checkbox:checked").length)
        {
            var filterList = [];
            //this needs refining to cross reference
            $("input:checkbox:checked").each(function () {
                filterList.push($(this).val());
            });

            populateScrollableSelect(filterList);
        }

        else
        {
            populateScrollable();
        }
    });

    $("input:radio").change(function() {
        $("input:checkbox:checked").prop('checked', false);
        populateScrollable();

    });

//! everything past this point makes the roll tables work

    $("#roll20").click( function() 
    {
        var resultd20 = getRandomInt(1, 20);
        $("#resultd20").text(resultd20);
    });

    $("#roll100").click( function() 
    {
        var resultd100 = getRandomInt(1, 100);
        $("#resultd100").text(resultd100);
    });


    $('.item').mousemove( function(e) {
        $(this).children('p').show().css({'top': e.pageY + 10, 'left': e.pageX + 10});
    });
    
    $('.item').mouseleave( function() {
        $(this).children('p').hide();
    });
});

var dieNum;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
