
window.onload = function(){
    console.log(document);
    
    var text = document.getElementById("window-content");
    console.log('txt: ', text);
    var str = text.innerHTML,
        reg = /chrome/ig; //g is to replace all occurences
        // multiple words: reg = /red|blue|green|orange/ig; 

    // replace word from regex back in original string + add hyperlink
    str = str.replace(/chrome/g, '<a href="https://www.google.com" target="_blank" style="color:red;">chrome</a>');

    // multiple words need splitting:
    // var toStr = String(reg);
    // var color = (toStr.replace('\/g', '|')).substring(1);
    // var colors = color.split("|");

    // if (colors.indexOf("red") > -1) {
    //     str = str.replace(/chrome/g, '<span style="color:red;">red</span>');
    // }


    document.getElementById("color-updated").innerHTML = str + "with a hyperlink.";
}
