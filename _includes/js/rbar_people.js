$( function() {
  var choice_3_random = function(data) {
    var choice = [];

    while(true) {
      var value = data[Math.floor(Math.random()*data.length)];
      if(value.description) {
        choice.push(value);
        if(choice.length == 3) {
          break;
        }
      }
    }
    return choice;
  };

  var show_people = function(data) {
    choice = choice_3_random(data)

    $.get("{{'assets/snippet/profile.html' | relative_url}}", function (template) {
      var template=Handlebars.compile(template);
      $.each(choice, function(index, value) {
        var html = template(value);
        $('#people').append(html);
      });
    }, 'html')
  }

  $.get("{{'api/people.json' | relative_url}}")
    .done(function(data) {
      show_people(data);
    })
    .fail(function(data) {
      console.log('Error in relatives articles:');
      console.log(data);
    });
});
