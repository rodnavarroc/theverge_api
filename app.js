var express = require('express');
var cors = require('cors');
var scrapeIt = require('scrape-it');

var urls = [];
var contents = [];

var app = express();
app.use(express.json());
app.use(cors());

app.get('/', function (req, res) {
    res.send('News API by @rodnavarroc');
});

app.get('/theverge/tech', (req, res) => {

    articles = [];
    contents = [];

    scrapeIt("https://www.theverge.com/tech", {
        articles: {
            listItem: ".c-compact-river__entry",
            data: {
                url: {
                    selector: ".c-entry-box--compact__title a",
                    attr: "href"
                }
            }
        }
    }).then(({ data, response }) => {

        urls = data.articles;

    }).then(() => {
        urls.forEach(function (e, idx, array) {
            scrapeIt(e.url, {
                title: ".c-page-title",
                subtitle: ".c-entry-summary",
                date: ".c-byline__item > time",
                content: {
                    selector: ".c-entry-content p",
                    eq: 0
                }
            }).then(({ data, response }) => {
                if (data.title != "" && data.subtitle != "" && data.content != "") contents.push(
                    {
                        "url": e.url,
                        "title": data.title,
                        "subtitle": data.subtitle,
                        "date": data.date,
                        "content": data.content
                    }
                );
            }).then(() => {
                if (idx === array.length - 1) {
                    res.send(contents);
                }
            })
        })
    })
});

const puerto = process.env.PORT || 5000;
app.listen(puerto, function () {
    console.log("Servidor iniciado en puerto:" + puerto);
});