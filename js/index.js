/*
Get text file content
*/
var request = new XMLHttpRequest();
request.open('GET', './Example_transcript.txt', false);
request.send();
var textfileContent = request.responseText;
var clicked = false;
var big_font = false;
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

    // replace duration notations with whitespace
    str_clean = str.replace(/", "start": (\d)+.(\d)+, "duration": (\d)+.(\d)+}, {"text": "/g, " ");
    str_clean = str_clean.replace(/\[{"text": "/, " ");
    str_clean = str_clean.replace(/", "start": (\d)+.(\d)+, "duration": (\d)+.(\d)+}\]/, " ");
    str_clean = str_clean.replace(/\\n/g, " ");
    document.getElementById("transcript").innerHTML = str_clean;

    document.getElementById('button_keywords').addEventListener('click', onclick_keywords, false)
    document.getElementById('button_font').addEventListener('click', onclick_font, false)
    document.getElementById('button_download').addEventListener('click', onclick_download, false)
    
    function onclick_keywords(){
        if(!clicked){
            str = str_clean.replace(/Flox/, '<a href="https://en.wikipedia.org/wiki/Flox" target="_blank" style="color:red;">Flox</a>');
            str = str.replace(/skydiver/, '<a href="https://en.wikipedia.org/wiki/Skydiver_(disambiguation)" target="_blank" style="color:red;">skydiver</a>');
            str = str.replace(/parachute/, '<a href="https://en.wikipedia.org/wiki/Parachute" target="_blank" style="color:red;">parachute</a>');

            document.getElementById("transcript").innerHTML = str;
            clicked = true;
        } else if(clicked){
            document.getElementById("transcript").innerHTML = str_clean;
            clicked = false;
        }
    // replace word from regex with hyperlink + color
    
    // multiple words need splitting:
    // var toStr = String(reg);
    // var color = (toStr.replace('\/g', '|')).substring(1);
    // var colors = color.split("|");

    // if (colors.indexOf("red") > -1) {
    //     str = str.replace(/chrome/g, '<span style="color:red;">red</span>');
    // }
    }

    function onclick_font(){
        if(!big_font){
            document.getElementById("transcript").style.fontSize = "120%";
            big_font = true;
        } else if(big_font){
            document.getElementById("transcript").style.fontSize = "100%";
            big_font = false;
        }
        
    }

    function onclick_download(){
        var filename = "transcript.txt";

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str_clean));
        element.setAttribute('download', filename);
         
        element.style.display = 'none';
        document.body.appendChild(element);
          
        element.click();
          
        document.body.removeChild(element);
        
          
    }

    
 }
  