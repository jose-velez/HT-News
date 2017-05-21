$(document).ready(function(){
  $(".save").on("click", function(event){
    var btn = $(this);
    var id = btn.attr("data-id");
    $.ajax({
      url: "/" + id,
      method: "PUT"
    }).donde(function(data){
      if (data.success === true){
        console.log("saved succesfully");
        btn.addClass("hidden");
      }
    });
  });
  $(".saveNote").on("click", function(event){
    var btn = $(this);
    var id = btn.attr("data-id");
    var note = $(".note").val().trim();

    $(".modal").hide();
    $.ajax({
      url: "/savenote/" + id,
      method: "POST"
    }).done(function(data){
      if(data.success === true){
        console.log("Note added");
      }
    });
  });
});
