pirates.siteUrl = 'http://'+(document.location.hostname||document.location.host);
pirates.modal_triggers = document.body.querySelectorAll("[data-modal]");

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
pirates.makeModal = function(html){
  var modal = document.getElementsByClassName("l-micropage__modal")[0];
  modal.innerHTML = html;
  var scripts = modal.getElementsByTagName("script");
  for( var i=0; i < scripts.length; i++ ){
    eval(scripts[i].innerHTML);
  }
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
// Bind AJAX calls on click of target elements and displays is in modal
pirates.bindAjax = function(targets,root) {
  for (var i = 0; i < targets.length; ++i) {
    //console.log(targets[i].getAttribute('href'));
    // do whatever
    targets[i].addEventListener("click", function(event) {
      //your handler here
      event.preventDefault();
      var url = event.target.getAttribute('href');
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        var doc = this.responseXML;

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
        pirates.makeModal(html);
        window.requestAnimationFrame( function(){pirates.executeQue(pirates.priorityStack)} );
      }

      xhr.open("GET", url);
      xhr.responseType = "document";
      xhr.send();
    }, false);
  };
};

// Executes FIFO cue of JS functions - good practice to decouple JS workout from onload
pirates.executeQue = function (que) {
  if (que.length) {
    var queue = que;
    for (var q = 0; q < queue.length; q++) {
      var item = queue[q];
      item.call(this);
    }
    que.length = 0;
  }
};
// pirates.executePriorityQue = function () {
//   if (pirates.priorityStack.length) {
//     var queue = pirates.priorityStack;
//     pirates.priorityStack = [];
//     pirates.executeQue(queue);
//     window.requestAnimationFrame( queue );
//   }
// };
// Create CORS request - CORS is good for getting around cross domain restrictions
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

// converts CSV file to JSON string or JS object
//var csv is the CSV file with headers
pirates.csvToJSON = function (csv){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

    var obj = {};
    var currentline=lines[i].split(",");

    for(var j=0;j<headers.length;j++){
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);

  }
  return result; //JavaScript object
  //return JSON.stringify(result); //JSON
}

// make accounting object - a set of helpers to interface with Google Sheets based accounting database
pirates.accounting = {};

// Default url for data
pirates.accounting.dataUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrizm8fnK5qaLeUKOvqi7r19kC8TNB3hVT_LTh_1Ma1fKyBvOjiisyVJg-Qc3Nlcq1VHnMzg25_nPc/pub?gid=0&single=true&output=csv';

// Take raw processed CSV -> Object and reformat it for easier calculations
pirates.accounting.reformatStructure = function(array){
  var newStructure = {};
  var d = new Date();
  var y = d.getFullYear();
  var m = d.getMonth() + 1;
  newStructure.byAccount = {};
  newStructure.byCounterparty = {};
  for( var i in array ){
    var split = array[i].date.split('.');
    //only care bout past
    if(Number(split[2]) < y || (Number(split[2]) == y && Number(split[1]) <= m)){
      var reformatedPeriod = split[2]+'/'+("0" + split[1]).slice(-2);
      array[i].amount = parseInt(array[i].amount.replace('"',''));
      if( typeof(newStructure.byAccount['all']) == "undefined"){
        newStructure.byAccount['all'] = [];
      }
      if( typeof(newStructure.byAccount['all'][reformatedPeriod]) == "undefined"){
        newStructure.byAccount['all'][reformatedPeriod] = [];
        newStructure.byAccount['all'][reformatedPeriod].sum = 0;
        newStructure.byAccount['all'][reformatedPeriod].incomes = 0;
        newStructure.byAccount['all'][reformatedPeriod].expenses = 0;
      }
      if( typeof(newStructure.byAccount[array[i].account]) == "undefined"){
        newStructure.byAccount[array[i].account] = [];
      }
      if( typeof(newStructure.byAccount[array[i].account][reformatedPeriod]) == "undefined"){
        newStructure.byAccount[array[i].account][reformatedPeriod] = [];
        newStructure.byAccount[array[i].account][reformatedPeriod].sum = 0;
        newStructure.byAccount[array[i].account][reformatedPeriod].incomes = 0;
        newStructure.byAccount[array[i].account][reformatedPeriod].expenses = 0;
      }
      if( typeof(newStructure.byCounterparty[array[i].counterparty]) == "undefined"){
        newStructure.byCounterparty[array[i].counterparty] = [];
      }
      if( typeof(newStructure.byCounterparty[array[i].counterparty]) == "undefined"){
        newStructure.byCounterparty[array[i].counterparty] = [];
        newStructure.byCounterparty[array[i].counterparty].sum = 0;
      }
      newStructure.byAccount['all'][reformatedPeriod].push(array[i]);
      newStructure.byAccount['all'][reformatedPeriod].sum += Number(array[i].amount);
      newStructure.byAccount[array[i].account][reformatedPeriod].push(array[i]);
      newStructure.byAccount[array[i].account][reformatedPeriod].sum += Number(array[i].amount);
      if(array[i].amount < 0){
        newStructure.byAccount[array[i].account][reformatedPeriod].expenses += Number(array[i].amount);
        newStructure.byAccount['all'][reformatedPeriod].expenses += Number(array[i].amount);
      }else {
        newStructure.byAccount[array[i].account][reformatedPeriod].incomes += Number(array[i].amount);
        newStructure.byAccount['all'][reformatedPeriod].incomes += Number(array[i].amount);
      }
      newStructure.byCounterparty[array[i].counterparty].push(array[i]);
      newStructure.byCounterparty[array[i].counterparty].sum += Number(array[i].amount);
    }
  }
  return newStructure;
}

