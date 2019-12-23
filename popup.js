$(document).ready(function() {
  if (localStorage.getItem("accessToken")) {
    $('#loginDiv').hide();
    $('#logoutBtn').show();
    if (localStorage.getItem("annotationUserName")) {
      $('#userNameForH4Element').html(localStorage.getItem("annotationUserName"));
    }
  } else {
    $('#loginDiv').show();
    $('#logoutBtn').hide();
    $('#userNameForH4Element').html("anonym");
  }
  document.getElementsByTagName("html")[0].style.visibility = "visible";
});

$(function () {
  $('#loginBtn').click(() => {
    const userName = $('#username').val();
    const userPassword = $('#password').val();
    $.ajax({
      url: "https://happy-annotation-server.herokuapp.com/extLogin",
      type: 'post',
      dataType: 'json',
      data: {
        "username": userName,
        "password": userPassword
      },
      success: function (dataReturned) {
        if (dataReturned.message === "Incorrect password") {
          alert("Incorrect password");
        } else {
          const accessTokenValue = dataReturned.accessToken;
          localStorage.setItem("accessToken", accessTokenValue);
          const annotationUserName = dataReturned.username;
          localStorage.setItem("annotationUserName", annotationUserName);
          const annotationUserId = dataReturned.userid;
          localStorage.setItem("annotationUserId", annotationUserId);
          const annotationUserEmail = dataReturned.email;
          localStorage.setItem("annotationUserEmail", annotationUserEmail);
          $('#userNameForH4Element').html(annotationUserName);
          $('#loginDiv').hide();
          $('#logoutBtn').show();
          alert("Welcome " + annotationUserName + "!");
        }
      }
    });
  });

  $('#registerBtn').click(() => {
    // Messaging 2
    chrome.runtime.sendMessage({action: "NewTab"}, function(response) {
      console.log("NewTab message: " + response.message);
    });
  });

  $("#logoutBtn").click(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("annotationUserName");
    localStorage.removeItem("annotationUserId");
    localStorage.removeItem("annotationUserEmail");
    $('#userNameForH4Element').html("anonym");
    $('#loginDiv').show();
    $('#logoutBtn').hide();
  });

  $("#motivationBtn").click(() => {
    const mot = $("#motivation").val();
    localStorage.setItem("annotationMotivation", mot);
    $("#motSpan").html(mot);
    alert("Annotation motivation set to: " + mot);
  });

  $("#motivationRstBtn").click(() => {
    const mot = "highlighting";
    localStorage.setItem("annotationMotivation", mot);
    $("#motSpan").html(mot);
    alert("Annotation motivation set to: " + mot);
  });
});