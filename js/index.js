/*
Extract text, add hyperlinks and color the words red
Remove time notations
*/

window.onload = function(){
    var request = new XMLHttpRequest();
    //request.open('GET', './Example_transcript.txt', false);
    //request.send();

    // fetch('/transcript')
    //   .then(function (response) {
    //       return response.text();
    //   }).then(function (text) {
    //       console.log('GET response text:');
    //       console.log(text); 
    //   });

    var server = "http://127.0.0.1:5000";
    var appdir = "/transcript";
  
    var info = {'url':'https://www.youtube.com/watch?v=flthk8SNiiE?'};

    $.ajax({
  
        type:"POST",
        url: server+ appdir,
        data: JSON.stringify(info),
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success: function(res){
  
            console.log(res);
        }
    })

    function getResponse(string) {
        $.ajax({
            url: '/conversation',
            headers: {
                'Content-Type':'application/json'
            },
            method: 'POST',
            dataType: 'json',
            data: '{ "question" : "'+ string +'"}'
        }).always( function(data) {
            if(data.status == 200){
                var dataArr = data.responseText.split('$')
                var datastr = dataArr.join();
                for(var i = 0;i<dataArr.length;i++){
                    appendBotChat(dataArr[i])
                    $('.chatlog').animate({scrollTop: 200000000});
    
                }
                if(document.getElementById("audio").classList.contains("fa-volume-up"))
                {
                    responsiveVoice.speak(datastr);
                }
            }
        });
    }

    //var getTranscript = '{{ __transcript | tojson }}';
    //console.log(getTranscript)
    var textfileContent = request.responseText;
    var keywords_clicked = false;
    var big_font = false;
    var dark_mode = false;
    var options_clicked = false;
    var about_clicked = false;
    var button_options = document.getElementById("button_options");
    var button_download = document.getElementById("button_download");
    var button_keywords = document.getElementById("button_keywords");
    var transcript_id_content = document.getElementById("transcript");
    var button_wrapper = document.getElementById("button-wrapper");
    var button_about = document.getElementById("button_about");
        
    transcript_id_content.innerHTML = textfileContent;
    var str = transcript_id_content.innerHTML;
    var str_keywords = "";
        //, reg = /page/ig; //g is to replace all occurences
        // multiple words: reg = /red|blue|green|orange/ig; 

    // replace duration notations with whitespace
    str_clean = str.replace(/", "start": (\d)+.(\d)+, "duration": (\d)+.(\d)+}, {"text": "/g, " ");
    str_clean = str_clean.replace(/\[{"text": "/, " ");
    str_clean = str_clean.replace(/", "start": (\d)+.(\d)+, "duration": (\d)+.(\d)+}\]/, " ");
    str_clean = str_clean.replace(/\\n/g, " ");

    transcript_id_content.innerHTML = str_clean;

    button_options.addEventListener('click', onclick_options, false);
    button_download.addEventListener('click', onclick_download, false);
    button_keywords.addEventListener('click', onclick_keywords, false);
    button_about.addEventListener('click', onclick_about, false);

    function onclick_keywords(){
        if(!keywords_clicked){
            str_keywords = str_clean.replace(/Flox/, '<a href="https://en.wikipedia.org/wiki/Flox" target="_blank" style="color:red;">Flox</a>');
            str_keywords = str_keywords.replace(/skydiver/, '<a href="https://en.wikipedia.org/wiki/Skydiver_(disambiguation)" target="_blank" style="color:red;">skydiver</a>');
            str_keywords = str_keywords.replace(/parachute/, '<a href="https://en.wikipedia.org/wiki/Parachute" target="_blank" style="color:red;">parachute</a>');
            str_keywords = str_keywords.replace(/function/, '<a href="https://en.wikipedia.org/wiki/function" target="_blank" style="color:red;">function</a>');
            str_keywords = str_keywords.replace(/terminal velocity/, '<a href="https://en.wikipedia.org/wiki/Terminal_velocity" target="_blank" style="color:red;">terminal velocity</a>');
            str_keywords = str_keywords.replace(/expression/, '<a href="https://en.wikipedia.org/wiki/Expression_(mathematics)" target="_blank" style="color:red;">expression</a>');
            str_keywords = str_keywords.replace(/square root/, '<a href="https://en.wikipedia.org/wiki/Square_root" target="_blank" style="color:red;">square root</a>');

            transcript_id_content.innerHTML = str_keywords;
            keywords_clicked = true;
        } else if(keywords_clicked){
            transcript_id_content.innerHTML = str_clean;
            keywords_clicked = false;
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

    function onclick_options(){
        document.getElementById("button_dark_light").addEventListener('click', onclick_dark_light, false);
        document.getElementById("button_font").addEventListener('click', onclick_font, false);
       
        var options_menu = document.getElementById("options_menu");

        if(!options_clicked){
            options_menu.style.display = "block";
            button_wrapper.style.padding = "0.5em 0 0 0";
            options_clicked = true;
        } else if (options_clicked){
            options_menu.style.display = "none";
            button_wrapper.style.padding = "0.5em 0.5em 0.5em 0.5em";
            options_clicked = false;
        }
        
        //chrome.windows.create({url: chrome.extension.getURL("../options.html"), type: "popup", top:0, left: 0, width: 600, height: 300});
    }

    function onclick_about(){
        if(!about_clicked){
            transcript_id_content.innerHTML = "About us...";
            about_clicked = true;
            
        } else if (about_clicked){
            if(!keywords_clicked){
                transcript_id_content.innerHTML = str_clean;
            } else if(keywords_clicked){
                transcript_id_content.innerHTML = str_keywords
            }
            about_clicked = false;
        }
            
    }

    function onclick_font(){
        if(!big_font){
            transcript_id_content.style.fontSize = "120%";
            big_font = true;
        } else if(big_font){
            transcript_id_content.style.fontSize = "100%";
            big_font = false;
        }
    }

    function onclick_dark_light(){

        if(!dark_mode){
            button_dark_light.innerHTML = 'Light mode';
            dark_mode = true;
            document.body.style.backgroundColor = 'rgb(80, 80, 80)';
            button_wrapper.style.backgroundColor = 'rgb(50, 50, 50)';
            button_wrapper.style.borderColor = 'rgb(50, 50, 50)';
            document.body.style.color = 'white';
        } else if(dark_mode){
            button_dark_light.innerHTML = 'Dark mode';
            dark_mode = false;
            document.body.style.backgroundColor = 'white';
            button_wrapper.style.backgroundColor = 'rgb(148, 148, 148)';
            button_wrapper.style.borderColor = 'rgb(148, 148, 148)';
            document.body.style.color = 'black';

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
