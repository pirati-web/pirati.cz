$( function() {
  var availableNames = [
    {% for post in site.posts %}
    {
      value: "{{ post.url }}",
      label: "{{ post.title }}"
    },
    {% endfor %}
    {% for person in site.people %}
    {
      value: "{{ person.url }}",
      label: "{{ person.name }}"
    },
    {% endfor %}
    {% for page in site.pages %}
    {
      value: "{{ page.url }}",
      label: "{{ page.title }}"
    },
    {% endfor %}
  ];
  $( "#search" ).autocomplete({
    source: availableNames,
    select: function( event, ui ) {
      window.location.href = ui.item.value;
    }
  });
});