// take set of data and prepare chart series based on them
pirates.accounting.prepChartData = function(dataIn) {
  var data = {
    labels: Object.keys(dataIn),
    series: [
      [],[],[],[]
    ]
  };
  data.labels.sort();
  var cumulative = 0;
  for(var i=0; i<data.labels.length;i++){
    cumulative = Number(cumulative + dataIn[data.labels[i]].sum)
    data.series[0].push(dataIn[data.labels[i]].sum);
    data.series[1].push(dataIn[data.labels[i]].incomes);
    data.series[2].push(dataIn[data.labels[i]].expenses);
    data.series[3].push(cumulative);
  };
  return data;
}

// Handle account select event
pirates.accounting.onAccountSelect = function (event) {
  // You can use “this” to refer to the selected element.
  if(!event.target.value) alert('Please Select One');
  else{
    pirates.accounting.selectAccount(event.target.value);
  };
}

// Do magic that needs to be done to switch account
pirates.accounting.selectAccount = function(account) {
  var chartWrapper = document.getElementById("account_chart");
  var newChart = document.createElement('canvas');

  // if chart exist try to clear the data
  if(typeof(pirates.accountChart) == 'object'){
    pirates.accountChart.destroy();
    chartWrapper.innerHTML = '';
  }

  // if series not in cache prep them
  if( typeof(pirates.dataseries[account]) == "undefined"){
    pirates.dataseries[account] = pirates.accounting.prepChartData(pirates.accountingData.byAccount[account]);
  }
  //new Chartist.Line('#account_chart', pirates.dataseries['all']);

  // Append canvas tag and draw new chart onto it
  chartWrapper.appendChild(newChart);
  var mixedChart = new Chart(newChart, {
    type: 'bar',
    data: {
      datasets: [{
        label: 'Příjmy',
        data: pirates.dataseries[account].series[1],
        backgroundColor: "rgba(88,164,94,0.5)"
      }, {
        label: 'Výdaje',
        data: pirates.dataseries[account].series[2],
        backgroundColor: "rgba(201,29,46,0.5)"
      }, {
        label: 'Výsledek měsíce',
        data: pirates.dataseries[account].series[0],
        // Changes this dataset to become a line
        type: 'line',
        backgroundColor: "rgba(244,128,46,0.5)"
      }, {
        label: 'Stav účtu',
        data: pirates.dataseries[account].series[3],
        type: 'line',
        backgroundColor: "rgba(95,186,225,0.5)"
      }],
      labels: pirates.dataseries[account].labels
    },
    //options: options
  });

  // draw new table of accounting data
  var table = document.getElementById('account_table');
  table.innerHTML = '';
  pirates.accounting.makeTable(table,pirates.accountingData.byAccount[account],{'date':'Datum','item':'Položka','amount':'Částka','account':'Účet','invoice':'Doklad','counterparty':'Protistrana'});

  // return chart so it can be destroyed on redraw
  return mixedChart;
}

