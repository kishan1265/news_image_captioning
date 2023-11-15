const express = require('express');
const router = express.Router();
const axios = require('axios');
const client = require('../elasticsearch/client');
require('log-timestamp');
const { v4: uuidv4 } = require('uuid');
const indexedArticles = new Set();

const apiKey = '09169abcbfd34bd7a3bf9aed0cf4714a';
const pageSize = 100;
let totalPages = 0;
let isIndexing = false;

router.get('/news-aggregator', async (req, res) => {
    console.log('Loading news aggregator...');
    res.json('Running news aggregator...');

    indexData = async () => {
        try {
            // if (isIndexing) {
            //     console.log('Indexing is already in progress.');
            //     return;
            // }
            // isIndexing = true;
            // for (let page = 1; page <= totalPages; page++) {
                const page = totalPages + 1;
                totalPages = page;
                const URL = 'https://newsapi.org/v2/everything?sources=bbc-news,the-hindu,cnn,espn,the-times-of-india&language=en&sortBy=popularity&pageSize='+pageSize+'&page='+page;

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

                for (const article of results) {
                    if (!indexedArticles.has(article.url)) {
                        const articleObject = {
                            id: article.source ? article.source.id: null,
                            name: article.source ? article.source.name: null,
                            author: article.author,
                            title: article.title,
                            description: article.description,
                            url: article.url,
                            imageUrl: article.urlToImage,
                            publishedAt: article.publishedAt,
                            content: article.content,
                        };
                        try {
                            await client.index({
                                index: 'news_article_v2',
                                id: uuidv4(),
                                body: articleObject,
                                pipeline: 'news_pipeline',
                            });
                            console.log('Indexed article successfully.');
                            indexedArticles.add(article.url);
                        } catch (error) {
                            console.error('Failed to index article.');
                            console.error(error);
                        }
                    }
                }
            // }

            console.log('Indexing complete.');
        } catch (error) {
            console.log(error);
        }
        // isIndexing = false;
        console.log('Preparing for the next round of indexing...');
    };
    indexData();
    setInterval(indexData, 10 * 1000);
});

module.exports = router;