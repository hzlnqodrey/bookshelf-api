const { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler } = require('./handler')

const routes = [
    // [Route 1] - Create
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler
    },
    // [Route 2.0] - Read/Get All Books
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler
    },
    // [Route 2.1] - Read/Get Book by Id
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookByIdHandler
    },
    // [Route 3] - Edit/Update Book by Id
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBookByIdHandler
    },
    // [Route 4] - Delete Book By Id
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookByIdHandler
    }
]

module.exports = routes