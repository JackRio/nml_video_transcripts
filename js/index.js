var request = new XMLHttpRequest();
request.open('GET', './Example_transcript.txt', false);
request.send();
var textfileContent = request.responseText;

window.onload = function(){
    document.getElementById("transcript").innerHTML = textfileContent;
    var text = document.getElementById("transcript");
    var str = text.innerHTML,
        reg = /page/ig; //g is to replace all occurences
        // multiple words: reg = /red|blue|green|orange/ig; 

    // replace word from regex back in original string + add hyperlink
    str = str.replace(/page/g, '<a href="https://www.google.com" target="_blank" style="color:red;">chrome</a>');

    // multiple words need splitting:
    // var toStr = String(reg);
    // var color = (toStr.replace('\/g', '|')).substring(1);
    // var colors = color.split("|");

    // if (colors.indexOf("red") > -1) {
    //     str = str.replace(/chrome/g, '<span style="color:red;">red</span>');
    // }


    document.getElementById("transcript").innerHTML = str;
}