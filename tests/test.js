require('dotenv').config()

const { describe, expect, test } = require('@jest/globals')

const { initClient, listDatabases, getPagesFromDatabase, getPage, getBlocks } = require('../lib/notion.js')

describe('notion.js', () => {
  const notion = initClient(process.env.TEST_TOKEN)

  test('Test environment', () => {
    expect(process.env.TEST_TOKEN).toBeTruthy()
    expect(process.env.TEST_DATABASE).toBeTruthy()
  })

  test('listDatabases', async () => {
    const results = await listDatabases(notion)

    expect(results).toBeTruthy()
  })

  test('getPagesFromDatabase', async () => {
    const results = await getPagesFromDatabase(notion, process.env.TEST_DATABASE)

    expect(results).toBeTruthy()
  })

  test('getPage', async () => {
    const pages = await getPagesFromDatabase(notion, process.env.TEST_DATABASE)
    const results = await getPage(notion, pages[0].id)

    expect(results).toBeTruthy()
  })

  test('getBlocks', async () => {
    const results = await getBlocks(notion, process.env.TEST_DATABASE)

    expect(results).toBeTruthy()
  })
})

describe('notion.js', () => {
  test('plugin', (done) => {
    const setupPlugin = require('../index.js')
    const options = { token: process.env.TEST_TOKEN }

    const mockCollection = { addNode: jest.fn(() => true) }
    const mockAddCollection = jest.fn(() => mockCollection)
    const mockCreateReference = jest.fn(() => 1)

    const mockedActions = {
      addCollection: mockAddCollection,
      store: {
        createReference: mockCreateReference
      }
    }

    const mockedApi = {
      loadSource: async (callback) => {
        // NOTE to self: this is how you expect in this callback format for Jest.
        // See: https://jestjs.io/docs/asynchronous
        try {
          await callback(mockedActions)
          expect(mockAddCollection.mock.calls.length).toBe(3)
          expect(mockCreateReference.mock.calls.length).toBe(3)
          done()
        } catch (error) {
          done(error)
        }
      }
    }

    setupPlugin(mockedApi, options)
  })
})
