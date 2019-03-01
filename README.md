# pirati.cz

[![Build Status](https://api.travis-ci.org/pirati-web/pirati.cz.svg?branch=gh-pages)](https://travis-ci.org/pirati-web/pirati.cz)

## Lokální spuštění

stejné jako na webech s jekyll-theme-pirati

https://raw.githubusercontent.com/pirati-web/praha.pirati.cz/master/odmeny.md

POZOR tento web používá stejné gemy, ale theme není zaplé!
## Struktura

Samotné stránky jsou v markdownu nebo v html (složitější struktura, např. vícesloupců apod)

Kolekce jsou markdown soubory s yaml hlavičkou v příslušné složce, na webu jsou použity 4:

- posts (články), foto 1300x744
- people (lidé), foto 165x220
- program
- teams (týmy)

Některé údaje jsou uvedeny v složce `_data`. Jsou zde ve formátu yaml nebo json.

**CSS** je ve složce `_sass` a je automaticky kompilováno a minifikován do jednoho souboru `main.css`.

**JavaScript** je ve složce `_include/js`. Knihovny jsou definovány v `bower.json` a produkční soubor je tvořen gulpem.

Jekyll má velmi podrobnou [dokumentaci](http://jekyllrb.com/docs/home/). A při vývoji též doporučuji [cheat sheet](http://jekyll.tips/jekyll-cheat-sheet/)
