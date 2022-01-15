const { listDatabases, getPagesFromDatabase, getBlocks, initClient } = require('./lib/notion.js')

module.exports = function (api, options) {
  api.loadSource(async (actions) => {
    // Create the client.
    const notion = initClient(options.token)

    // Grab databases associated.
    const databases = await listDatabases(notion)

    // Add the Gridsome collections.
    const databaseCollection = actions.addCollection('NotionDatabase')
    const pageCollection = actions.addCollection('NotionPage')
    const blockCollection = actions.addCollection('NotionBlock')

    for (const database of databases) {
      // Parse the name out of rich text blocks.
      const databaseName = databases[0].title.map((t) => t.text.content).join(' ')

      databaseCollection.addNode({
        ...database,
        name: databaseName
      })

      const pages = await getPagesFromDatabase(notion, database.id)
      for (const page of pages) {
        pageCollection.addNode({
          ...page,
          database: actions.store.createReference(database)
        })

        const blocks = await getBlocks(notion, page.id)
        for (const block of blocks) {
          blockCollection.addNode({
            ...block,
            page: actions.store.createReference(page)
          })
        }
      }
    }
  })
}
