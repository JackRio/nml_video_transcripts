
window.onload = function(){
    var server = "http://donald.ai.ru.nl/";
    // "http://127.0.0.1:5000";
    var transcript_endpoint = "/transcript";
    var topic_endpoint = '/topics';
    var summary_endpoint = '/summary'
    var info;
    var keywords_clicked = true;
    var big_font = false;
    var dark_mode = false;
    var options_clicked = false;
    var download_clicked = false;
    var about_clicked = false;
    var button_font = document.getElementById("button_font");
    var button_options = document.getElementById("button_options");
    var button_download = document.getElementById("button_download");
    var button_keywords = document.getElementById("button_keywords");
    var transcript_id_content = document.getElementById("transcript");
    var button_wrapper = document.getElementById("button-wrapper");
    var button_about = document.getElementById("button_about");
    var extopics = [];
    var video_id = 'M7lc1UVf-VE';

    ///////////// Embedded Video /////////////

    var myTimer;
    var tag = document.createElement('script');
    tag.id = 'iframe-demo';
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    var ytplayer;
    var result = '';
    
    function onPlayerReady(event) {
        event.target.playVideo();
        
      }
    function onPlayerStateChange(event){
        if(event.data==1) {
            myTimer = setInterval(function(){ 
                var time;
                time = ytplayer.getCurrentTime();
                transcript_id_content.innerHTML = useTimeStamp(result,time);
            }, 100);
        }
        else {
            clearInterval(myTimer);
        }
    }
    
    function useTimeStamp(result,time){
        final_str = "";
        for (ele in result){
            start_time = result[ele]['start'];
            end_time = start_time + result[ele]['duration'];
            
            if(time >= start_time && time <= end_time){
                final_str += '<a target="_blank" style="color:blue;font-weight:bold">' + result[ele]['text'] + '</a>' + " ";
            }
            else{
                final_str += result[ele]['text'] + " ";
            }
        }
        return postTranscript(extopics,final_str);
    }

    ///////////// Transcript functions /////////////

    getTab(keywords_clicked);

    function getTab(keywords_clicked, download_clicked){
        chrome.tabs.query({'active': true}, function (tabs) {
            info = {'url':tabs[0].url};
            video_id = urlToId(info.url);
            window.onYouTubePlayerAPIReady = function() {
                ytplayer = new YT.Player('ytplayer', {
                  height: '360',
                  width: '640',
                  videoId: video_id,
                  events: {
                    "onReady": onPlayerReady,
                    "onStateChange": onPlayerStateChange
                    }
                });
              }
            fetchTranscripts(server, transcript_endpoint, info, keywords_clicked, download_clicked);
        });
    }

    function fetchTranscripts(server, transcript_endpoint, info, keywords_clicked) {
        $.ajax({
            type:"POST",
            url: server + transcript_endpoint,
            data: JSON.stringify(info),
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: function(res){
                result = res['__transcript'];
                current_time = 0;
                final_str = useTimeStamp(result,current_time);
                transcript_id_content.innerHTML = final_str;
                
                if(keywords_clicked){
                    console.log('Keywords on');
                    fetchTopics(server, topic_endpoint, final_str);
                } else {
                    console.log('Keywords off');
                }

                if(download_clicked){
                    download_clicked = false;
                    download_transcript(final_str);
                }
                }
            });
    }

    function urlToId(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }

    function fetchTopics(server, topic_endpoint, final_str){
        $.ajax({
            type:"POST",
            url: server + topic_endpoint,
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: function(topics){
                extopics = topics;
                }
            });
    }

    function postTranscript(topics, final_str){
            console.log('top str: ', topics);
            for (ele in topics){
                topic_name = ele;
                url = topics[topic_name];
                // console.log('url', url);
                // console.log('name', topic_name);
                final_str = final_str.replace(topic_name, '<a href='+ url + ' target="_blank" style="color:red;">' + topic_name + '</a>');
            }
            return final_str;
        }


    ///////////// Button functions /////////////
    
    button_options.addEventListener('click', onclick_options, false);
    button_download.addEventListener('click', onclick_download, false);
    button_keywords.addEventListener('click', onclick_keywords, false);
    button_about.addEventListener('click', onclick_about, false);

    function onclick_keywords(){
        if(!keywords_clicked){
            button_keywords.innerHTML = "Remove keywords";
            keywords_clicked = true;
            getTab(keywords_clicked);
        } else if(keywords_clicked){
            button_keywords.innerHTML = "Add keywords";
            keywords_clicked = false;
            getTab(keywords_clicked);
        }
    }

    function onclick_options(){
        document.getElementById("button_dark_light").addEventListener('click', onclick_dark_light, false);
        document.getElementById("button_font").addEventListener('click', onclick_font, false);
       
        var options_menu = document.getElementById("options_menu");

        if(!options_clicked){
            button_options.innerHTML = "Close options";
            options_menu.style.display = "block";
            button_wrapper.style.padding = "0.5em 0 0 0";
            options_clicked = true;
        } else if (options_clicked){
            button_options.innerHTML = "Options";
            options_menu.style.display = "none";
            button_wrapper.style.padding = "0.5em 0.5em 0.5em 0.5em";
            options_clicked = false;
        }
    }

    function onclick_about(){
        if(!about_clicked){
            button_about.innerHTML = "Transcript";
            transcript_id_content.innerHTML = "About us...";
            about_clicked = true;
            
        } else if (about_clicked){
            button_about.innerHTML = "About";
            if(!keywords_clicked){
                getTab(keywords_clicked);
            } else if(keywords_clicked){
                getTab(keywords_clicked);
            }
            about_clicked = false;
        }
            
    }

    function onclick_font(){
        if(!big_font){
            button_font.innerHTML = "Smaller font";
            transcript_id_content.style.fontSize = "120%";
            big_font = true;
        } else if(big_font){
            button_font.innerHTML = "Bigger font";
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
        download_clicked = true;
        getTab(keywords_clicked, download_clicked);
    }

    function download_transcript(text){
        var filename = "transcript.txt";
        var element = document.createElement('a');

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
         
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
          
        document.body.removeChild(element);
        
    }

}
