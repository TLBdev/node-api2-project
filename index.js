const server = require('./api/server')

server.listen(4500, () => {
    console.log('\n*** Server Running on http://localhost:4500 ***\n')
})