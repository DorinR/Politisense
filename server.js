require('module-alias/register')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

// bodyparser middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Init Middleware
app.use(express.json({ extended: false })) // allows us to get the data from the post body

// test root endpoint
app.get('/', (req, res) => res.redirect('/login'))

// define our routes (these link to the endpoints in routes/api/...)
app.use('/api/votes', require('./src/routes/api/votes'))
app.use('/api/users', require('./src/routes/api/users'))
app.use('/api/representatives', require('./src/routes/api/representatives'))
app.use('/api/voteRecord', require('./src/routes/api/voteRecord'))
app.use('/api/bills', require('./src/routes/api/bills'))
app.use('/api/auth', require('./src/routes/api/auth'))
app.use('/api/ridings', require('./src/routes/api/ridings'))
app.use('/api/budgets', require('./src/routes/api/budgets'))
app.use('/api/parties', require('./src/routes/api/parties'))
app.use('/api/financialRecords', require('./src/routes/api/financialRecords'))
app.use('/api/parliament', require('./src/routes/api/parliament'))

// deployment configuration
const PORT = process.env.PORT || 5000
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => console.log(`server started on port ${PORT}`))
