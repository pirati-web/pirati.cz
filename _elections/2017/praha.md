---
uid: praha
cid: praha
name: Kandidátka Praha
fullname: Kandidátka do PS Parlamentu ČR Praha 2017
img: teams/praha.jpg
region: Praha
categories:
- kandidatky
tags:
- praha, volby
---

{% assign i = 0 %}
|---|---|{% for person in site.data.elections.y2017.plzensko %}{% assign i = i | plus: 1 %}{% assign imgsrc = person.img | prepend: '/assets/img/people/' %}
|   | **{{i}}. {{person.name}}** |
| <img src="{{imgsrc}}" alt="Drawing" style="height: 200px; max-width: 150px; margin-right: 10px;"/> | {{person.description}} |
{% endfor %}
