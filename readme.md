# pirati.cz

[![Build Status](https://api.travis-ci.org/pirati-web/pirati.cz.svg?branch=gh-pages)](https://travis-ci.org/pirati-web/pirati.cz)

## Lokální spuštění

Instalacee na Fedora 25: `dnf install rubygem-jekyll npm`

Instalace ubuntu 16.04:

```
sudo apt-get install ruby-dev gcc make libghc-zlib-dev
gem install rubygems-update
gem install jekyll bundler
bundle
```

**Společné**

```
npm install
bower install
bundle install --path vendor/bundle --without test development
gulp
```

Repozitář můžeme naklonovat do jakékoliv složky (nemusí být ve `/var/www/`).

`bundle exec jekyll serve`, což stránku zkompiluje, spustí a ještě je stránka přístupná skrz localhost: `http://127.0.0.1:4000`

Popřípadě můžeme spustit jen: `bundle exec jekyll build`, což do složky `_site` připraví kompletní web (ten můžeme otevřít z prohlíže pomocí klavesové zkratky `ctrl+o`).

## Struktura

Samotné stránky jsou v markdownu nebo v html (složitější struktura, např. vícesloupců apod)

Kolekce jsou markdown soubory s yaml frontend v přísliušné složce, na webu jsou použity 4:

- posts (články)
- people (lidé)
- program
- teams (týmy)

Některé údaje jsou uvedeny v složce `_data`. Jsou zde ve formátu yaml nebo json.

**CSS** je ve složce `_sass` a je automaticky kompilováno a minifikován do jednoho souboru `main.css`.

**JavaScript** je ve složce `_include/js`. Knihovny jsou definovány v `bower.json` a produkční soubor je tvořen gulpem.

Jekyll má velmi podrobnou [dokumentaci](http://jekyllrb.com/docs/home/). A při vývoji též doporučuji [cheat sheet](http://jekyll.tips/jekyll-cheat-sheet/)
