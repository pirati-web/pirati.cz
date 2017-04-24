---
uid: plzensko
cid: plzen
name: Kandidátka Plzeňský kraj
fullname: Kandidátka do PS Parlamentu ČR Plzeňský kraj 2017
img: teams/plzen.jpg
region: Plzeňský kraj
categories:
- kandidatky
tags:
- plzeňský-kraj, volby
---

{% assign i = 0 %}
|---|---|{% for person in site.data.elections.y2017.plzensko %}{% assign i = i | plus: 1 %}{% assign imgsrc = person.img | prepend: '/assets/img/people/' %}
|   | **{{i}}. {{person.name}}** |
| <img src="{{imgsrc}}" alt="Drawing" style="height: 200px; max-width: 150px; margin-right: 10px;"/> | {{person.description}} |
{% endfor %}
