const express = require('express')

const postRouter = require('./routers/postRouter')


const server = express()

server.get('/', (req, res) => {
    res.send(`
        <h1> Server Loaded </h1>
    `)
})

server.use(express.json())
server.use('/api/posts', postRouter)


module.exports = server