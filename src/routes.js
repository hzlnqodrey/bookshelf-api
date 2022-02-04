const { addBookHandler, getAllBooksHandler } = require('./handler')

const routes = [
    // [Route 1] - Create
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler
    },
    // [Route 2] - Read/Get
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler
    }
]

module.exports = routes