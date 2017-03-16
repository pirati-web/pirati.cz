$( function() {
  var show_relatives = function(data) {
    var ul = $("#relatives");
    var global_tags = data[0];
    var post_tags = {{page.tags | split: ' '}};

    if(!post_tags.length) {
      $('#relatives-box').hide();
    }

    $.each(post_tags, function(index, tag) {
      $.each(global_tags[tag], function(index, post) {
        var li = $('<li/>').appendTo(ul);
        var a = $('<a/>').text(post.title).attr('href',post.url).appendTo(li);
      });
    });
  }

  $.get("{{'api/tags.json' | relative_url}}")
      .done(function(data) {
        show_relatives(data)
      })
      .fail(function(data) {
          console.log('Error in relatives articles:');
          console.log(data);
      });
});
