document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('button').addEventListener('click',
    onclick, false)

    function onclick(){
        chrome.tabs.query({active: true, currentWindow: true}, 
        function(tabs) {
            chrome.windows.create({url: chrome.extension.getURL("index.html"), type: "popup", top:20, left: 30, width: 300, height: 300});
        });
    }
}, false)