require('module-alias/register')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

// bodyparser middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Init Middleware
app.use(express.json({ extended: false })) // allows us to get the data from the post body

// test root endpoint
app.get('/', (req, res) => res.send('API Running'))

// define our routes (these link to the endpoints in routes/api/...)
app.use('/api/votes', require('./backend/routes/api/votes'))
app.use('/api/users', require('./backend/routes/api/users'))
app.use('/api/representatives', require('./backend/routes/api/representatives'))
app.use('/api/voteRecord', require('./backend/routes/api/voteRecord'))
app.use('/api/bills', require('./backend/routes/api/bills'))
app.use('/api/auth', require('./backend/routes/api/auth'))
app.use('/api/ridings', require('./backend/routes/api/ridings'))
app.use('/api/budgets', require('./backend/routes/api/budgets'))
app.use('/api/parties', require('./backend/routes/api/parties'))
app.use(
  '/api/financialRecords',
  require('./backend/routes/api/financialRecords')
)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`server started on port ${PORT}`))
