$(document).ready(function() {


  $(".textbox").bind("focus", function() {
    if (this.value == this.defaultValue) {
      this.value = "";
      $(this).removeClass("placeholder");
    }

  }).bind("blur", function() {

    var type = $(this).attr("name");
    var value = $(this).val();

    if (type == "email") {
      if (isEmail(value)) {
        $(this).removeClass("error");
        $("#error-" + type).text("");
      } else {
        $(this).addClass("error");
        $("#error-" + type).text("Email je v nesprávném formátu.");
        return;
      }
    }
    if (this.value == "") {
      $(this).trigger("keyup");
    }

  }).addClass("placeholder");

  $(".textbox").bind("keyup", function() {

    var type = $(this).attr("name");
    var value = $(this).val();

    if (value == "") {
      $(this).addClass("error");
      $("#error-" + type).text("Prosím vyplňte toto pole.");
      return;
    } else {
      $(this).removeClass("error");
      $("#error-" + type).text("");
    }

  });

});

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function parseUTM() {
  var querystring = document.location.search;
  if (!querystring) {
    return undefined;
  }
  // remove leading ?
  querystring = querystring.substring(1);
  querystring = querystring.split('&');

  var utms = {};
  for (var i = 0; i < querystring.length; i++) {
    var part = querystring[i];
    if (part && part.length > 4 && part.startsWith("utm_")) {
      var keyValue = part.split("=");
      if (keyValue.length > 1) {
        utms[keyValue[0].substring(4)] = keyValue[1];
      }
    }
  }

  return utms;
}

var utmParameters = parseUTM();

if (!$.isEmptyObject(utmParameters)) {
  var utmSource = utmParameters['source'];
  var utmMedium = utmParameters['medium'];
  var utmCampaign = utmParameters['campaign'];
} else {
  var utmSource = "";
  var utmMedium = "";
  var utmCampaign = "";
}
