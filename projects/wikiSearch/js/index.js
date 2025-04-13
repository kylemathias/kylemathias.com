/* jshint browser: true */
/* jshint unused:false */
/* eslint-env browser */
/* exported searchWiki offClick setWidth */
var input = document.getElementById("mySearch");
input.addEventListener("keyup", function (event) {
    "use strict";
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("myBtn").click();
    }
});

function searchWiki() {
    "use strict";
    var searchText = document.getElementById("mySearch").value,
        newWidth;

    if (searchText.length === 0) {
        document.getElementById("mySearch").style.width = "150px";
    } else {
        newWidth = "" + ((searchText.length + 5) * 13.8);
        document.getElementById("mySearch").style.width = newWidth + "px";
    }
    //take search box current elements
    //document.getElementById("demo").innerHTML = searchText;
    //take search box current elements     


    ajax(searchText);

    document.getElementById("demo").innerHTML = "";
    //clear the current focus
    document.activeElement.blur();
}

function ajax(searchText) {    
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&grnnamespace=0&prop=extracts&exlimit=max&explaintext&exintro&gsrsearch=" + searchText + "&callback=?",
        dataType: "jsonp",
        success: function (response) {

            $.each(response.query.pages, function (key, page) {
                
                var extract = page.extract.length > 200 ? page.extract.substring(0, 200) + "..." : page.extract;
                var delayInMilliseconds = 1000; //1 second

setTimeout(function() {
  //your code to be executed after 1 second
}, delayInMilliseconds);
                $("#demo").append('<div class="searchFormat w3-container w3-center w3-animate-right"><a class="animated bounce infinite" href="http://en.wikipedia.org/?curid=' + page.pageid + '" target="_blank"><h1>' + page.title + '</h1> <p>' + extract + '</p></a></div>');               
            });

        },
        error: function () {
            alert("Error retrieving search results, please refresh the page");
        }
    });
}

function offClick() {
    "use strict";
    var searchText = document.getElementById("mySearch").value,
        newWidth;

    if (searchText.length === 0) {
        document.getElementById("mySearch").style.width = "150px";
    } else {
        newWidth = "" + ((searchText.length + 5) * 13.8);
        document.getElementById("mySearch").style.width = newWidth + "px";
    }
}

function setWidth() {
    "use strict";
    document.getElementById("mySearch").style.width = "100%";
}