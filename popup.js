document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('button').addEventListener('click',
    onclick, false)

    function onclick(){
        chrome.tabs.query({active: true, currentWindow: true}, 
        function(tabs) {
            chrome.windows.create({url: chrome.extension.getURL("popup.html"), type: "popup", top:20, left: 30, width: 300, height: 300});
            chrome.tabs.sendMessage(tabs[0].id, {createDiv: {width: "100px", height: "100px", innerHTML: "Hello"}}, function(response) {
        console.log(response.confirmation);
    });
});
    }
}, false)