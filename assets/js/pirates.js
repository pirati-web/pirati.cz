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
        done.style.width = '15%';
        link.href='https://redmine.pirati.cz/issues/'+doc.issues[i].id;
        link.target='_blank'
        subject.appendChild(link);
        row.appendChild(subject);
        row.appendChild(done);
        body.appendChild(row);
      }
      return element;
    },
    
    vysledky: function(doc) {
      divCopy=$(".accordion .cloner").clone(true);
      divCopy.css('display', 'true');
      for(var i in doc.issues) {
        var divNew=divCopy.clone().appendTo(".accordion");
        //$("a.accordion-title",divNew).text("("+doc.issues[i].id+") "+doc.issues[i].subject+" ["+doc.issues[i].assigned_to.name+"]");
        if (doc.issues[i].description!="") {
          descHtml=md.render(doc.issues[i].description); 
          var mess = $.parseHTML(descHtml);
          bd = $('#inv').html('').append(mess);
          first_p = bd.find('p:first').html();
          bd.find('p:first').remove();
          desc_rest=bd.html();
          } else {
          descHtml="Podrobný popis chybí ...";
          first_p="";
          desc_rest="";
          }
        $("a.accordion-title",divNew).html("<h3>"+doc.issues[i].subject+"</h3><p style='font-size:120%;'>"+first_p+"</p>");
        $("div.accordion-content a.redmine-href",divNew).attr("href", 'https://redmine.pirati.cz/issues/'+doc.issues[i].id);
        $("div.accordion-content div.content",divNew).html(desc_rest);
        $("div.accordion-content div.content",divNew).attr('id', 'markdown_'+doc.issues[i].id);
        divNew.show();
        }
      Foundation.reInit('accordion');      
    },
    
    analytici: function(doc) {
      
      var d = new Date();
      var tsm2 = d.getMilliseconds() + d.getSeconds()*1000;
      icons={};
      pref={
      'test-medialnich-vystupu':20,
      };

      // clone
      masCopy=$("#masonry_container").clone(true);
      divCopy=$("#masonry_container .cloner2").clone(true);      
      divCopy.css('display', 'true');
      
      // adding beside DOM (not reflowing after each append)
      // todo: rewrite jqury routines to vanilla (much faster)
      var c=$("<div />").addClass('container');
      
      var proj=[];
      var masNew=[];
      var inv=$('#redmine_vysledky #inv');
            
      var nav = document.querySelector('#sticky-nav');
      
      var pocetdoc=doc.issues.length;
      console.log('Pocet polozek:'+pocetdoc);

      //sort
      doc.issues=sortJSONbyPriority(doc.issues);
      //doc.issues=sortJSON(doc.issues,pref);
      
      for(var i in doc.issues) {
        pd=doc.issues[i].project.name;
        pid=slug($.trim(pd));
        // main sections (resorts)
        if (jQuery.inArray(pid,proj)==-1) {
          proj.push(pid);
          masNew[pid]=masCopy.clone().appendTo(c);            
          masNew[pid].attr("id","ms_"+pid);
          if (icons[pid]!==undefined) {
            $(".head",masNew[pid]).html("<img style='width:1.1em;height:1.1em;' src='/assets/img/program/"+icons[pid]+"' alt='"+pd+"'>&nbsp;<span>"+pd+"</span>");
            } else {
            $(".head",masNew[pid]).text(pd);
            }
          /*  
          // add navigation link to sticky nav
          var navlink = document.createElement('a');
          navlink.setAttribute('href',"#ms_"+pid);
          if (icons[pid]!==undefined) {
            navlink.innerHTML = "<img src='/assets/img/program/"+icons[pid]+"' alt='"+pd+"'>&nbsp;<span>"+pd.substr(7)+"</span>";
            } else {
            navlink.innerHTML = pd;
            }
          nav.appendChild(navlink);
          */  
          }
        // content  
        var divNew=divCopy.clone().appendTo(masNew[pid]);
        if (doc.issues[i].description!="") {
          descHtml=md.render(doc.issues[i].description); 
          var mess = $.parseHTML(descHtml);
          doc.issues[i].desc_html=descHtml;
          bd = inv.html('').append(mess);
          first_p = bd.find('p:first').html();
          bd.find('p:first').remove();
          desc_rest=bd.html();
          } else {
          descHtml="Podrobný popis chybí ...";
          doc.issues[i].desc_html=descHtml;
          first_p="";
          desc_rest="";
          }
        prio=doc.issues[i].priority.id;
        if (prio>=5) divNew.removeClass('medium-4').removeClass('large-3').addClass('medium-8').addClass('large-6'); 
        $(".nadpis",divNew).html(doc.issues[i].subject);
        //parsing image
        if ("custom_fields" in doc.issues[i]) {
          $.each( doc.issues[i].custom_fields, function( key, value ) {
            if ((value.id==48) && (value.value!="")) {
              first_p="<img src='"+value.value+"' style='margin-bottom:0.6em;'><br/>"+first_p;
              doc.issues[i].img=value.value;
              }             
            });
          }
        first_p=first_p.replace(/ ([ai]|[kosuvz]|do|ke|na|od|po|se|ve|za|ze) /gi, " $1&nbsp;");  
        $(".perex",divNew).html(first_p);
        $("a.mas_content",divNew).data( "id", doc.issues[i].id);
        $("a.mas_content",divNew).data( "index",i);
        divNew.attr("id",doc.issues[i].id);
        divNew.show();
        }
        
      $("#redmine_vysledky").append(c);  
        
      var d = new Date();
      var tsm4 = d.getMilliseconds() + d.getSeconds()*1000;
      console.log('Populating DOM (optimized jQuery):'+(tsm4-tsm2)+'ms');
      
      // after data processing
        
      $(document).ready(function () {
        $("#loading").fadeOut("slow");
             
        var url=window.location.href;
        var path=window.location.pathname;
        var hash=window.location.hash;
        console.log('url:'+url);
        console.log('path:'+path);
        console.log('hash:'+hash);
        console.log('starting masonry ...');
        
        // masonry initialization (resort)
        var container = document.querySelector('#redmine_vysledky');
        var msnry=[];
        $.each(proj, function( key, value ) {
          var msid="#ms_"+value;
          msnry[key] = new Masonry("#ms_"+value, {
            itemSelector: '#ms_'+value+' .grid-item',
            columnWidth: '#ms_'+value+' .grid-sizer',
            percentPosition: true
            });
          var mscont = document.querySelector(msid);  
          imagesLoaded( mscont, function( instance ) {
            //console.log('all images in '+msid.substr(4)+' are loaded');
            msnry[key].layout();
            });
          });
          
        imagesLoaded( container, function( instance ) {
          /*
          $("#sticky-nav a").each(function(index) { $(this).addClass('loaded') });
          $("#sticky-nav").addClass('loaded');
          */
          console.log('all images are loaded');
          
          //show actual issue detail when hash or scroll to resort
          if (hash!='') {
            var navheight=20;
            cmq=Foundation.MediaQuery.current;
            if ((cmq!='mobile') && (cmq!='small')) var active=true; else active=false; 
            var stuck=$("#sticky-nav").hasClass('is-stuck'); 
            if (active) navheight+=$("#sticky-nav").height();
            //console.log('hash - sticky active:'+active+', stuck:'+stuck+', navheight:'+navheight);
            // scroll to resort
            var resort_id=hash.substr(1);
            if (jQuery.inArray(resort_id,proj)>-1) {
              console.log('searching resort id '+resort_id);
                $('html, body').animate({
                  scrollTop: $("#ms_"+resort_id).offset().top-navheight
                  }, 200);
              } else {
              // scroll to issue
              var target_id=hash.substr(1,5);
              console.log('searching for id '+target_id);
              if($("#"+target_id).length != 0) {
                $('html, body').animate({
                  scrollTop: $("#"+target_id).offset().top-navheight
                  }, 200);
                $("#"+target_id+" a.mas_content").trigger("click");
                $("#"+target_id+" .callout").addClass('active');
                }            
              }
            }  
          
          // smoothscroll to resorts  
          $("#sticky-nav a").each(function(index) {
             $(this).click(function(event) {             
              event.preventDefault();
              var navheight=20;
              cmq=Foundation.MediaQuery.current;
              if ((cmq!='mobile') && (cmq!='small')) var active=true; else active=false;
              var stuck=$("#sticky-nav").hasClass('is-stuck'); 
              if (active) navheight+=$("#sticky-nav").height();
              //console.log('nav click - sticky active:'+active+', stuck:'+stuck+', navheight:'+navheight);
              var link=$(this).attr('href');
              window.history.pushState({}, null, '#'+link.substr(4));
              $('html, body').animate({
                scrollTop: $(link).offset().top-navheight
                }, 200);              
              }); 
            }); 
        });
        
        // reveal issue details (hash)
        $("#redmine_vysledky a.mas_content").each(function(index) {
          $(this).click(function(event) {
            event.preventDefault();
            $(".callout.active").removeClass('active');
            $(this).parent('div.callout').addClass('active');
            var i=$(this).data("index");
            var head=doc.issues[i].subject;
            var desc=doc.issues[i].desc_html;
            $("#reveal1 .head").text(head);          
            $("#reveal1 .desc").html(desc.replace(/ ([ai]|[kosuvz]|do|ke|na|od|po|se|ve|za|ze) /gi, " $1&nbsp;"));
            $("#reveal1 .desc a").each(function(index) {$(this).attr('target', '_blank');});
            if ("img" in doc.issues[i]) {
              $("#reveal1 .img").attr('src',doc.issues[i].img).hide().fadeIn('slow');
              } else {
              $("#reveal1 .img").hide();
              }          
            if (!("assigned_to" in doc.issues[i])) {
              $("#reveal1 .autor").html('nepřiřazeno');
              } else {  
              $("#reveal1 .autor").html(doc.issues[i].assigned_to.name);
              }
            newpath=path+'#'+$(this).data("id")+'_'+slug(head);
            $("#reveal1 a.permalink").attr("href", newpath);
            $("#reveal1").foundation('open');
            console.log('modal open: '+newpath);
            window.history.pushState({}, null, newpath);
            });
          });            
        
        $(document).on('closed.zf.reveal', '[data-reveal]', function () {
          window.history.replaceState({}, null, path);
          });            

        $(window).on('popstate', function() {
          $("#reveal1").foundation('close');
          });
                   
      });                    
    },
    
    mpv: function(doc,aId, type) {
      
      var d = new Date();
      var tsm2 = d.getMilliseconds() + d.getSeconds()*1000;
      icons={};
      pref={
      'test-medialnich-vystupu':20,
      };

      // clone
      masCopy=$("#masonry_container").clone(true);
      divCopy=$("#masonry_container .cloner2").clone(true);      
      divCopy.css('display', 'true');
      
      // adding beside DOM (not reflowing after each append)
      // todo: rewrite jqury routines to vanilla (much faster)
      var c=$("<div />").addClass('container');
      
      var proj=[];
      var masNew=[];
      masNew[aId]=masCopy.clone().appendTo(c);
         
      var inv=$('#redmine_vysledky #inv');
            
      var nav = document.querySelector('#sticky-nav');
      
      var pocetdoc=doc.issues.length;
      console.log('Pocet polozek:'+pocetdoc);

      //sort
      doc.issues=sortJSONbyPriority(doc.issues);
      
            
      for(var i in doc.issues) {
        pd=doc.issues[i].project.name;
        pid=slug($.trim(pd));
        if (type==1) {
          if (doc.issues[i].hasOwnProperty('assigned_to')) {
            var asId=doc.issues[i].assigned_to.id;
            } else {
            var asId=-1;
            }
          } else {
          if (doc.issues[i].hasOwnProperty('project')) {
            var asId=slug($.trim(doc.issues[i].project.name));
            } else {
            var asId=-1;
            }
          }  
        if (asId == aId) {
        var divNew=divCopy.clone().appendTo(masNew[aId]);
          var first_p="";
          if (doc.issues[i].description!="") {
            descHtml=md.render(doc.issues[i].description); 
            var mess = $.parseHTML(descHtml);
            doc.issues[i].desc_html=descHtml;
            bd = inv.html('').append(mess);
            first_p = bd.find('p:first').html();
            bd.find('p:first').remove();
            desc_rest=bd.html();
            } else {
            descHtml="Podrobný popis chybí ...";
            doc.issues[i].desc_html=descHtml;
            first_p="";
            desc_rest="";
            }
          prio=doc.issues[i].priority.id;
          $(".nadpis",divNew).html(doc.issues[i].subject);
          //parsing image
          if ("custom_fields" in doc.issues[i]) {
            $.each( doc.issues[i].custom_fields, function( key, value ) {
              if ((value.id==48) && (value.value!="")) {
                first_p="<img src='"+value.value+"' style='margin-bottom:0.6em; width:100%;'><br/>"+first_p;
                doc.issues[i].img=value.value;
                }             
              });
            }
          if (first_p!="") first_p=first_p.replace(/ ([ai]|[kosuvz]|do|ke|na|od|po|se|ve|za|ze) /gi, " $1&nbsp;");  
          $(".perex",divNew).html(first_p);
          $("a.mas_content",divNew).data( "id", doc.issues[i].id);
          $("a.mas_content",divNew).data( "index",i);
          divNew.attr("id",doc.issues[i].id);
          divNew.show();
          }
        }
      
      $("#redmine_vysledky").append(c);  
        
      var d = new Date();
      var tsm4 = d.getMilliseconds() + d.getSeconds()*1000;
      console.log('Populating DOM (optimized jQuery):'+(tsm4-tsm2)+'ms');
      
      // after data processing
        
      $(document).ready(function () {
        var url=window.location.href;
        var path=window.location.pathname;
        var hash=window.location.hash;
        console.log('url:'+url);
        console.log('path:'+path);
        console.log('hash:'+hash);
        
        
        // reveal issue details (hash)
        $("#redmine_vysledky a.mas_content").each(function(index) {
          $(this).click(function(event) {
            event.preventDefault();
            $(".callout.active").removeClass('active');
            $(this).parent('div.callout').addClass('active');
            var i=$(this).data("index");
            var head=doc.issues[i].subject;
            var desc=doc.issues[i].desc_html;
            $("#reveal1 .head").text(head);          
            $("#reveal1 .desc").html(desc.replace(/ ([ai]|[kosuvz]|do|ke|na|od|po|se|ve|za|ze) /gi, " $1&nbsp;"));
            $("#reveal1 .desc a").each(function(index) {$(this).attr('target', '_blank');});
            if ("img" in doc.issues[i]) {
              $("#reveal1 .img").attr('src',doc.issues[i].img).hide().fadeIn('slow');
              } else {
              $("#reveal1 .img").hide();
              }          
            if (!("assigned_to" in doc.issues[i])) {
              $("#reveal1 .autor").html('nepřiřazeno');
              } else {  
              $("#reveal1 .autor").html(doc.issues[i].assigned_to.name);
              }
            newpath=path+'#'+$(this).data("id")+'_'+slug(head);
            $("#reveal1 a.permalink").attr("href", newpath);
            $("#reveal1").foundation('open');
            console.log('modal open: '+newpath);
            window.history.pushState({}, null, newpath);
            });
          });
          
        if (hash!='') {
          var navheight=20;
          // scroll to issue
          $("#mpv-label").trigger("click");
          var target_id=hash.substr(1,5);
          console.log('searching for id '+target_id);
          if($("#"+target_id).length != 0) {
            $('html, body').animate({
              scrollTop: $("#"+target_id).offset().top-navheight
              }, 200);
            $("#"+target_id+" a.mas_content").trigger("click");
            $("#"+target_id+" .callout").addClass('active');
            }
          }  
                      
        
        $(document).on('closed.zf.reveal', '[data-reveal]', function () {
          window.history.replaceState({}, null, path);
          });            

        $(window).on('popstate', function() {
          $("#reveal1").foundation('close');
          });
                   
      });                    
    },
    
    
    
    masonry: function(doc) {
      
      var d = new Date();
      var tsm2 = d.getMilliseconds() + d.getSeconds()*1000;
      icons={
      'resort-doprava-a-logistika':'doprava.svg',
      'resort-evropska-unie-zahranici-obrana':'mezinarodni-vztahy.svg',
      'resort-finance':'finance.svg',
      'resort-informatika':'informatika.svg',
      'resort-mistni-rozvoj':'mistni-rozvoj.svg',
      'resort-prace-a-socialnich-veci':'prace-a-socialni-veci.svg',
      'resort-prumysl-a-obchod':'prumysl.svg',
      'resort-spravedlnost':'spravedlnost.svg',
      'resort-vnitro-a-bezpecnost':'vnitro.png',
      'resort-zdravotnictvi':'zdravotnictvi.svg',
      'resort-zemedelstvi':'zemedelstvi.svg',
      'resort-zivotni-prostredi':'zivotni-prostredi.svg',
      'resort-skolstvi':'vzdelani.png',
      'resort-kultura':'kultura.png'
      };

      pref={
      'resort-doprava-a-logistika':4,
      'resort-evropska-unie-zahranici-obrana':5,
      'resort-finance':14,
      'resort-informatika':13,
      'resort-mistni-rozvoj':1,
      'resort-prace-a-socialnich-veci':9,
      'resort-prumysl-a-obchod':6,
      'resort-spravedlnost':11,
      'resort-vnitro-a-bezpecnost':12,
      'resort-zdravotnictvi':3,
      'resort-zemedelstvi':7,
      'resort-zivotni-prostredi':8,
      'resort-skolstvi':10,
      'resort-kultura':2
      };
      
      poslanci=[
      'Dana Balcarová', 
      'Lukáš Bartoň', 
      'Ivan Bartoš', 
      'Lukáš Černohorský', 
      'František Elfmark', 
      'Mikuláš Ferjenčík', 
      'Radek Holomčík', 
      'Martin Jiránek', 
      'Lukáš Kolářík', 
      'František Kopřiva', 
      'Lenka Kozlová', 
      'Jan Lipavský', 
      'Tomáš Martínek', 
      'Jakub Michálek', 
      'František Navrkal', 
      'Mikuláš Peksa', 
      'Vojtěch Pikal', 
      'Ondřej Polanský', 
      'Jan Pošvář', 
      'Ondřej Profant', 
      'Olga Richterová', 
      'Petr Trešňák', 
      'Tomáš Vymazal'
      ];

      poslanci_pref={
      'Dana Balcarová':1, 
      'Lukáš Bartoň':2, 
      'Ivan Bartoš':3, 
      'Lukáš Černohorský':4, 
      'František Elfmark':5, 
      'Mikuláš Ferjenčík':6, 
      'Radek Holomčík':7, 
      'Martin Jiránek':8, 
      'Lukáš Kolářík':9, 
      'František Kopřiva':10, 
      'Lenka Kozlová':11, 
      'Jan Lipavský':12, 
      'Tomáš Martínek':13, 
      'Jakub Michálek':14, 
      'František Navrkal':15, 
      'Mikuláš Peksa':16, 
      'Vojtěch Pikal':17, 
      'Ondřej Polanský':18, 
      'Jan Pošvář':19, 
      'Ondřej Profant':20, 
      'Olga Richterová':21, 
      'Petr Trešňák':22, 
      'Tomáš Vymazal':23
      };

      
      resorty={
      'resort-finance':'Finance',
      'resort-informatika':'Informatika',
      'resort-vnitro-a-bezpecnost':'Vnitro a bezpečnost',
      'resort-spravedlnost':'Spravedlnost',
      'resort-skolstvi':'Školství',
      'resort-prace-a-socialnich-veci':'Práce a sociální věci',
      'resort-zivotni-prostredi':'Životní prostředí',
      'resort-zemedelstvi':'Zemědělství',
      'resort-prumysl-a-obchod':'Průmysl a obchod',
      'resort-evropska-unie-zahranici-obrana':'Evropská unie, zahraničí, obrana',
      'resort-doprava-a-logistika':'Doprava a logistika',
      'resort-zdravotnictvi':'Zdravotnictví',
      'resort-kultura':'Kultura',
      'resort-mistni-rozvoj':'Místní rozvoj'
      };
      
         
      // external image proxy for shrinking and resizing images
      const imgproxyurl="https://redmineapitest.mfnet.cz/img/";

      // test for webp support
      var supportsWebP = (function () {
        'use strict';
        var canvas = typeof document === 'object' ? document.createElement('canvas') : {};
        canvas.width = canvas.height = 1;
        var index = canvas.toDataURL ? canvas.toDataURL('image/webp').indexOf('image/webp') === 5 : false;
        return index;
        }());      
      console.log ('WebP support: '+supportsWebP);
      if (supportsWebP) var imgtype='webp'; else imgtype='jpg';


      // slug poslanci
      poslanci_pref_slug={};
      $.each(poslanci_pref, function (i, value) {
        poslanci_pref_slug[slug(i)] = value;
        });

      // slug na jmeno poslance
      poslanci_slug_to_name={};
      $.each(poslanci_pref, function (i, value) {
        poslanci_slug_to_name[slug(i)] = i;
        });

      var msnry=[];

      // clone
      masCopy=$("#masonry_container").clone(true);
      divCopy=$("#masonry_container .cloner2").clone(true);      
      divCopy.css('display', 'true');
      
      // adding beside DOM (not reflowing after each append)
      // todo: rewrite jqury routines to vanilla (much faster)
      var c=$("<div />").addClass('container');
      
      var proj=[];
      var masNew=[];
      var inv=$('#redmine_vysledky #inv');
      var viewtype=-1;
      var lastgrouptype='poslanec';
            
      var nav = document.querySelector('#sticky-nav');
      
      var pocetdoc=doc.issues.length;
      console.log('Pocet polozek:'+pocetdoc);


      // prehled list - jedno masonry (filtr priorit)
      function generatePrehled() {
        var pd='main';
        var pid=slug($.trim(pd));
        proj.push(pid);
        masNew[pid]=masCopy.clone().appendTo(c);            
        masNew[pid].attr("id","ms_"+pid);
        $(".head",masNew[pid]).remove();
        for(var i in doc.issues) {
            
          var divNew=divCopy.clone().appendTo(masNew[pid]);
          if (doc.issues[i].description!="") {
            descHtml=md.render(doc.issues[i].description); 
            var mess = $.parseHTML(descHtml);
            doc.issues[i].desc_html=descHtml;
            bd = inv.html('').append(mess);
            first_p = bd.find('p:first').html();
            //console.log(first_p);
            bd.find('p:first').remove();
            desc_rest=bd.html();
            } else {
            descHtml="Podrobný popis chybí ...";
            doc.issues[i].desc_html=descHtml;
            first_p="";
            desc_rest="";
            }
          prio=doc.issues[i].priority.id;
          if (prio>=5) {
            divNew.removeClass('medium-4').removeClass('large-3').addClass('medium-12').addClass('large-6');
            var imw=620;
            } else var imw=540; 
          $(".nadpis",divNew).html(doc.issues[i].subject);
  
          //parsing image
          if ("custom_fields" in doc.issues[i]) {
            $.each( doc.issues[i].custom_fields, function( key, value ) {
              if ((value.id==48) && (value.value!="")) {                
                var pct=imgproxyurl+encodeURIComponent(value.value)+"?w="+imw;

                $(".nadpis",divNew).before("<img src='"+pct+"&t="+imgtype+"' alt='"+doc.issues[i].subject+"' />");
                //first_p="<img src='"+pct+"&t="+imgtype+"' alt='"+doc.issues[i].subject+"' /><br/>"+first_p;

                doc.issues[i].img=value.value;
                }             
              });
            }
          first_p=first_p.replace(/ ([ai]|[kosuvz]|do|ke|na|od|po|se|ve|za|ze) /gi, " $1&nbsp;");  
          $(".perex",divNew).html(first_p);
          $("a.mas_content",divNew).data( "id", doc.issues[i].id);
          $("a.mas_content",divNew).data( "index",i);
          divNew.attr("id",doc.issues[i].id);
          //if (prio>=5) divNew.attr("style","display: block");
          //divNew.show();
          }
          
        $("#redmine_vysledky").append(c);
        }  

      
      // default list - masonry pro kazdy resort (vychozi sorting)
      function generateDefaults() {
        for(var i in doc.issues) {
          pd=doc.issues[i].project.name;
          pid=slug($.trim(pd));

          // main sections (resorts)
          if (jQuery.inArray(pid,proj)==-1) {
            //console.log('proj -> ('+pid+')');
            proj.push(pid);
            masNew[pid]=masCopy.clone().appendTo(c);            
            masNew[pid].attr("id","ms_"+pid);
            if (icons[pid]!==undefined) {
              $(".head",masNew[pid]).html("<img style='width:1.1em;height:1.1em;' src='/assets/img/program/"+icons[pid]+"' alt='"+pd+"'>&nbsp;<span>"+pd+"</span>");
              } else {
              $(".head",masNew[pid]).text(pd);
              }
            }
            
          var divNew=divCopy.clone().appendTo(masNew[pid]);
          if (doc.issues[i].description!="") {
            descHtml=md.render(doc.issues[i].description); 
            var mess = $.parseHTML(descHtml);
            doc.issues[i].desc_html=descHtml;
            bd = inv.html('').append(mess);
            first_p = bd.find('p:first').html();
            //console.log(first_p);
            bd.find('p:first').remove();
            desc_rest=bd.html();
            } else {
            descHtml="Podrobný popis chybí ...";
            doc.issues[i].desc_html=descHtml;
            first_p="";
            desc_rest="";
            }
          prio=doc.issues[i].priority.id;
          if (prio>=5) {
            divNew.removeClass('medium-4').removeClass('large-3').addClass('medium-8').addClass('large-6');
            var imw=620;
            } else var imw=540; 
  
          //parsing image
          if ("custom_fields" in doc.issues[i]) {
            $.each( doc.issues[i].custom_fields, function( key, value ) {
              if ((value.id==48) && (value.value!="")) {
                var pct=imgproxyurl+encodeURIComponent(value.value)+"?w="+imw;

                $(".nadpis",divNew).before("<img src='"+pct+"&t="+imgtype+"' alt='"+doc.issues[i].subject+"' />");
                //first_p="<img src='"+pct+"&t="+imgtype+"' alt='"+doc.issues[i].subject+"' /><br/>"+first_p;
                
                doc.issues[i].img=value.value;
                }             
              });
            }
          $(".nadpis",divNew).html(doc.issues[i].subject);
          first_p=first_p.replace(/ ([ai]|[kosuvz]|do|ke|na|od|po|se|ve|za|ze) /gi, " $1&nbsp;");  
          $(".perex",divNew).html(first_p);
          $("a.mas_content",divNew).data( "id", doc.issues[i].id);
          $("a.mas_content",divNew).data( "index",i);
          divNew.attr("id",doc.issues[i].id);
          divNew.attr("style","display: block");
          //divNew.show();
          }
          
        $("#redmine_vysledky").append(c);
        }  

      // poslanci list - masonry pro kazdyho poslance
      function generatePrehledPoslanci() {
        for(var i in doc.issues) {

          var prirazeno=[];

          if ("assigned_to" in doc.issues[i]) {
          pd=doc.issues[i].assigned_to.name;
          } else pd='Nepřiřazeno';

          prirazeno.push(pd);
          
          $.each(poslanci, function( key, poslanec ) {
            if (doc.issues[i].tags.indexOf(slug(poslanec))>-1) {
              var nalezeno=0;
              $.each(prirazeno, function( pkey, pposlanec ) {
                if (slug(pposlanec)==slug(poslanec)) nalezeno=1;                
                });
              if (nalezeno==0) prirazeno.push(poslanec);    
              }
            });
                   
          //console.log('Prirazeno:'+prirazeno);
          
          
          $.each(prirazeno, function( pkey, pd ) {
            pid=slug($.trim(pd));
  
            // main sections (resorts)
            if (jQuery.inArray(pid,proj)==-1) {
              //console.log('proj -> ('+pid+')');
              proj.push(pid);
              masNew[pid]=masCopy.clone().appendTo(c);            
              masNew[pid].attr("id","ms_"+pid);
  
              if (pid in poslanci_slug_to_name) name=poslanci_slug_to_name[pid]; else name=pd;
              
              if (icons[pid]!==undefined) {
                $(".head",masNew[pid]).html("<img style='width:1.1em;height:1.1em;' src='/assets/img/program/"+icons[pid]+"' alt='"+name+"'>&nbsp;<span>"+name+"</span>");
                } else {
                $(".head",masNew[pid]).text(name);
                }
              }
            
            // nahrada tohoto  
            var divNew=divCopy.clone().appendTo(masNew[pid]);
            // za toto
            
            if (doc.issues[i].description!="") {
              descHtml=md.render(doc.issues[i].description); 
              var mess = $.parseHTML(descHtml);
              doc.issues[i].desc_html=descHtml;
              bd = inv.html('').append(mess);
              first_p = bd.find('p:first').html();
              //console.log(first_p);
              bd.find('p:first').remove();
              desc_rest=bd.html();
              } else {
              descHtml="Podrobný popis chybí ...";
              doc.issues[i].desc_html=descHtml;
              first_p="";
              desc_rest="";
              }
            prio=doc.issues[i].priority.id;
            if (prio>=5) {
              divNew.removeClass('medium-4').removeClass('large-3').addClass('medium-8').addClass('large-6');
              var imw=620;
              } else var imw=540; 
            $(".nadpis",divNew).html(doc.issues[i].subject);
    
            //parsing image
            if ("custom_fields" in doc.issues[i]) {
              $.each( doc.issues[i].custom_fields, function( key, value ) {
                if ((value.id==48) && (value.value!="")) {
                  var pct=imgproxyurl+encodeURIComponent(value.value)+"?w="+imw;
  
                  $(".nadpis",divNew).before("<img src='"+pct+"&t="+imgtype+"' alt='"+doc.issues[i].subject+"' />");
                  //first_p="<img src='"+pct+"&t="+imgtype+"' alt='"+doc.issues[i].subject+"' /><br/>"+first_p;
  
                  doc.issues[i].img=value.value;
                  }             
                });
              }
            first_p=first_p.replace(/ ([ai]|[kosuvz]|do|ke|na|od|po|se|ve|za|ze) /gi, " $1&nbsp;");  
            $(".perex",divNew).html(first_p);
            $("a.mas_content",divNew).data( "id", doc.issues[i].id);
            $("a.mas_content",divNew).data( "index",i);
            divNew.attr("id",doc.issues[i].id);
            divNew.attr("data-id",doc.issues[i].id);
            divNew.attr("data-pid",pid);
            divNew.attr("style","display: block");
            //divNew.show();
            });
          }
          
        $("#redmine_vysledky").append(c);
        }  


      doc.issues=sortJSONbyDate(doc.issues);
      generatePrehled();
        
      var d = new Date();
      var tsm4 = d.getMilliseconds() + d.getSeconds()*1000;
      console.log('Populating DOM (optimized jQuery):'+(tsm4-tsm2)+'ms');
      
      // after data processing
        
      $(document).ready(function () {
        $("#loading").fadeOut("slow");
        
        let poslanci_list=[];
        $.each(poslanci, function( key, value ) {
          poslanci_list.push({name:value,slug:slug(value)});
          });

        let resorty_list=[];
        $.each(resorty, function( key, value ) {
          resorty_list.push({name:value,slug:key});
          });
          
        let resorty_list2=[];
        $.each(resorty, function( key, value ) {
          resorty_list2.push({name:value,slug:"_"+key});
          });


        let poslanciMS = new MultiSelect('#poslanci-select', {
          items: poslanci_list,
          current: poslanci_list,
          sort: false,
          display: 'name',
          placeholder: 'Výběr poslanců',
          more: '(+{X} poslanců)' 
          });            
        /*
        let poslanciMS2 = new MultiSelect('#poslanci-select-2', {
          items: poslanci_list,
          current: poslanci_list,
          sort: false,
          display: 'name',
          placeholder: 'Výběr poslanců',
          more: '(+{X} poslanců)' 
          });            
        */  
        let ms_res_vp = new MultiSelect('#resorty-select', {
          items: resorty_list2,
          current: resorty_list2,
          display: 'name',
          sort: false,
          placeholder: 'Výběr resortů',
          more: '(+{X} resortů)' 
          });            
           
        let ms_res = new MultiSelect('#resorty-select-2', {
          items: resorty_list,
          current: resorty_list,
          display: 'name',
          sort: false,
          placeholder: 'Výběr resortů',
          more: '(+{X} resortů)' 
          });            


        function showMultiselects() {
          var resorts=getResorts(ms_res_vp);  
          console.log('ms_res_vp: '+resorts);  
          var resorts=getResorts(ms_res);  
          console.log('ms_res: '+resorts);  
          var resorts=getResorts(poslanciMS);  
          console.log('poslanciMS: '+resorts);  

          }
        
        poslanciMS.on('change', function() {
          console.log('Poslanci changed ...');
          showMultiselects();
          });

        ms_res_vp.on('change', function() {
          console.log('Resorty vlastní přehled changed ...');
          showMultiselects();
          });

         ms_res.on('change', function() {
          console.log('Resorty podle resortů changed ...');
          showMultiselects();
          });
        

        // osetreni zapinani a vypinani filtrovacich kriterii
        $('#butt_showfilters').click(function(event) {                         
            event.preventDefault();
            var fb=$("#filterbox");
            if (fb.hasClass('on')) {
              fb.fadeOut("slow").removeClass('on');
              $(this).fadeOut("fast").html("<i class='fa fa-filter' aria-hidden='true'></i> Zobraz filtry").fadeIn("slow");
              }  else {
              $("#filterbox").fadeIn("slow").addClass('on');
              $(this).fadeOut("fast").html("<i class='fa fa-filter' aria-hidden='true'></i> Skryj filtry").fadeIn("slow");
              }
            });

        
        // osetreni prepinani hlavniho prehledu
        function activateDateFilter() {
          $("#loading").css("display", "block");
            var hash={};
            hash['type']='basic';
            hash['datefilter']=$('#datefilter').val();
            $("#butt_datefilter_permalink").attr("href","#"+jQuery.param(hash));
          if (viewtype!=0) {
            removeVysledky();
            doc.issues=sortJSONbyDate(doc.issues);
            viewtype=0;
            generatePrehled();
            createMasonry();
            updateReveals();
            }
          var dates=getDates('#datefilter');
          var ids=initFilter();
          ids=filterByDate(ids,dates);
          ids=filterByPriority(ids,5);
          showAndHideByIds(ids);
          $("#loading").fadeOut("slow");          
          }
        
        
        $('#butt_datefilter').click(function(event) {             
            event.preventDefault();
            activateDateFilter();
            });

        $('#panel1-label').click(function(event) {             
            event.preventDefault();
            console.log('Základní přehled');
            activateDateFilter();
            });

        // osetreni prepinani prehledu podle resortu
        function activateResortDateFilter() {
          $("#loading").css("display", "block");
            var hash={};
            hash['type']='resorts';
            hash['datefilter2']=$('#datefilter2').val();
            hash['resorty-select-2']=getResorts(ms_res).join(',');
            $("#butt_dateresortfilter_permalink").attr("href","#"+jQuery.param(hash));
          if (viewtype!=1) {
            removeVysledky();
            doc.issues=sortJSONbyResorts(doc.issues,pref);
            viewtype=1;
            generateDefaults();
            createMasonry();
            updateReveals();
            }
          var dates=getDates('#datefilter2');
          var resorts=getResorts(ms_res);
          console.log('dates:'+dates);
          console.log('resorts:'+resorts);
          var ids=initFilter();
          ids=filterByDate(ids,dates);
          ids=filterByResorts(ids,resorts);
          showAndHideByIds(ids);
          $("#loading").fadeOut("slow");          
          }

        $('#butt_dateresortfilter').click(function(event) {             
            event.preventDefault();
            activateResortDateFilter();
            });

        $('#panel2-label').click(function(event) {             
            event.preventDefault();
            console.log('Přehled podle resortů');
            activateResortDateFilter();
            });
        
        /*
        $('#butt_cyklusfilter').click(function(event) {             
            event.preventDefault();
            if (viewtype!=2) {
              removeVysledky();
              doc.issues=sortJSONbyPoslanec(doc.issues,poslanci_pref);
              viewtype=2;
              generatePrehledPoslanci();
              createMasonry();
              updateReveals();
              }
            var dates=getDates('#datefilter4');
            var people=getPeople(poslanciMS2);
            var ids=initFilter();
            ids=filterByDate(ids,dates);
            ids=filterByPeople(ids,people);
            showAndHideByIds(ids);
            });

        $('#butt_weekfilter').click(function(event) {             
            event.preventDefault();
            if (viewtype!=3) {
              removeVysledky();
              doc.issues=sortJSONbyPriority(doc.issues);
              viewtype=3;
              generatePrehled();
              createMasonry();
              updateReveals();
              }
            var dates=getDates('#datefilter3');
            var ids=initFilter();
            ids=filterByDate(ids,dates);
            showAndHideByIds(ids);
            });
         */
        
        // osetreni prepinani vlastniho prehledu
        function activateOwnFilter() {
          $("#loading").css("display", "block");
            var hash={};
            hash['type']='own';
            hash['datefilter5']=$('#datefilter5').val();
            hash['resorty-select']=getResorts(ms_res_vp).join(',');
            hash['poslanci-select']=getResorts(poslanciMS).join(',');
            hash['cycletype']=$("input[name='cycletype']:checked").val();
            hash['grouptype']=$('#grouptype').val();
            $("#butt_ownfilter_permalink").attr("href","#"+jQuery.param(hash));
          var grouptype=$('#grouptype').val();         
          if ((viewtype!=4) || (grouptype!=lastgrouptype)) {
            removeVysledky();
            doc.issues=sortJSONbyDate(doc.issues);
            doc.issues=sortJSONbyPriority(doc.issues);
            
            // handling grupovani
            if (grouptype=='none') generatePrehled(); 
            if (grouptype=='resort') {
              doc.issues=sortJSONbyResorts(doc.issues,pref);
              generateDefaults();
              }
            if (grouptype=='poslanec') {
              doc.issues=sortJSONbyPoslanec(doc.issues,poslanci_pref_slug);
              generatePrehledPoslanci();
              }
            //generatePrehled();
            
            viewtype=4;
            lastgrouptype=grouptype;
            createMasonry();
            updateReveals();
            }
          var dates=getDates('#datefilter5');
          var resorts=getResorts(ms_res_vp);
          var people=getPeople(poslanciMS);
          var teritory=$("input[name='cycletype']:checked").val();
          console.log('dates:'+dates);
          console.log('resorts:'+resorts);
          console.log('people:'+people);
          console.log('teritory:'+teritory);
          console.log('grouptype:'+grouptype);
          var ids=initFilter();
          ids=filterByDate(ids,dates);
          ids=filterByResorts(ids,resorts);
          ids=filterByPeople(ids,people);
          ids=filterByTeritory(ids,teritory);
          if (grouptype!='poslanec') showAndHideByIds(ids); else showAndHideByIdsMulti(ids,people);
          $("#loading").fadeOut("slow");
          }
        
        $('#butt_ownfilter').click(function(event) {             
            event.preventDefault();
            activateOwnFilter();
            });

        $('#panel5-label').click(function(event) {             
            event.preventDefault();
            console.log('Vlastní přehled');
            activateOwnFilter();
            });
        
             
        url=window.location.href;
        path=window.location.pathname;
        hash=window.location.hash;
        console.log('url:'+url);
        console.log('path:'+path);
        console.log('hash:'+hash);
        console.log('starting masonry ...');
                
        // masonry initialization (resort)
        var container = document.querySelector('#redmine_vysledky');
        //var msnry=[];
        $.each(proj, function( key, value ) {
          var msid="#ms_"+value;
          msnry[key] = new Masonry("#ms_"+value, {
            itemSelector: '#ms_'+value+' .grid-item',
            columnWidth: '#ms_'+value+' .grid-sizer',
            percentPosition: true
            });
          var mscont = document.querySelector(msid);  
          imagesLoaded( mscont, function( instance ) {
            console.log('all images in '+msid.substr(4)+' ['+key+'] are loaded');
            msnry[key].layout();
            });
          });
          
        imagesLoaded( container, function( instance ) {
          
          // uncomment this for menu
          //$("#sticky-nav a").each(function(index) { $(this).addClass('loaded') });
          // $("#sticky-nav").addClass('loaded');
          console.log('all images are loaded');

          
          //show actual issue detail when hash or scroll to resort
          if (hash!='') {
            var navheight=20;
            cmq=Foundation.MediaQuery.current;
            if ((cmq!='mobile') && (cmq!='small')) var active=true; else active=false; 
            var stuck=$("#sticky-nav").hasClass('is-stuck'); 
            if (active) navheight+=$("#sticky-nav").height();
            //console.log('hash - sticky active:'+active+', stuck:'+stuck+', navheight:'+navheight);
            // scroll to resort
            var resort_id=hash.substr(1);
            if (jQuery.inArray(resort_id,proj)>-1) {
              console.log('searching resort id '+resort_id);
                $('html, body').animate({
                  scrollTop: $("#ms_"+resort_id).offset().top-navheight
                  }, 200);
              } else {
              // scroll to issue
              var target_id=hash.substr(1,5);
              if (Number.isInteger(target_id)) { 
                console.log('searching for id '+target_id);
                if($("#"+target_id).length != 0) {
                  $('html, body').animate({
                    scrollTop: $("#"+target_id).offset().top-navheight
                    }, 200);
                  $("#"+target_id+" a.mas_content").trigger("click");
                  $("#"+target_id+" .callout").addClass('active');
                  }
                }              
              }
            }  
          
          // smoothscroll to resorts  
          $("#sticky-nav a").each(function(index) {
             $(this).click(function(event) {             
              event.preventDefault();
              var navheight=20;
              cmq=Foundation.MediaQuery.current;
              if ((cmq!='mobile') && (cmq!='small')) var active=true; else active=false;
              var stuck=$("#sticky-nav").hasClass('is-stuck'); 
              if (active) navheight+=$("#sticky-nav").height();
              //console.log('nav click - sticky active:'+active+', stuck:'+stuck+', navheight:'+navheight);
              var link=$(this).attr('href');
              window.history.pushState({}, null, '#'+link.substr(4));
              $('html, body').animate({
                scrollTop: $(link).offset().top-navheight
                }, 200);              
              }); 
            }); 
        });
        

        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = window.location.hash.substring(1),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;
        
            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');
        
                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                }
            }
        };
        
        if (hash!='') console.log('hash:'+hash);
        var permtype=getUrlParameter('type');
        console.log('permalink type: '+permtype);
        // nastaveni obecneho filtru
        if (permtype=='own') {        
            // nastaveni poslancu
            var aktposlanci=getUrlParameter('poslanci-select').split(",");
            console.log('aktivni poslanci:'+aktposlanci);
            let poslanci_list=[];
            $.each(poslanci, function( key, value ) {
              if (aktposlanci.indexOf(slug(value))>-1) {
                console.log('poslanec query:'+slug(value));
                poslanci_list.push({name:value,slug:slug(value)});
                }
              });
            poslanciMS.setNone();
            poslanciMS.setCurrent(poslanci_list);
            // nastaveni resortu
            var aktresorty=getUrlParameter('resorty-select').split(",");
            console.log('aktivni resorty:'+aktresorty);
            let resorty_list=[];
            $.each(resorty, function( key, value ) {
              if (aktresorty.indexOf(slug(key))>-1) {
                console.log('resort query:'+slug(key));
                resorty_list.push({name:value,slug:"_"+slug(key)});
                }
              });
            ms_res_vp.setNone();
            ms_res_vp.setCurrent(resorty_list);
            //ostatni nastaveni
            $('#datefilter5').val(getUrlParameter('datefilter5'));
            $("input[name='cycletype']").val([getUrlParameter('cycletype')]);
            $('#grouptype').val(getUrlParameter('grouptype'));            
            activateOwnFilter();
            $('#example-tabs').foundation('selectTab', 'panel5');

          } else if (permtype=='resorts') {
            // nastaveni resortu
            var aktresorty=getUrlParameter('resorty-select-2').split(",");
            console.log('aktivni resorty:'+aktresorty);
            let resorty_list=[];
            $.each(resorty, function( key, value ) {
              if (aktresorty.indexOf(slug(key))>-1) {
                console.log('resort query:'+slug(key));
                resorty_list.push({name:value,slug:slug(key)});
                }
              });
            ms_res.setNone();
            ms_res.setCurrent(resorty_list);
            $('#datefilter2').val(getUrlParameter('datefilter2'));
            activateResortDateFilter();
            $('#example-tabs').foundation('selectTab', 'panel2');

          } else if (permtype=='basic') {
            $('#datefilter').val(getUrlParameter('datefilter'));
            activateDateFilter();
            
          } else {
          activateDateFilter();
        
        //updateReveals();
        //var ids=initFilter();
        //ids=filterByPriority(ids,5);
        //showAndHideByIds(ids);
        }
        
        $(document).on('closed.zf.reveal', '[data-reveal]', function () {
          window.history.replaceState({}, null, path);
          });            

        $(window).on('popstate', function() {
          $("#reveal1").foundation('close');
          });
                   
      });
      

    function updateReveals() {
        // reveal issue details (hash)
        $("#redmine_vysledky a.mas_content").each(function(index) {
          $(this).click(function(event) {
            event.preventDefault();
            $(".callout.active").removeClass('active');
            $(this).parent('div.callout').addClass('active');
            var i=$(this).data("index");
            var head=doc.issues[i].subject;
            var tags=doc.issues[i].tags;
            var desc=doc.issues[i].desc_html;
            var md=Foundation.MediaQuery.current;
            var revwidth=744;
            if ((md=='xxlarge')||(md=='xlarge')||(md=='large')||(md=='medium')) revwidth=744; else revwidth=576;
            console.log('Media:'+md+', width:'+revwidth);
            $("#reveal1 .head").text(head);          
            $("#reveal1 .tags").text('Tagy: '+tags);          
            $("#reveal1 .desc").html(desc.replace(/ ([ai]|[kosuvz]|do|ke|na|od|po|se|ve|za|ze) /gi, " $1&nbsp;"));
            $("#reveal1 .desc a").each(function(index) {$(this).attr('target', '_blank');});
            if ("img" in doc.issues[i]) {
              //$("#reveal1 .img").attr('src',doc.issues[i].img).hide().fadeIn('slow');
              var imgurl=imgproxyurl+encodeURIComponent(doc.issues[i].img)+"?w="+revwidth+"&t="+imgtype;
              $("#reveal1 .img").attr('src',imgurl).hide().fadeIn('slow');              
              } else {
              $("#reveal1 .img").hide();
              }
            // seznam poslancu  
            var prirazeno="";            
            if ("assigned_to" in doc.issues[i]) {
              var jmeno=doc.issues[i].assigned_to.name;
              $.each(poslanci, function( key, poslanec ) {
                if (slug(jmeno)==slug(poslanec)) jmeno=poslanec;
                });
              prirazeno=jmeno;
              }
            $.each(poslanci, function( key, poslanec ) {
              if (tags.indexOf(slug(poslanec))>-1) {
                if (slug(prirazeno).indexOf(slug(poslanec))==-1) {
                  if (prirazeno!="") prirazeno+=", "+poslanec; else prirazeno+=poslanec;
                  }
                }
              });    
            if (prirazeno=="") prirazeno="Nepřiřazeno";  
            $("#reveal1 .autor").html(prirazeno+' ('+doc.issues[i].start_date+')');
              
            newpath=path+'#'+$(this).data("id")+'_'+slug(head);
            $("#reveal1 a.permalink").attr("href", newpath);
            $("#reveal1").foundation('open');
            console.log('modal open: '+newpath);
            window.history.pushState({}, null, newpath);
            });
          });            
        }


    function createMasonry() {
        $.each(proj, function( key, value ) {
          var msid="#ms_"+value;
          msnry[key] = new Masonry("#ms_"+value, {
            itemSelector: '#ms_'+value+' .grid-item',
            columnWidth: '#ms_'+value+' .grid-sizer',
            percentPosition: true
            });
          var mscont = document.querySelector(msid);  
          imagesLoaded( mscont, function( instance ) {
            console.log('all images in '+msid.substr(4)+' ['+key+'] are loaded');
            msnry[key].layout();
            });
          });
      }
    
    function removeVysledky() {
        $.each(proj, function( key, value ) {
            msnry[key].destroy();
            var elem = document.querySelector("#ms_"+value);
            if (elem!=null) {
              elem.parentNode.removeChild(elem);
              console.log('element removed ['+key+'] '+value);
              }
            });
        proj=[];    
        }
    
    function getResorts(resortobj) {
      var res=resortobj.getCurrent();
      var resorts=[];
      $.each(res, function( key, resdata ) {
        //console.log('Selected res: '+resdata['slug']);
        if (resdata['slug'].substr(0,1)=="_") resorts.push(resdata['slug'].substr(1)); else resorts.push(resdata['slug']);        
        });
      return(resorts);  
      }
  
    function getPeople(peopleobj) {
      var res=peopleobj.getCurrent();
      var people=[];
      $.each(res, function( key, resdata ) {
        //console.log('Selected people: '+resdata['slug']);
        people.push(resdata['slug']);        
        });
      return(people);  
      }
      
    function initFilter() {
      var ids={};
      for(var i in doc.issues) {
        ids[doc.issues[i].id]=1;
        }
      return(ids);  
      }
    
    function filterByDate(ids,dates) {
      for(var i in doc.issues) {
        var id=doc.issues[i].id;
        var dateString=doc.issues[i].start_date;
        if (ids[id]==1) {
          var date=new Date(dateString);
          if ((date>=dates.od) && (date<=dates.do)) ids[id]=1; else ids[id]=0;
          }
        //console.log('filter id:'+id+' ('+dateString+') = '+ids[id]);    
        }
      return(ids);  
      }

    function filterByPriority(ids,priority) {
      for(var i in doc.issues) {
        var id=doc.issues[i].id;
        if (ids[id]==1) {
          var prio=doc.issues[i].priority.id;
          if (prio>=priority) ids[id]=1; else ids[id]=0;
          //console.log('priority filter ('+i+') / id:'+id+' ('+prio+') = '+ids[id]);
          }
        //console.log('filter id:'+id+' ('+dateString+') = '+ids[id]);    
        }
      return(ids);  
      }
      
    function filterByResorts(ids,resorts) {
      if (Object.keys(resorts).length>0) {
        for(var i in doc.issues) {
          var id=doc.issues[i].id;
          if (ids[id]==1) {
            if (typeof doc.issues[i].project == 'undefined') {
              ids[id]=0;
              } else {
              var resortString=doc.issues[i].project.name;
              var resortSlug=slug(resortString);
              if (resorts.indexOf(resortSlug)!=-1) ids[id]=1; else ids[id]=0;
              }
            //console.log('filter id:'+id+' = '+ids[id]);
            }  
          }
        }  
      return(ids);  
      }

    function filterByPeople(ids,people) {
      if (Object.keys(people).length>0) {
        for(var i in doc.issues) {
          var id=doc.issues[i].id;
          if (ids[id]==1) {
          
            // seznam poslancu  
            var prirazeno="";            
            if ("assigned_to" in doc.issues[i]) {
              var jmeno=doc.issues[i].assigned_to.name;
              $.each(poslanci, function( key, poslanec ) {
                if (slug(jmeno)==slug(poslanec)) jmeno=poslanec;
                });
              prirazeno=jmeno;
              }

            
            // poladit aby to ukazovalo spravnym poslancum  
            $.each(poslanci, function( key, poslanec ) {
              if (doc.issues[i].tags.indexOf(slug(poslanec))>-1) {
                if (slug(prirazeno).indexOf(slug(poslanec))==-1) {
                  if (prirazeno!="") prirazeno+=", "+poslanec; else prirazeno+=poslanec;
                  }
                }
              });
            // konec poladeni
              
              
            ids[id]=0;      
            $.each(people, function( key, poslanec ) {
              if (slug(prirazeno).indexOf(poslanec)!=-1) ids[id]=1;
              });
            //console.log('filter id:'+id+' = '+ids[id]);
            }  
          }
        }  
      return(ids);  
      }

    function filterByTeritory(ids,teritory) {
      for(var i in doc.issues) {
        var id=doc.issues[i].id;
        if (ids[id]==1) {
          if (teritory=="regional") {                    
            var prirazeno=false;            
            if (doc.issues[i].tags.indexOf('region')>-1) prirazeno=true;
    
            if (prirazeno==false) ids[id]=0;
            }      
          }  
        }
      return(ids);  
      }


    function showAndHideByIdsMulti(ids,people) {
      var counter = 0;
      for(var id in ids) {
        if (ids[id]==1) counter++;
        //console.log('getting ids '+id);

        $('.cloner2[data-id='+id+']').each(function() {
          var pid=$(this).attr('data-pid');
          //console.log(id+' -> '+pid);
          
            if ((ids[id]==1) && (people.indexOf(pid)>-1) && ($(this).css('display')=='none')) {
              $(this).show();
              //console.log('Showing '+id+' '+pid);
              }

            if ((ids[id]==1) && (people.indexOf(pid)==-1) && ($(this).css('display')!='none')) {
              $(this).hide();
              //console.log('Hiding '+id+' '+pid);
              }

            if ((ids[id]==0) && ($(this).css('display')!='none')) {
              $(this).hide();
              //console.log('Hiding '+id+' '+pid);
              }
          
          });
        
        }
      var vysl="";
      if (counter!=0) vysl="Bylo nalezeno "+counter+" kauz odpovídajících danému dotazu."; else vysl="Pro zadaný dotaz neevidujeme žádné výsledky, upravte jej prosím.";
      //vysl+="<span style='float:right;'><a href='#' id='reload' class='butt'>Reload test</a></span>"; 
      $('#dotazinfo').hide().html(vysl).fadeIn('slow');
      $.each(proj, function( key, value ) {
        var msid="#ms_"+value;  
        
        var count=0;
        $(msid+' .cloner2').each(function(index, el) {
          if ($(this).css('display')!='none') count++;
          });
        //console.log(value+' -> '+count);
        if ((count==0) && ($(msid+' h1').css('display')!='none')) {
          $(msid+' h1').hide();
          $(msid).addClass('nomargin');
          }
        if ((count!=0) && ($(msid+' h1').css('display')=='none')) {
          $(msid+' h1').show();
          $(msid).removeClass('nomargin');
          }
        msnry[key].layout();
        });
      
      /*  
      $('#reload').click(function(event) {             
        event.preventDefault();
        console.log('reload pressed');
        removeVysledky();
        generateDefaults();

        $.each(proj, function( key, value ) {
          var msid="#ms_"+value;
          msnry[key] = new Masonry("#ms_"+value, {
            itemSelector: '#ms_'+value+' .grid-item',
            columnWidth: '#ms_'+value+' .grid-sizer',
            percentPosition: true
            });
          var mscont = document.querySelector(msid);  
          imagesLoaded( mscont, function( instance ) {
            console.log('all images in '+msid.substr(4)+' ['+key+'] are loaded');
            msnry[key].layout();
            });
          });
        
        
        });
        */
      }                    


    function showAndHideByIds(ids) {
      var counter = 0;
      for(var id in ids) {
        if (ids[id]==1) counter++;
        if ((ids[id]==1) && ($('#'+id).css('display')=='none')) {
          $('#'+id).show();
          //console.log('Showing '+id);
          }
        if ((ids[id]==0) && ($('#'+id).css('display')!='none')) {
          $('#'+id).hide();
          //console.log('Hiding '+id);
          }
        }
      var vysl="";
      if (counter!=0) vysl="Bylo nalezeno "+counter+" kauz odpovídajících danému dotazu."; else vysl="Pro zadaný dotaz neevidujeme žádné výsledky, upravte jej prosím.";
      //vysl+="<span style='float:right;'><a href='#' id='reload' class='butt'>Reload test</a></span>"; 
      $('#dotazinfo').hide().html(vysl).fadeIn('slow');
      $.each(proj, function( key, value ) {
        var msid="#ms_"+value;  
        
        var count=0;
        $(msid+' .cloner2').each(function(index, el) {
          if ($(this).css('display')!='none') count++;
          });
        //console.log(value+' -> '+count);
        if ((count==0) && ($(msid+' h1').css('display')!='none')) {
          $(msid+' h1').hide();
          $(msid).addClass('nomargin');
          }
        if ((count!=0) && ($(msid+' h1').css('display')=='none')) {
          $(msid+' h1').show();
          $(msid).removeClass('nomargin');
          }
        msnry[key].layout();
        });
      
      /*  
      $('#reload').click(function(event) {             
        event.preventDefault();
        console.log('reload pressed');
        removeVysledky();
        generateDefaults();

        $.each(proj, function( key, value ) {
          var msid="#ms_"+value;
          msnry[key] = new Masonry("#ms_"+value, {
            itemSelector: '#ms_'+value+' .grid-item',
            columnWidth: '#ms_'+value+' .grid-sizer',
            percentPosition: true
            });
          var mscont = document.querySelector(msid);  
          imagesLoaded( mscont, function( instance ) {
            console.log('all images in '+msid.substr(4)+' ['+key+'] are loaded');
            msnry[key].layout();
            });
          });
        
        
        });
        */
      }                    


    }
    
  }
};


