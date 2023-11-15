const client = require("./elasticsearch/client");

async function generateApikeys(opts) {
  const body = await client.security.createApiKey({
    body: {
      name: "My_deployment",
      role_descriptors: {
        news_manager: {
          cluster: ["monitor"],
          index: [
            {
              names: ["news_image_captioning"],
              privileges: ["all"],
            },
          ],
        },
      },
    },
  });
  return Buffer.from(`${body.id}:${body.api_key}`).toString("base64");
}

generateApikeys()
  .then(console.log)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
