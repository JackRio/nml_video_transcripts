// Change search results into kittens:
// var images = document.getElementsByTagName('img');
// for (var i = 0, l = images.length; i < l; i++) {
//   images[i].src = 'http://placekitten.com/' + images[i].width + '/' + images[i].height;
// }



// TODO: Change the code for fetching YouTube link
document.addEventListener('DOMContentLoaded', function(){
    // Only execute the function when button is clicked
    document.getElementById('button_start').addEventListener('click', onclick, false)

    function onclick(){
        chrome.tabs.query({active: true, currentWindow: true}, 
        function(tabs) {
            chrome.windows.create({url: chrome.extension.getURL("../index.html"), type: "popup", top:20, left: 30, width: 800, height: 600});
        });
    }
}, false)