getDates = function(el) {
  var value=$(el).val();
  //console.log('getDates value: '+value);
  if (value=='m3') {
    var today=new Date();
    var dod = deltaDate(today,0,-3,0);
    var ddo = today;
    //console.log(dod.toString()+' -> '+ddo.toString());
    return({'od':dod,'do':ddo});
    } else if (value=='m6') {
    var today=new Date();
    var dod = deltaDate(today,0,-6,0);
    var ddo = today;
    //console.log(dod.toString()+' -> '+ddo.toString());
    return({'od':dod,'do':ddo});
    } else if (value=='d7') {
    var today=new Date();
    var dod = deltaDate(today,-7,0,0);
    var ddo = today;
    //console.log(dod.toString()+' -> '+ddo.toString());
    return({'od':dod,'do':ddo});
    } else if (value=='d14') {
    var today=new Date();
    var dod = deltaDate(today,-14,0,0);
    var ddo = today;
    //console.log(dod.toString()+' -> '+ddo.toString());
    return({'od':dod,'do':ddo});
    } else if (value=='y2019') {
    var today=new Date();
    var dod=new Date('2019-01-01');
    var ddo=today;
    //console.log(dod.toString()+' -> '+ddo.toString());
    return({'od':dod,'do':ddo});
    } else if (value=='all') {
    var today=new Date();
    var dod=new Date('2001-01-01');
    var ddo=today;
    //console.log(dod.toString()+' -> '+ddo.toString());
    return({'od':dod,'do':ddo});
    } else if (value.length==16) {
    var dod=new Date(value.substr(0,4)+'-'+value.substr(4,2)+'-'+value.substr(6,2));
    var ddo=new Date(value.substr(8,4)+'-'+value.substr(12,2)+'-'+value.substr(14,2));
    //console.log(dod.toString()+' -> '+ddo.toString());
    return({'od':dod,'do':ddo});
    } else {
    var today=new Date();
    var dod=new Date('2001-01-01');
    var ddo=today;
    //console.log(dod.toString()+' -> '+ddo.toString());
    return({'od':dod,'do':ddo});
    }
  }



