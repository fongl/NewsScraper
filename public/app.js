$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append(
      "<p class='' data-id='" +
        data[i]._id +
        "'>" +
        data[i].title +
        "<br />" +
        data[i].link +
        "</p>"
    );
  }
});

$("#scrapeSome").on("click", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function(data) {
    console.log(data);
    location.reload();
  });
});

$(document).on("click", "p", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function(data) {
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<p id='commentDiv'></p>");
      if (data.notes) {
        $("#commentDiv").append("<ul id='commentList'>");
          for (var i = 0; i < data.notes.length; i++) {
            $('#commentList').append("<li id='" + data.notes[i]._id + "'>" + data.notes[i].comment + " " +
            "<button data-id='" + data.notes[i]._id +
            "' id='deletenote'>X</button></li>");
          }
        $('#commentDiv').append("</ul>");
      } else {
        $('#commentDiv').text("No Comment.");
      }
      $("#notes").append("<textarea id='commentInput' name='body'></textarea>");
      $("#notes").append(
        "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
      );

      if (data.note) {
        $("#commentInput").val(data.note.comment);
      }
    });
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      comment: $("#commentInput").val()
    }
  })
    .then(function(data) {
      console.log(data);
      $("#commentInput").val("");
    });

  $("#nameInput").val("");
  $("#commentInput").val("");
});

$(document).on("click", "#deletenote", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/notes/" + thisId,
  })
    .then(function(data) {
      console.log(data);
      location.reload();
    });
});