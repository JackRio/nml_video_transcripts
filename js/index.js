/*
Get text file content
*/
var request = new XMLHttpRequest();
request.open('GET', './Example_transcript.txt', false);
request.send();
var textfileContent = request.responseText;

/*
Extract text, add hyperlinks and color the words red
Remove time notations
*/
window.onload = function(){
    document.getElementById("transcript").innerHTML = textfileContent;
    var text = document.getElementById("transcript");
    var str = text.innerHTML
        //, reg = /page/ig; //g is to replace all occurences
        // multiple words: reg = /red|blue|green|orange/ig; 

    // replace time notations with whitespace
    str = str.replace(/\d{2}:\d{2}/g, " ");

    // replace word from regex with hyperlink + color
    str = str.replace(/chrome/, '<a href="https://en.wikipedia.org/wiki/Google_Chrome" target="_blank" style="color:red;">chrome</a>');
    str = str.replace(/slideshow/, '<a href="https://en.wikipedia.org/wiki/Slide_show" target="_blank" style="color:red;">slideshow</a>');
    str = str.replace(/jQuery/, '<a href="https://en.wikipedia.org/wiki/JQuery" target="_blank" style="color:red;">jQuery</a>');

    // multiple words need splitting:
    // var toStr = String(reg);
    // var color = (toStr.replace('\/g', '|')).substring(1);
    // var colors = color.split("|");

    // if (colors.indexOf("red") > -1) {
    //     str = str.replace(/chrome/g, '<span style="color:red;">red</span>');
    // }


    document.getElementById("transcript").innerHTML = str;
}