window.onload = function(){
    var server = "http://donald.ai.ru.nl";
    var transcript_endpoint = "/transcript";
    var topic_endpoint = '/topics';
    var summary_endpoint = '/summary'
    var clickrate_endpoint = '/click_rate'
    var info;
    var keywords_clicked = false;
    var big_font = false;
    var dark_mode = false;
    var options_clicked = false;
    var about_clicked = false;
    var hide_clicked = false;
    var h1_button_font = document.getElementById("h1_button_font");
    var button_font = document.getElementById("button_font");
    var h1_button_dark_light = document.getElementById("h1_button_dark_light");
    var button_dark_light = document.getElementById("button_dark_light");
    var h1_button_options = document.getElementById("h1_button_options");
    var button_options = document.getElementById("button_options");
    var h1_button_download = document.getElementById("h1_button_download");
    var button_download = document.getElementById("button_download");
    var h1_button_keywords = document.getElementById("h1_button_keywords");
    var button_keywords = document.getElementById("button_keywords");
    var transcript_id_content = document.getElementById("transcript");
    var button_wrapper = document.getElementById("button_wrapper");
    var h1_button_about = document.getElementById("h1_button_about");
    var button_about = document.getElementById("button_about");
    var button_code = document.getElementById("button_code");
    var transcript = document.getElementById("transcript");
    var ytplayer = document.getElementById("ytplayer");
    var loading_img = document.getElementById("loading_download");
    var button_hide = document.getElementById("button_hide");
    var img_hide = document.getElementById("img_hide");
    var button_ok = document.getElementById("button_ok");
    var form_popup = document.getElementById("form_popup");
    var options_menu = document.getElementById("options_menu");
    var extopics = [];
    var video_id = 'M7lc1UVf-VE';
    var dictionary = {};
    var target_var;
    var user_id;

    function objToString(dictionary){
        var str = '';
        for (const[name, nr] of Object.entries(dictionary)){
            str += name + ': ' + nr + ', ';
        }
        return str;
    }


   window.addEventListener("beforeunload", function (e) {
       clickrateToServer(dictionary);
       var confirmationMessage = "\o/";

       (e || window.event).returnValue = confirmationMessage;     //Gecko + IE
       return confirmationMessage;                                //Webkit, Safari, Chrome etc.
   });

    ///////////// Embedded Video /////////////

    var myTimer;
    var tag = document.createElement('script');
    tag.id = 'iframe-demo';
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    var ytplayer;
    var result = '';
    var result_summary = '';
    
    function onPlayerReady(event) {
        event.target.pauseVideo();
    }

    function onPlayerStateChange(event){
        if(event.data==1) {
            myTimer = setInterval(function(){ 
                var time;
                time = ytplayer.getCurrentTime();
                final_str = useTimeStamp(result,time);

                if(keywords_clicked){
                    transcript_id_content.innerHTML = postTranscript(extopics, final_str);
                } else {
                    transcript_id_content.innerHTML = final_str;
                }
            }, 400);
        }
        else {
            clearInterval(myTimer);
        }
    }

    function fmtMSS(s){
        return(s-(s%=60))/60+(9<s?':':':0')+s
    }

    function useTimeStamp(result,time){
        final_str = "";
        flag = true;
        for (ele in result){
            start_time = result[ele]['start'];
            end_time = start_time + result[ele]['duration']/2;
            
            if(time > start_time && time <= end_time && flag){
                final_str += '<a target="_blank" style="color:orange;font-weight:bold">' + `${fmtMSS(Math.round(start_time))} ` + result[ele]['text'] + '</a>' + " ";
                flag = false;
            }
            else{
                html_tag = `<p id=${start_time} class=transcript_sentences>` + `${fmtMSS(Math.round(start_time))} ` + result[ele]['text'] + '</p>'
                final_str += html_tag;
            }
        }
        return final_str;
    }

    ///////////// Transcript functions /////////////


    window.onload = initTranscript();

    function initTranscript(){
        chrome.tabs.query({'active': true}, function (tabs) {
            info = {'url':tabs[0].url};
            fetchTranscripts(server, transcript_endpoint, info)
            fetchTopics(server, topic_endpoint);
            onclick_keywords();
        });
        getTab()
     }

    function fetchSummary(server, summary_endpoint) {
        $.ajax({
            type:"POST",
            url: server + summary_endpoint,
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: save_summary
            });
    }

    function save_summary(res){
        result_summary = "\n\n\nSummary:\n" + res['summary'];
        dtranscript = final_str + result_summary;
        downloadpdf('transcript.pdf', dtranscript);
        loading_img.style.display = "none";
    }

    /*Fetching topics and storing it global variable*/
    function fetchTopics(server, topic_endpoint){
        $.ajax({
            type:"POST",
            url: server + topic_endpoint,
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: topic_save
            });
    }

    function topic_save(topics){
        extopics = topics;
    }

    /*Fetching transcript and storing it in global variable*/
    function fetchTranscripts(server, transcript_endpoint, info) {
        $.ajax({
            type:"POST",
            url: server + transcript_endpoint,
            data: JSON.stringify(info),
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: store_transcript,
            error: not_available
            });
    }
    
    function store_transcript(res){
        result = res['__transcript'];

        final_str = useTimeStamp(result,0);
        transcript_id_content.innerHTML = final_str;
    }

    function not_available(){
        alert("No available transcript for this video. We're sorry!");
    }

    function getTab(){
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
        });
    }

    function urlToId(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }

    function postTranscript(topics, final_str){
            for (ele in topics){
                topic_name = ele;
                url = topics[topic_name];
                final_str = final_str.replace(topic_name, '<a href='+ url + ' id="url_color" target="_blank">' + topic_name + '</a>');
            }
            return final_str;
        }

    function clickOrigin(e){
        target_var = e.target;
        var tag = [];
        tag.tagType = target_var.tagName.toLowerCase();
        tag.tagClass = target_var.className.split(' ');
        tag.id = target_var.id;
        tag.parent = target_var.parentNode.tagName.toLowerCase();
            
        return tag;
    }

    document.body.onclick = function(e){
        elem = clickOrigin(e);
        text = target_var.innerHTML;
        if (elem.tagType == 'a'){
            if (dictionary["" + (text) + ""] == null){
                dictionary["" + (text) + ""] = 1;
            } else{
                value = dictionary["" + (text) + ""]
                dictionary["" + (text) + ""] = value+1;
            }
        }
    }

    function clickrateToServer(file){
        $.ajax({
            type:"POST",
            url: server + clickrate_endpoint,
            data: JSON.stringify(file),
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: function(response){
                if(response != 0){
                   alert('Thank you for your participation!');
                }
                else{
                    alert('Something went wrong with submission.');
                }}
        });
    }


    ///////////// Button functions /////////////

    button_options.addEventListener('click', onclick_options, false);
    button_download.addEventListener('click', onclick_download, false);
    button_keywords.addEventListener('click', onclick_keywords, false);
    button_about.addEventListener('click', onclick_about, false);
    button_hide.addEventListener('click', onclick_hide, false);
    button_ok.addEventListener('click', onclick_popup, false);
    button_dark_light.addEventListener('click', onclick_dark_light, false);
    button_font.addEventListener('click', onclick_font, false);
    transcript_id_content.addEventListener("click", on_mouse_click, true);

    function on_mouse_click(){
       $(".transcript_sentences").click(function(){
            ytplayer.seekTo(this.id, true);
       });
    }

    function onclick_popup(){
        user_id_el = document.getElementById("user_id_text").value;
        if (user_id_el.length === 0){
            alert('Please enter a valid user ID');
        } else {
            user_id = user_id_el;
            form_popup.style.display = "none";
        }
        dictionary["user_id"] = user_id
    }
    
    function onclick_keywords(){
        if(!keywords_clicked){
            h1_button_keywords.innerHTML = "Remove keywords";
            keywords_clicked = true;
            transcript_id_content.innerHTML = postTranscript(extopics, final_str);
        } else if(keywords_clicked){
            h1_button_keywords.innerHTML = "Add keywords";
            keywords_clicked = false;
            transcript_id_content.innerHTML = final_str;
        }
    }

    function showWrapper(){
        button_code.style.display = "inline-flex";
        button_about.style.display = "inline-flex";
        button_download.style.display = "inline-flex";
        button_options.style.display = "inline-flex";
        button_wrapper.style.height = "9%";
    }
    
    function hideWrapper(){
        button_code.style.display = "none";
        button_about.style.display = "none";
        button_download.style.display = "none";
        button_options.style.display = "none";
        button_wrapper.style.height = "2%";
    }

    function showOptions(){
        button_dark_light.style.display = "inline-flex";
        button_font.style.display = "inline-flex";
        button_keywords.style.display = "inline-flex";
        options_menu.style.height = "9%";
    }

    function hideOptions(){
        button_dark_light.style.display = "none";
        button_font.style.display = "none";
        button_keywords.style.display = "none";
        options_menu.style.height = "0%";
    }

    function onclick_options(){
        if(!options_clicked){
            h1_button_options.innerHTML = "Close options";
            showOptions();
            options_clicked = true;
        } else if (options_clicked){
            h1_button_options.innerHTML = "Options";
            hideOptions();
            options_clicked = false;
        }
    }

    function onclick_about(){
        if(!about_clicked){
            h1_button_about.innerHTML = "Transcript";
            fetch('./js/about.json')
              .then(response => response.json())
              .then(data => {
                transcript_id_content.innerHTML = data['about_us'];
              });

            about_clicked = true;
            
        } else if (about_clicked){
            h1_button_about.innerHTML = "About";
            if(!keywords_clicked){
                 transcript_id_content.innerHTML = postTranscript(extopics, final_str);
            } else if(keywords_clicked){
                 transcript_id_content.innerHTML = final_str;
            }
            about_clicked = false;
        }
            
    }

    function onclick_font(){
        if(!big_font){
            h1_button_font.innerHTML = "Smaller font";
            transcript_id_content.style.fontSize = "120%";
            big_font = true;
        } else if(big_font){
            h1_button_font.innerHTML = "Bigger font";
            transcript_id_content.style.fontSize = "100%";
            big_font = false;
        }
    }

    function onclick_dark_light(){
        if(!dark_mode){
            h1_button_dark_light.innerHTML = 'Light mode';
            dark_mode = true;
            document.body.style.backgroundColor = 'rgb(80, 80, 80)';
            button_wrapper.style.backgroundColor = 'rgb(50, 50, 50)';
            button_wrapper.style.borderColor = 'rgb(50, 50, 50)';
            document.body.style.color = 'rgb(233, 233, 233)';
        } else if(dark_mode){
            h1_button_dark_light.innerHTML = 'Dark mode';
            dark_mode = false;
            document.body.style.backgroundColor = 'rgb(233, 233, 233)';
            button_wrapper.style.backgroundColor = 'rgb(148, 148, 148)';
            button_wrapper.style.borderColor = 'rgb(148, 148, 148)';
            document.body.style.color = 'black';
        }
    }

    function onclick_hide(){
        if(!hide_clicked){
            img_hide.src = "../images/down.png";
            hideWrapper();
            hideOptions();
            button_hide.style.height = "95%";
            hide_clicked = true;
        } else if (hide_clicked){
            img_hide.src = "../images/up.png";
            showWrapper();
            button_hide.style.height = "35%";

            if(options_clicked){
                h1_button_options.innerHTML = "Close options";
                showOptions();
            } else if (!options_clicked){
                h1_button_options.innerHTML = "Options";
                hideOptions();
            }
            hide_clicked = false;
        }
    }

    function onclick_download(){
        loading_img.style.display = "inline-block";
        fetchSummary(server, summary_endpoint)
    }

    function downloadpdf(filename, html){
        var doc = new jsPDF();      
        specialElementHandlers = {
            '#bypassme': function (element, renderer) {
                return true
            }
        };
        margins = {
            top: 0,
            bottom: 0,
            left: 10,
            width: 190
        };
        doc.fromHTML(
            html,
            margins.left, 
            margins.top, { 
                'width': margins.width, 
                'elementHandlers': specialElementHandlers
            },
            function (dispose) {
                doc.save(filename);
            }, margins
        );
        
    }

}
