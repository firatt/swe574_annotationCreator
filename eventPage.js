var menuItem = {
  "id": "happySelection",
  "title": "Annotate it!",
  "contexts": ["selection"]
};
chrome.contextMenus.create(menuItem);

var anno = {};
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  // Messaging 1
  if (request.action == "annoTransfer") {
    anno = request.obj;
    sendResponse({ message: "Annotation object transferred" });
  }

  // Messaging 2
  if (request.action == "NewTab") {
    // var newURL = "http://localhost:3000/login";
    var newURL = "https://happy-annotation-server.herokuapp.com/login";
    chrome.tabs.create({ url: newURL });
    sendResponse({ message: "A new tab created with URL: " + newURL });
  }
});


chrome.contextMenus.onClicked.addListener(function (clickedData) {
  if (clickedData.menuItemId == "happySelection" && clickedData.selectionText) {
    const windowPrompt = window.prompt;
    window.prompt = function (message) {
      const input = windowPrompt(message);
      return input;
    };
    var bodyMessage = prompt('Please enter yor note');


    // alert(document.location.href);
    // Error in event handler: SyntaxError: Unexpected token o in JSON at position 1
    try {
      var annObj = JSON.parse(anno);
      annObj.body = bodyMessage;
      // annObj.url = location.href;
      if (localStorage.getItem("annotationUserId")) {
        annObj.userId = localStorage.getItem("annotationUserId");
        annObj.userName = localStorage.getItem("annotationUserName");
        annObj.userEmail = localStorage.getItem("annotationUserEmail");
        annObj.motivation = localStorage.getItem("annotationMotivation");
      } else {
        annObj.userId = "NA";
        annObj.userName = "NA";
        annObj.userEmail = "NA";
        annObj.motivation = localStorage.getItem("annotationMotivation");
      }
      annObj = JSON.stringify(annObj);
    } catch (error) {
      // Error in event handler: SyntaxError: Unexpected token o in JSON at position 1
    }
    
    // alert(window.location.href);

    $.ajax({
      type: "POST",
      async: true,
      url: "https://happy-annotation-server.herokuapp.com/setAnnotation",
      // url: "http://localhost:3000/setAnnotation",
      data: annObj,
      dataType: "json",
      contentType: "application/json; charset=utf-8" //,
      // success: function (msg) { alert("success") },
      // error: function (err) { alert(err.responseText) }
    });

  }
});