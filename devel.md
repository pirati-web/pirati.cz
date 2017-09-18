# Jak se zapojit do vývoje webu pirati.cz

**Základní anatomie**:

- [Jekyll][] vygeneruje statické stránky
- Šablonování v HTML pomocí [Liquid][]
- Samotný zdrojový kód je HTML5
  - Styly jsou psány v SASS a staví na [Foundation][]
  - JS využívá Jquery a Foundation
- Zdrojové kódy jsou na [Githubu][Github]
- Úkoly evidujeme v [Github issues][] (nebojte se nějakého chopit!)
- Webů je několik. Všechny jsou uložené v [github.com/pirati-web][pirati-web]. Je zde hlavní web Pirati.cz, dále krajské weby, registr smluv apod.

Všechny technologie jsou zvolené díky své přiznivé učící křivce. Nejedná se o nic složitého, ale dohromady již tvoří mocný celek.

Jak se s vývojem webu seznámit. **Naučte se**:

1. obecně HTML 5 (HTML, JS, CSS), JQuery
2. git (protokol) a github
3. základy Jekyllu

Nyní byste měli zvládat běžné úpravy weby (přidání nové stránky), opravy drobných chyb a podobně.

Pro opravdové pochopení budete ještě potřebovat základy gulpu a dobře poznat strukturu repozitáře. Ta vychází z jeykyllu, ale je o něco složitější než běžný ukázkový blog. Např. se využívá inludování snippetů, více druhů šablon, template se mírně mění dle yaml front matter.

Ideální první zapojení:

1. Vyberte si issue
2. Udělejte fork
3. V rámci forku issue vyřešte
4. Aktualizujte fork (pokud zastará)
5. Zašlete pull request
6. Seniorní admini se vyjádří
7. Zaneste opravy dle připomínek
8. Seniorní admini přijmou vaše změny

Jakmile budeme znát vaší práci, tak se můžeme individuálně dohodnout na dalším postupu.

**Kdo vám pomůže**:

- Ondřej Profant - hlavní supervizor celého webu

**Další projekty technikého odboru**: pokud chcete něco víc, než HTMl, tak máme další projekty psané v:

- Angular 2
- Nette
- nodejs

Pro systémové adminy by mohla být zajímavá naše infrastruktura:

- virtualizace
  - kvm
  - docker
- aplikace
  - postfix
  - redmine

[Jekyll]: http://jekyllrb.com/
[Liquid]: https://shopify.github.io/liquid/
[Foundation]: http://foundation.zurb.com/
[Github]: https://github.com/
[Github issues]: https://github.com/pirati-web/pirati.cz/issues
[pirati-web]: https://github.com/pirati-web/
