//Problems: 

var topics = ["bengal cats", "dogs", "flamingos", "peacocks", "zebras", "tarantulas", "chinchilla", "sugar glider", "stingray"]
var still; 
var animate; 

// Your app should take the topics in this array and create buttons in your HTML.
//    * Try using a loop that appends a button for each string in the array.
//from Week 6, Activity 10

function renderButtons() {
    $("#buttons").empty();
    for (var i = 0; i < topics.length; i++) {
        var b = $("<button>");
        b.addClass("animal");
        b.attr("data-animal", topics[i]);
        b.text(topics[i]);
        $("#buttons").append(b);
    }
}

renderButtons();

// When the user clicks on a button, the page should grab 10 static, non-animated gif images from the GIPHY 
// API and place them on the page.

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
            var p = $("<p>").html("Title: " + title + "<br> Rating: " + rating);
            var animalImage = $("<img>");

            var favorites = $("<button>");
            favorites.addClass("favorite");
            favorites.text("Add to Favorites!");
            favorites.attr("data-src", results[i].images.fixed_width_small.url);
            favorites.attr("data-title", results[i].title);

            animalImage.attr("src", results[i].images.fixed_width_still.url);
            animalImage.attr("data-state", "still");
            animalImage.attr("id", "toAnimate");
            animalImage.attr("data-still", results[i].images.fixed_width_still.url);
            animalImage.attr("data-animate", results[i].images.fixed_width.url);

            
            
            animalDiv.append(animalImage);
            animalDiv.append(p);
            animalDiv.append(favorites);
            $("#images").after(animalDiv);
        } 
    }) 
})

var favArray = JSON.parse(localStorage.getItem("favArray"));
if (favArray === null) {
    favArray = [];
  }

  console.log(favArray);
  

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

$(document).on("click", ".delete", function() {
    var index = $(this).attr("data-index");
    favArray.splice(index, 1);
    renderFavs()
    localStorage.setItem("favArray", JSON.stringify(favArray));
    // extract the object you want to delete from the favArray - splice()
    // you want store favArray back to localStore
    // renderFavs()
})

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

    // var favTitleandSrc = favTitle + favSrc;
    // localStorage.setItem("title and src", favTitleandSrc);
    // $("#favorites").html(favTitleandSrc);
    
    // localStorage.setItem("title", favTitle);
    // localStorage.setItem("src", favSrc);


    

})


// When the user clicks one of the still GIPHY images, the gif should animate. 
// If the user clicks the gif again, it should stop playing.
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



// Add a form to your page takes the value from a user input box and adds it into your `topics` array. 
// Then make a function call that takes each topic in the array remakes the buttons on the page.



$("#add-animal").on("click", function(event) {
    event.preventDefault();
    var animal = $("#animal-input").val().trim();
    topics.push(animal);
    renderButtons();
    $("#animal-input").val("")

})

