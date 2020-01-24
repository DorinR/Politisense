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
app.use('/api/votes', require('./routes/api/votes'))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/representatives', require('./routes/api/representatives'))
app.use('/api/voteRecord', require('./routes/api/voteRecord'))
app.use('/api/bills', require('./routes/api/bills'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/ridings', require('./routes/api/ridings'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`server started on port ${PORT}`))
