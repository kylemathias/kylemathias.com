var quote='';
var author='';
function getInfoApi(){
  
$.ajax({
      url: "https://api.forismatic.com/api/1.0/",
      jsonp: "jsonp",
      dataType: "jsonp",
      data: {
        method: "getQuote",
        lang: "en",
        format: "jsonp"
      }
    })
   
.done(function(data) {
  //create and add quote variable 
  quote = JSON.stringify(data.quoteText);
  //create and add author varible while removing the quites with regex
  author = JSON.stringify(data.quoteAuthor).split('"').join('');
  if(author == ''){ author = 'Unknown'};     
	
  $('#quote_content').empty().append(quote)
  $('#quote_content').append("<br>")
  $('#quote_content').append("\n - " + author)
    });
}



function buildTweetUrl(quote, author){
  var tweetUrl = 'https://twitter.com/intent/tweet?text=' + quote + '\n - '+ author;
  return tweetUrl;
  
}

getInfoApi();




$(document).ready(function() {
    $("#getMessage").on("click", function(){      
      getInfoApi();      
    });
  });
$(document).ready(function() {
    $("#tweetMessage").on("click", function(){
      // Only change code below this line.
      window.open(buildTweetUrl(quote, author), "_blank");
      // Only change code above this line.
    });
  });