$( function() {
  console.log('Hello world');

  var mail = $("#mail");
  var mailsub = $("#mailsub");
  var search = $("#search");
  var searchsub = $("#searchsub");

  searchsub.click(function() {
    mail.hide();
    search.show();
    searchsub.click(function() {
      console.log("Hledám ", search.val());
    });
  });
  mailsub.click(function() {
    search.hide();
    mail.show();
    mailsub.click(function() {
      console.log("Jste zařazen:", mail.val());
    });
  });
  mailsub.click();

  var availableNames = [
    {% for post in site.posts %}{ label: "{{ post.title }}", value: "{{ post.url | relative_url }}" },{% endfor %}
    {% for person in site.people %}{ label: "{{ person.name }}", value: "{{ person.url | relative_url }}" },{% endfor %}
    {% for page in site.pages %}{ label: "{{ page.title }}", value: "{{ page.url | relative_url }}" },{% endfor %}
  ];
  search.autocomplete({
    source: availableNames,
    select: function( event, ui ) {
      window.location.href = ui.item.value;
    }
  });
});
