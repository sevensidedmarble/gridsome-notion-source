const { Client } = require('@notionhq/client')

function initClient (token) {
  return new Client({ auth: token })
}

async function listDatabases (notion) {
  const response = await notion.databases.list()

  return response.results
}

// Returns an array of pages in this database.
async function getPagesFromDatabase (notion, databaseId) {
  const response = await notion.databases.query({
    database_id: databaseId
  })

  return response.results
}

async function getPage (notion, pageId) {
  const response = await notion.pages.retrieve({ page_id: pageId })

  return response
}

async function getBlocks (notion, blockId) {
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50
  })

  return response.results
}

module.exports = {
  initClient,
  listDatabases,
  getPagesFromDatabase,
  getPage,
  getBlocks
}