// Create table for accounting data
pirates.accounting.makeTable = function(tableElement, account, cols) {
  var thead = document.createElement('thead');
  var tr = document.createElement('tr');
  var colsKeys = Object.keys(cols);
  for(var i=0; i<colsKeys.length;i++){
    var td = document.createElement('td');
    td.innerHTML = cols[colsKeys[i]];
    tr.appendChild(td);
  };
  thead.appendChild(tr);
  tableElement.appendChild(thead);
  var tableKeys = Object.keys(account);
  tableKeys.sort();
  tableKeys.reverse();
  for(var i=0; i<tableKeys.length;i++){
    var tr = document.createElement('tr');
    tr.classList.add("w-accounting__group-heading");
    tr.innerHTML = '<td colspan="' + tableKeys.length + 1 + '" class=""><input type="checkbox" class="w-accounting__group-control" onchange="pirates.accounting.toggleRow.call(this, event);">'+tableKeys[i]+'</td>'
    tableElement.appendChild(tr);
    tableElement.appendChild(pirates.accounting.makeTbody(account[tableKeys[i]],colsKeys));
  };
}

// Create groups based on periods
pirates.accounting.makeTbody = function(array,cols){
  var fragment = document.createDocumentFragment();
  var tbody = document.createElement('tbody');
  tbody.classList.add("w-accounting__group");
  for(var i=0; i<array.length;i++){
    var keys = Object.keys(array[i])
    var tr = document.createElement('tr');
    for(var e=0; e<keys.length;e++){
      if (cols.includes(keys[e])){
        var td = document.createElement('td');
        if(keys[e]=='invoice' && array[i][keys[e]].includes('https://')){
          td.innerHTML = '<a href="'+array[i][keys[e]]+'" target="_blank"><i class="fa fa-external-link"></a>';
        }else{
          td.innerHTML = array[i][keys[e]];
        }
        tr.appendChild(td);
      }
    };
    tbody.appendChild(tr);
  }
  fragment.appendChild(tbody);
  return fragment;
}

// Handle the click on row control - toggle groups
pirates.accounting.toggleRow = function(event){
  var parent = this.parentNode;
  var grandParent = parent.parentNode;
  grandParent.classList.toggle('w-accounting__group-heading--opened');
}

// Add options to account select based on available data
pirates.accounting.makeControls = function(ctrl, data) {
  var accounts = Object.keys(data);
  var option = document.createElement('option');
  option.value = 'all';
  for(var i=0; i<accounts.length;i++){
    var option = document.createElement('option');
    option.value = accounts[i];
    option.innerHTML = accounts[i];
    ctrl.appendChild(option);
  };
}

window.requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function(f){return setTimeout(f, 1000/60)} // simulate calling code 60

window.cancelAnimationFrame = window.cancelAnimationFrame
  || window.mozCancelAnimationFrame
  || function(requestID){clearTimeout(requestID)} //fall back

// when all is loaded start executing loop
window.requestAnimationFrame( function(){pirates.executeQue(pirates.priorityStack)} );

// Random stuff not to be forgoten
// pirates.getDistinctByProp = function(array, property){
//   var unique = {};
//   var distinct = [];
//   for( var i in array ){
//     if( typeof(unique[array[i][property]]) == "undefined"){
//       distinct.push(array[i][property]);
//     }
//     unique[array[i][property]] = 0;
//   }
//   return distinct;
// }
// pirates.groupBy = function(xs, key) {
//   return xs.reduce(function(rv, x) {
//     (rv[x[key]] = rv[x[key]] || []).push(x);
//     return rv;
//   }, {});
// };
// can optimze data transformation
// function prepChartData(dataIn) {
//  var tmp = Object.keys(dataIn);
//  var tmp2 = {};
//  var data = {
//    labels: [],
//    series: [
//      []
//    ]
//  };
//  tmp.forEach(function(key) {
//    var split = key.split('/');
//    var formattedNumber = ("0" + split[0]).slice(-2);
//    tmp2[split[1]+'/'+formattedNumber] = key;
//  });
//  var tmp2Keys = Object.keys(tmp2);
//  tmp2Keys.sort();
//  tmp2Keys.forEach(function(key) {
//    data.labels.push(tmp2[key])
//    data.series[0].push(dataIn[tmp2[key]].sum)
//  });
//  return data;
// }