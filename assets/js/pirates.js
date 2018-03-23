pirates.siteUrl = 'http://'+(document.location.hostname||document.location.host);
pirates.modal_triggers = document.body.querySelectorAll("a[data-modal]");

pirates.integrations = {

  redmine:{
    tasks: function(doc) {
      var element = document.createDocumentFragment();
      var table = document.createElement('table');
      var head = document.createElement('thead');
      var body = document.createElement('tbody');
      var hrow = document.createElement('tr');
      var hsubject = document.createElement('th');
      var hdone = document.createElement('th');
      hsubject.textContent = 'Název';
      hdone.textContent = 'Stav plnění';
      table.appendChild(head);
      table.appendChild(body);
      head.appendChild(hrow);
      hrow.appendChild(hsubject);
      hrow.appendChild(hdone);
      element.appendChild(table);
      for(var i in doc.issues) {
        var row = document.createElement('tr');
        var subject = document.createElement('td');
        var done = document.createElement('td');
        var link = document.createElement('a');
        link.textContent = doc.issues[i].subject;
        done.textContent = doc.issues[i].done_ratio+'%';
        link.href='https://redmine.pirati.cz/issues/'+doc.issues[i].id;
        link.target='_blank'
        subject.appendChild(link);
        row.appendChild(subject);
        row.appendChild(done);
        body.appendChild(row);
      }
      return element;
    }
  }
};

pirates.bindAjax = function(targets,root) {
  for (i = 0; i < targets.length; ++i) {
    console.log(targets[i].getAttribute('href'));
    // do whatever
    targets[i].addEventListener("click", function(event) {
      //your handler here
      event.preventDefault();
      var url = event.target.getAttribute('href');
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        var doc = this.responseXML;
        var modal = document.getElementsByClassName("l-micropage__modal")[0];
        var contentElement;
        var html = '';
        if (root === undefined) {
          contentElement = doc.getElementsByTagName("BODY");
        }else{
          contentElement = doc.querySelectorAll(root);
        }
        for (j = 0; j < contentElement.length; ++j) {
          var content = contentElement[j].innerHTML;
          html = html + content;
        }
        modal.innerHTML = html;
        modal.insertAdjacentHTML("afterend", '<span class=\"l-micropage__modal-close\">Zavřít</span>');
        modal.style.display = 'block';
        var closeTrigger = document.getElementsByClassName('l-micropage__modal-close')[0];
        closeTrigger.addEventListener("click", function(event) {
          modal.innerHTML = '';
          modal.style.display = 'none';
          closeTrigger.outerHTML = "";
          delete closeTrigger;
        });
      }

      xhr.open("GET", url);
      xhr.responseType = "document";
      xhr.send();
    }, false);
  };
};

pirates.executeQue = function (que) {
  for(var q=0; q< que.length; q++){
    que[q].call(this);
  }
};

pirates.createCORSRequest = function (method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

pirates.executeQue(pirates.priorityStack);