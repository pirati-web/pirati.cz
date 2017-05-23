$( function() {
  var show_people = function(data) {
    var garant = null;
    $.each(data, function(index, person){
      if(person.uid=='{{page.garant}}') {
        garant=person;
        return
      }
    });

    $.get("{{'assets/snippet/profile.html' | relative_url}}", function (template) {
      var template=Handlebars.compile(template);
      var html = template(garant);
      $('#garant').append(html);
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
