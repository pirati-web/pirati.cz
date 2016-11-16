$( function() {
  var availableNames = [
    {% for post in site.posts %}
    { label: "{{ post.title }}", value: "{{ post.url }}" },
    {% endfor %}
    {% for person in site.people %}
    { label: "{{ person.name }}", value: "{{ person.url }}" },
    {% endfor %}
    {% for page in site.pages %}
    { label: "{{ page.title }}", value: "{{ page.url }}" },
    {% endfor %}
  ];
  $( "#search" ).autocomplete({
    source: availableNames,
    select: function( event, ui ) {
      window.location.href = ui.item.value;
    }
  });
});
