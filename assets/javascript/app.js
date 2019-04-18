var animals = ["bengal cats", "dogs", "flamingos", "peacocks", "zebras", "tarantulas", "chinchilla", "sugar glider", "stingray"]
var still; 
var animate; 

//Creating buttons from each item in the animals array.   
function renderButtons() {
    $("#buttons").empty();
    for (var i = 0; i < animals.length; i++) {
        var b = $("<button>");
        b.addClass("animal");
        b.attr("data-animal", animals[i]);
        b.text(animals[i]);
        $("#buttons").append(b);
    }
}

renderButtons();

//On click event that allows the user to add their own animal button
$("#add-animal").on("click", function(event) {
    event.preventDefault();
    var animal = $("#animal-input").val().trim();
    animals.push(animal);
    renderButtons();
    $("#animal-input").val("")
})

// When the user clicks on an animal button, the page grabs 10 non-animated gif images from the GIPHY 
// API and places them on the page along with their title, rating, and an option to add it to a favorites list.
$(document).on("click", ".animal", function(event) {
    event.preventDefault();
    var animal = $(this).attr("data-animal");
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + animal + "&api_key=CkDb4iNUaEnCpSeLU73liEqBRBs3NNtE&limit=10";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        var results = response.data;

        for (var i = 0; i < results.length; i++) {
            
            var title = results[i].title;
            var rating = results[i].rating;

            var animalDiv = $("<div>");
            animalDiv.attr("id", "animal-div");

            var p = $("<p>").html("Title: " + title + "<br> Rating: " + rating);
            
            var animalImage = $("<img>");
            animalImage.attr("src", results[i].images.fixed_width_still.url);
            animalImage.attr("data-state", "still");
            animalImage.attr("id", "toAnimate");
            animalImage.attr("data-still", results[i].images.fixed_width_still.url);
            animalImage.attr("data-animate", results[i].images.fixed_width.url);

            var favorites = $("<button>");
            favorites.addClass("favorite");
            favorites.text("Add to Favorites!");
            favorites.attr("data-src", results[i].images.fixed_width_small.url);
            favorites.attr("data-title", results[i].title);

            animalDiv.append(animalImage);
            animalDiv.append(p);
            animalDiv.append(favorites);
            $("#images").after(animalDiv);
        } 
    }) 
})

// When the user clicks one of the still GIPHY images, the gif animates. 
// If the user clicks the gif again, it stops playing.
$(document).on("click", "#toAnimate", function() {
    var state = $(this).attr("data-state");

    if(state === "still") {
        $(this).attr("data-state", "animate");
        $(this).attr("src", $(this).attr("data-animate"));
    }
    else {
        $(this).attr("data-state", "still");
        $(this).attr("src", $(this).attr("data-still"));        
    }
})

//a variable named favArray that grabs the items in localStorage and parses them back into objects.
var favArray = JSON.parse(localStorage.getItem("favArray"));
if (favArray === null) {
    favArray = [];
  }

//creates a function named renderFavs that will take the items favorited, give them attributes, 
//and place them in a container
function renderFavs(){
    $('#favorites').empty()
    for (let i = 0; i < favArray.length; i++) {
        var favContainer = $("<figure>");
    
        var deleteFav = $("<button>");
        deleteFav.attr("data-index", i);
        deleteFav.text("remove");
        deleteFav.addClass("delete");

        favContainer.append("<img src=" + favArray[i].src + "><br>");
        favContainer.append(favArray[i].title + "<br>");
        favContainer.append(deleteFav);
        $('#favorites').prepend(favContainer);
    }
  };

renderFavs();

//on click event that will add the gify clicked to the array favArray and it will re-renderFavs
$(document).on("click", ".favorite", function() {
    event.preventDefault();
    var favSrc = $(this).attr("data-src");
    var favTitle = $(this).attr("data-title")

    var newFav = {
        title: favTitle,
        src: favSrc
    }

    favArray.push(newFav);
    renderFavs()
    localStorage.setItem("favArray", JSON.stringify(favArray)); 
})

//This on click event enables the user to delete a gif from their favorites list
$(document).on("click", ".delete", function() {
    var index = $(this).attr("data-index");
    favArray.splice(index, 1);
    renderFavs();
    localStorage.setItem("favArray", JSON.stringify(favArray));
})