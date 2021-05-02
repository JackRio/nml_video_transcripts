/*
Extract text, add hyperlinks and color the words red
Remove time notations
*/

window.onload = function(){
    var server = "http://127.0.0.1:5000";
    var transcript_endpoint = "/transcript";
    var topic_endpoint = '/topics';
    var summary_endpoint = '/summary'
    var info;
    var textfileContent;
    var keywords_clicked = false;
    var big_font = false;
    var dark_mode = false;
    var options_clicked = false;
    var about_clicked = false;
    var str_keywords = "";
    var button_options = document.getElementById("button_options");
    var button_download = document.getElementById("button_download");
    var button_keywords = document.getElementById("button_keywords");
    var transcript_id_content = document.getElementById("transcript");
    var button_wrapper = document.getElementById("button-wrapper");
    var button_about = document.getElementById("button_about");


    chrome.tabs.query({'active': true}, function (tabs) {
        info = {'url':tabs[0].url};
        fetchTranscripts(server, transcript_endpoint, info)
        
    });

    function fetchTranscripts(server, transcript_endpoint, info) {
        $.ajax({

            type:"POST",
            url: server + transcript_endpoint,
            data: JSON.stringify(info),
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: function(res){
                  result = res['__transcript'];
                  fetchTopics(server, topic_endpoint, info, result)
                }
            });
    }
    function fetchTopics(server, topic_endpoint, info, result){
        var final_str = '';
        for (ele in result){
            final_str += result[ele]['text'] + " "
        }
        transcript_id_content.innerHTML = final_str;
        
        $.ajax({

            type:"POST",
            url: server + topic_endpoint,
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: function(topics){
                console.log('topics: ', topics);
                postTranscript(topics, final_str);
                }
            });
    }

    function postTranscript(topics, final_str){
            console.log('top str: ', topics);
            for (ele in topics){
                topic_name = ele;
                url = topics[topic_name]
                console.log('url', url)
                console.log('name', topic_name);
                final_str = final_str.replace(topic_name, '<a href='+ url + ' target="_blank" style="color:red;">' + topic_name + '</a>');
            }
            transcript_id_content.innerHTML = final_str;
        }

    // replace duration notations with whitespace

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
