Foundation.Interchange.SPECIAL_QUERIES['medium down'] = 'screen and (max-width: 63.9375em)';
$(document).foundation();
$(document).on('replaced.zf.interchange', function(e)
{
  $(this).foundation();
});
$("button[data-toggle]").on("click", function()
{
  if ($(this).parent().hasClass("js-button-toggled"))
  {
    $(this).parent().removeClass("js-button-toggled");
  }
  else
  {
    $(this).parent().addClass("js-button-toggled");
  }
});
window.onload = function() {};

/**
* Choice n random items from collection
* @param {collection} data - collection
* @param {integer} n -number of choicen
**/
var choice_n_random = function(data, n) {
  n = (typeof n !== 'undefined') ?  n : 3;
  var choice = [];
  while(true) {
    var value = data[Math.floor(Math.random()*data.length)];
    if(value.description) {
      choice.push(value);
      if(choice.length == n) {
        break;
      }
    }
  }
  return choice;
};

/**
* Choice one person by uid
* @param {collection} data
* @param {string} uid
* @param {string} role
**/
var choice_person = function(data, uid, role) {
  role = (typeof role !== 'undefined') ? role : null;
  var person = null;
  var result = null;
  $.each(data, function(index, person){
    if(person.uid==uid) {
      result=person;
      result['role'] = role;
      return;
    }
  });
  if(result) {
    return [result];
  } else {
    console.log("Proper profile for " + uid + " not exists.");
    return [{'name': uid, 'role': role}];
  }
}

/** @param {collection} data **/
var choice_garant = function(data) { return choice_person(data, page_garant, 'garant'); };
/** @param {collection} data **/
var choice_leader = function(data) { return choice_person(data, page_leader, 'předseda'); };
/** @param {collection} data **/
var choice_contact= function(data) { return choice_person(data, page_contact, 'kontaktní osoba'); };

/**
 * Show people in the #people
 * @param {collection} data
 * @param {callback} who
 * @param {string} where - #id
 **/
var show_people = function(data, who, where) {
  if(where.length) { /* Only if proper div exists */
    var choice = who(data);
    $.get(snippet_profile, function (template) {
      var compiled=Handlebars.compile(template);
      $.each(choice, function(index, value) {
        var html = compiled(value);
        where.append(html);
      });
    }, 'html')
  }
}

/**
 * @param {collection} data
 **/
var search = function(data) {
  $("#searchsub").click(function() {
    var exp = search.val();
    var url = "https://www.google.cz/?q=inurl:pirati.cz+" + exp;
    window.location.href = url;
  });
  $("#search").autocomplete({
    source: data,
    select: function( event, ui ) {
      window.location.href = ui.item.value;
    }
  });
}

var back_top = function() {
  $(window).scroll(function() {
      if ($(this).scrollTop() > 50 ) {
          $('.scrolltop:hidden').stop(true, true).fadeIn();
      } else {
          $('.scrolltop').stop(true, true).fadeOut();
      }
  });
  $(function(){
    $(".scroll").click(function(){
      $("html,body").animate(
        {scrollTop: $(".thetop").offset().top}, "1000");
      return false
    }
  )});
}

/**
 * @param {collection} data
 **/
var show_relatives = function(data) {
  var ul = $("#relatives");
  if(ul.length) {
    var global_tags = data[0];

    if(!page_tags.length) {
      $('#relatives-box').hide();
    }

    $.each(page_tags, function(index, tag) {
      $.each(global_tags[tag], function(index, post) {
        if(post.url != page_url) {
          var li = $('<li/>').appendTo(ul);
          var a = $('<a/>').text(post.title).attr('href',post.url).appendTo(li);
        }
      });
    });
  }
}

var hideEvents = function() {
  var day = new Date(this.attributes[0].value);
  if( day < today || showed > limit ) {
    $this = $(this);
    $this.hide();
  } else {
    showed += 1;
  }
}

/**
 * Hides old event at page plavba
 **/
var hideOldEvents = function() {
  var today = new Date();
  var showed = 0;
  var limit = 50;
  $('#boattrip').children().each(hideEvents);
  $('#roadtrip').children().each(hideEvents);
}

/**
 * Make map of czech regions for pirati.cz/regiony
 * @param {collection} data
 **/
var makemap = function(data) {
  var settings = data[0].settings;

  $(settings.id).width(settings.size.width);
  $(settings.id).height(settings.size.height);
  var R = Raphael(settings.id, settings.size.width, settings.size.height);

  $("#region-description>div").hide();

  var marked = null;
  var i = 0;
  var reg_list = $('#regions-list');
  var reg_list2 = $('#regions-list-2');

  var regions = data[0].regions;
  $.each(regions, function(index, region) {
    if(i < 7 ) {
      var li = $('<li/>').appendTo(reg_list);
      var span = $('<a/>').text(region.name).attr('href',region.url).appendTo(li);
    } else {
      var li2 = $('<li/>').appendTo(reg_list2);
      var span2 = $('<a/>').text(region.name).attr('href',region.url).appendTo(li2);
    }
    i++;

    var custom_attrs = {"title": region.name};
    var attrs = $.extend(settings.region_attrs, custom_attrs);

    if(settings.colors) {
      region.color = Raphael.getColor();
    } else {
      region.color = "#666";
    }
    var path_def = null;
    var reg_id = region.id;

    $.each(region.paths, function(index, path) {
      path = R.path(path).scale(
        settings.size.scale,
        settings.size.scale,
        0,0).attr(attrs);

        var click = function() {
          window.open(region.url);
        };
        var dblclick = function() {
          window.open(region.url);
        };
        var over = function() {
          path.animate({fill: region.color}, 500).attr({'cursor': "pointer"});
        };
        var out = function() {
          path.animate({fill: "#333"}, 500);
        };

        path[0].onclick = click;
        path[0].ondblclick = dblclick;
        path[0].onmouseover = over;
        path[0].onmouseout = out;
    });
  });
};

$(function() {
  /* Search */
  $.get(api_search)
    .done(search)
    .fail(function(data) { console.log('Error in search:', data); });

  /* Back to top */
  back_top();

  hideOldEvents();

  /* People and garant */
  $.get(api_people)
    .done(function(data) {
      show_people(data, choice_n_random, $('#people'));
      show_people(data, choice_garant,   $('#garant'));
      show_people(data, choice_leader,   $('#leader'));
      if(page_leader != page_contact) {
        show_people(data, choice_contact,  $('#contact'));
      }
    })
    .fail(function(data) { console.log('Error in relatives articles:', data); });

  /* Relatives */
  if($("#relatives").length) {
    $.get(api_tags)
      .done(function(data) { show_relatives(data) })
      .fail(function(data) { console.log('Error in relatives articles:', data); });
  }

  /* Regions */
  if($('#regions-map').length) {
    $.get(api_regions)
      .done(function(data) { makemap(data); })
      .fail(function(data) { console.log("Error: map"); });
  }
});
