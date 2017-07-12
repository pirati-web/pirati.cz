---
uid: strednicechy
cid: praha
name: Kandidátka Středočeský kraj
fullname: Kandidátka do PS Parlamentu ČR Středočeský kraj 2017
img: teams/plzen.jpg
region: Středočeský kraj
categories:
- kandidatky
tags:
- středočeský-kraj, volby
---

{% assign i = 0 %}
|---|---|{% for person in site.data.elections.y2017.strednicechy %}{% assign i = i | plus: 1 %}{% assign imgsrc = person.img | prepend: '/assets/img/people/' %}
|   | **{{i}}. {{person.name}}** |
| <img src="{{imgsrc}}" alt="Drawing" style="height: 200px; max-width: 150px; margin-right: 10px;"/> | {{person.description}} |
{% endfor %}
