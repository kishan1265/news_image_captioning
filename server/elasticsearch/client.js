// connects server to elastic cloud via api key and cloud id
const { Client } = require("@elastic/elasticsearch");
const config = require("config");

const elasticConfig = config.get("elastic");

const client = new Client({
  cloud: {
    id: elasticConfig.cloudID,
  },
  auth: {
    apiKey: elasticConfig.apiKey,
    // when changing index in elastic cloud, you must regenerate the api key
    // username: elasticConfig.username,
    // password: elasticConfig.password,
  },
});

client
  .ping()
  .then((response) => console.log("You are connected to Elasticsearch!"))
  .catch((error) => console.error("Elasticsearch is not connected."));

module.exports = client;
