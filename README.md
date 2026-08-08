# nm.yuriybevov.ru — Сайт «Рафа»

Производство и продажа упаковочных материалов.  
Сборка: **Nunjucks** + **SCSS** → статический HTML → **Caddy** (или любой HTTP-сервер).

---

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Собрать проект
node build.js

# 3. Открыть в браузере
open dist/index.html
```

Сборка генерирует `dist/` — статический сайт, готовый к деплою на любой HTTP-сервер.

---

## Структура проекта

```
nm-tape/
├── src/
│   ├── scss/                    # Стили (SCSS)
│   │   ├── main.scss            #   точка входа
│   │   ├── base/
│   │   │   ├── _variables.scss  #   цвета, шрифты, отступы
│   │   │   ├── _reset.scss      #   сброс, базовые стили
│   │   │   └── _typography.scss #   типографика
│   │   └── components/
│   │       └── _all.scss        #   компоненты (кнопки, карточки, nav, footer...)
│   ├── templates/               # Шаблоны (Nunjucks)
│   │   ├── base.html            #   layout — скелет страницы
│   │   ├── header.html          #   шапка / навигация
│   │   ├── footer.html          #   подвал
│   │   ├── topline.html         #   верхняя плашка с контактами
│   │   ├── macros/              #   макросы Nunjucks
│   │   │   └── breadcrumbs.html
│   │   ├── partials/            #   частичные компоненты
│   │   │   └── catalog_sidebar.html
│   │   ├── pages/               #   шаблоны страниц (24 шт.)
│   │   │   ├── index.html       #     главная
│   │   │   ├── catalog.html     #     каталог
│   │   │   ├── strapping.html   #     стреппинг-ленты
│   │   │   ├── mites.html       #     клещи (с таблицей моделей)
│   │   │   └── ...
│   │   └── style-reference.css  #   референс дизайн-системы
│   └── data/                    # Данные (JSON)
│       ├── contacts.json        #   телефоны, адреса, email
│       ├── catalog.json         #   дерево каталога
│       └── products.json        #   товары и описания
├── dist/                        # Результат сборки (gitignored)
│   ├── index.html
│   ├── css/style.css            #   скомпилированный SCSS
│   └── img/                     #   изображения
├── build.js                     # Скрипт сборки
├── package.json
└── README.md
```

## Команды

| Команда | Что делает |
|---------|-----------|
| `npm install` | Установить зависимости |
| `node build.js` | Собрать SCSS + Nunjucks → `dist/` |
| `node build.js && cp -r dist/* /var/www/nm.yuriybevov.ru/` | Собрать и задеплоить |

---

## Как это работает

**build.js** делает две вещи по порядку:

1. **SCSS** — компилирует `src/scss/main.scss` → `dist/css/style.css` (минифицированный)
2. **Nunjucks** — рендерит все шаблоны из `src/templates/pages/` с данными из `src/data/*.json` → `dist/*/index.html`

```js
// build.js — ключевые строки
const sass = require('sass');
const result = sass.compile('src/scss/main.scss', { style: 'compressed' });
fs.writeFileSync('dist/css/style.css', result.css);

const nunjucks = require('nunjucks');
const html = env.render('pages/index.html', data);
fs.writeFileSync('dist/index.html', html);
```

---

## Дизайн-система

Цвета, типографика и компоненты определены в SCSS-переменных и миксинах:

```scss
// src/scss/base/_variables.scss
$slate-dark:  #141413;
$ivory-medium:#f0eee6;
$clay:        #d97757;
$font-serif:  'PT Serif', Georgia, serif;
$font-sans:   'Golos Text', Inter, sans-serif;
```

Подробнее — в файле `src/templates/style-reference.css` (референс CSS Custom Properties)  
и на странице [nm.yuriybevov.ru/design-system/](https://nm.yuriybevov.ru/design-system/).

---

## Деплой

На сервере стоит **Caddy**. Проект лежит в `/var/www/nm.yuriybevov.ru/`.  
Процесс деплоя:

```bash
# На dev-машине:
node build.js
rsync -avz dist/ root@server:/var/www/nm.yuriybevov.ru/

# Или напрямую на сервере:
cp -r dist/* /var/www/nm.yuriybevov.ru/
```

---