function deltaDate(input, days, months, years) {
    var date = new Date(input);
    date.setDate(date.getDate() + days);
    date.setMonth(date.getMonth() + months);
    date.setFullYear(date.getFullYear() + years);
    return date;
}

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

// sort issues by resorts and priority
function sortJSON(data,pref) {
    return data.sort(function (a, b) {
        var x = pref[slug($.trim(a.project.name))]*10+a.priority.id;
        var y = pref[slug($.trim(b.project.name))]*10+b.priority.id;
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    }

// sort issues by date
function sortJSONbyDate(data) {
    return data.sort(function (a, b) {
        var x = new Date(a.start_date);
        var y = new Date(b.start_date);
        //console.log(a.id+':'+x+' > '+b.id+':'+y);
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    }

function sortJSONbyResorts(data,pref) {
    return data.sort(function (a, b) {
        var slgx=slug(a.project.name); 
        var slgy=slug(b.project.name);
        if (pref[slgx] !== undefined) var x = pref[slgx]*10+a.priority.id; else var x=a.priority.id;
        if (pref[slgy] !== undefined) var y = pref[slgy]*10+b.priority.id; else var y=b.priority.id;
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
}


function sortJSONbyPoslanec(data,pref) {
    return data.sort(function (a, b) {
        var slgx=0;
        var slgy=0;
        if ("assigned_to" in a) var slgx=slug(a.assigned_to.name); 
        if ("assigned_to" in b) var slgy=slug(b.assigned_to.name);
        if (pref[slgx] !== undefined) var x = (100-pref[slgx])*10+a.priority.id; else var x=a.priority.id;
        if (pref[slgy] !== undefined) var y = (100-pref[slgy])*10+b.priority.id; else var y=b.priority.id;
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
}

function sortJSONbyPriority(data) {
    return data.sort(function (a, b) {
        x=a.priority.id;
        y=b.priority.id;
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
}



var slug = function(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
  var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
};

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
    if (array[i].tags!='AT') {
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
  }
  return newStructure;
}

// Take raw processed CSV -> Object and reformat it for easier calculations (Analyticky team)
// TODO: udelat z toho jednu funkci na zaklade url
pirates.accounting.reformatStructureAT = function(array){
  var newStructure = {};
  var d = new Date();
  var y = d.getFullYear();
  var m = d.getMonth() + 1;
  newStructure.byAccount = {};
  newStructure.byCounterparty = {};
  for( var i in array ){
    if (array[i].tags=='AT') {
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
    if (i==0) {
      tr.classList.add("w-accounting__group-heading--opened");
      tr.innerHTML = '<td colspan="' + tableKeys.length + 1 + '" class=""><input type="checkbox" checked="checked" class="w-accounting__group-control" onchange="pirates.accounting.toggleRow.call(this, event);">'+tableKeys[i]+'</td>'
      } else {
      tr.innerHTML = '<td colspan="' + tableKeys.length + 1 + '" class=""><input type="checkbox" class="w-accounting__group-control" onchange="pirates.accounting.toggleRow.call(this, event);">'+tableKeys[i]+'</td>'
      }
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
