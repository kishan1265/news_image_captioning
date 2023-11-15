const express = require('express');
const router = express.Router();
const axios = require('axios');
const client = require('../elasticsearch/client');
require('log-timestamp');
const { v4: uuidv4 } = require('uuid');
const indexedArticles = new Set();

const apiKey = 'Vw0srn6zpwPW4ZqefRL5Am7GT3YwBgWrGP1UUMlb';
const URL = 'https://newsapi.org/v2/everything?sources=bbc-news,the-hindu,cnn,espn,the-times-of-india&language=en&from=2023-05-30&to=2023-06-20&sortBy=popularity';

router.get('/news-aggregator', async (req, res) => {
    console.log('Loading news aggregator...');
    res.json('Running news aggregator...');

    indexData = async () => {
        try {
            console.log('Retrieving data from API...');

            const articles = await axios.get(URL, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${apiKey}`,
                },
            });

            console.log('Data retrieved from API.');

            results = articles.data.articles;

            console.log('Indexing data...');

            results.map(async (article) => {
                if (!indexedArticles.has(article.url)) {
                  (articleObject = {
                    id: article.source.id,
                    name: article.source.name,
                    author: article.author,
                    title: article.title,
                    description: article.description,
                    url: article.url,
                    imageUrl: article.urlToImage,
                    publishedAt: article.publishedAt,
                    content: article.content,
                  }),
                    await client
                      .index({
                        index: 'news_article_v2',
                        id: uuidv4(),
                        body: articleObject,
                        pipeline: 'news_pipeline',
                      })
                      .then((response) => {
                        console.log(`Indexed article successfully.`);
                        indexedArticles.add(article.url);
                      })
                      .catch((error) => {
                        console.error(`Failed to index article.`);
                        console.error(error);
                      });
                }
              });

            if(articles.data.length)
                indexData();
            else
                console.log('Indexing complete.');
        } catch (error) {
            console.log(error);
        }

        console.log('Preparing for the next round of indexing...');
    };
    indexData();
    setInterval(indexData, 10 * 1000);
});

module.exports = router;