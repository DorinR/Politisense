require('module-alias/register')
const Data = require('@data')
const UpdatePipelineManager = Data.Updates.PipelineManager
const Parameters = Data.Updates.Parameters.UpdateNode

process.on('message', async (message) => {
  if (invalidUpdateNode(message)) {
    process.exit(1)
  }

  await UpdatePipelineManager
    .create(message.node)
    .execute()
    .then(results => {
      console.log(`INFO: generated ${results.length} updates`)
    })
  process.exit(0)
})

function invalidUpdateNode (message) {
  return !Object.values(Parameters).includes(message.node) || message.node === Parameters.None
}
