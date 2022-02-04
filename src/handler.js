const { nanoid } = require('nanoid')
const books = require('./books')

// ✔️ [HANDLER 1] = CREATE/ADD
const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    // nanoid = Unique and random ID generator [di contohnya ada 16 karakter random]
    const id = nanoid(16)

    // untuk properti insertedAt dan updatedAt itu sama di dalam logika CREATE/menambahkan catatan baru
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    // finishedAt - merupakan properti boolean yang menjelaskan apakah buku telah selesai dibaca atau belum. Nilai finished didapatkan dari observasi pageCount === readPage.
    const finished = readPage === pageCount

    // buat temporary variabel bertipe objek untuk menampung variabel yang sudah dibuat/dapatkan
    const newBooks = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }

    // masukkan nilai-nilai properti dari objek newBooks ke dalam array books menggunakan method push()
    books.push(newBooks)

    // ✔️ Case 1 - Client tidak melampirkan properti name pada request body.
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400) // Bad Request
        return response
    }

    // ✔️ Case 2 - Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400) // Bad Request
        return response
    }

    // memastikan jika newBooks benar2 sudah ada dan di push ke dalam array books di dalam berkas books.js
    const isSuccess = books.filter((book) => book.id === id).length > 0

    // kemudian, isSuccess digunakan untuk menentukan respons yang akan diberikan oleh server [custom response]
    // jika isSuccess bernilai true -> maka beri response berhasil
    // jika isSuccess bernilai false -> maka beri response gagal
    if (isSuccess) {
        // ✔️ Buku berhasil dimasukkan
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        })
        response.code(201) // Created
        return response
    }
    // ✔️ Case 3 - Server gagal memasukkan buku karena alasan umum (generic error).
    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan'
    })
    response.code(500) // Server Internal Error
    return response
}

const getAllBooksHandler = () => ({
    status: 'success',
    data: {
        books: [
            
        ]
    }
})

// export dengan metode object literals agar memudahkan ekspor lebih dari satu nilai pada satu berkas JS.
module.exports = { addBookHandler, getAllBooksHandler }