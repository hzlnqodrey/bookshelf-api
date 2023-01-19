const { nanoid } = require('nanoid')
const books = require('./books')

// ✔️ [HANDLER 1] = CREATE/ADD
const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

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

// ✔️ [HANDLER 2.0] = READ ALL BOOKS
const getAllBooksHandler = (request, h) => {
    // cek apakah ada query yang masuk ke url
    if (request.query !== null && request.query !== undefined) {
        // mendapatkan nilai dari query parameter dengan menggunakan object desctruction JS
        const { name, reading, finished } = request.query

        // Menampung data buku setelah di cek alur if else (control flow/alur) name, reading, dan finished satu persatu
        let getBooksSpecified

        //  ✔️ [Optional 1 - Query ?name] menampilkan daftar buku yang mengandung nama “dicoding” secara non-case sensitive (tidak peduli besar dan kecil huruf).
        if (name !== null && name !== undefined) {
            // dapatkan beberapa index yang dicari sesuai inputan nilai name pada query param dengan method array filter
            // includes method mengembalikan nilai boolean [referensi: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes]
            // pada kasusnya disini includes mengecek apakah ada gak sih 'dicoding Jobs' dan 'Kelas Dicoding' pada array books yang baru saja objectnya di Add dengan method POST
            getBooksSpecified = books.filter((book) => book.name.toUpperCase().includes(name.toUpperCase()))
        }

        // ✔️ [Optional 2 - Query ?reading] ?reading: Bernilai 0 atau 1. jadi untuk mengeceknya perlu sama dengan 2 (==) ? karena 0 === false itu false yg bakal bernilai true itu -> 0 == false [referensi: https://stackoverflow.com/questions/7615214/in-javascript-why-is-0-equal-to-false-but-when-tested-by-if-it-is-not-fals]
        if (reading !== null && reading !== undefined) {
            if (reading == true) {
                // dapatkan beberapa index yang dicari sesuai inputan nilai reading pada query param dengan method array filter
                getBooksSpecified = books.filter((book) => book.reading === true)
            } else if (reading == false) {
                getBooksSpecified = books.filter((book) => book.reading === false)
            }
        }

        // ✔️ [Optional 3 - Query ?finished] ?finished: Bernilai 0 atau 1.
        if (finished !== null && finished !== undefined) {
            if (finished == true) {
                // dapatkan beberapa index yang dicari sesuai inputan nilai finished pada query param dengan method array filter
                getBooksSpecified = books.filter((book) => book.finished === true)
            } else if (finished == false) {
                getBooksSpecified = books.filter((book) => book.finished === false)
            }
        }

        if (getBooksSpecified) {
            const response = h.response({
                status: 'success',
                data: {
                    books: getBooksSpecified.map(book => (
                        {
                            id: book.id,
                            name: book.name,
                            publisher: book.publisher
                        }
                    ))
                }
            })
            response.code(200) // OK
            return response
        }
    }

    // ✔️ [Mandatory - Get All Books]
    const response = h.response({
        status: 'success',
        data: {
            // dalam test environment di postman di expect-kan sebagai berikut: pm.expect(Object.keys(book)).to.lengthOf(3); [id, name, dan publisher]
            // jadi cari cara untuk mendapatkan nilai beberapa properti pada array books untuk ditampilkan ke output yang hanya berisi info ID, NAME, dan PUBLISHER
            // memakai Array Method => MAP untuk mendapatkan array baru yang diinginkan
            books: books.map(book => (
                {
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }
            ))
        }
    })
    response.code(200) // OK
    return response
}

// ✔️ [HANDLER 2.1] = READ BOOK BY ID
const getBookByIdHandler = (request, h) => {
    // dapatkan nilai ID dari path parameter
    const { bookId } = request.params

    // dapatkan index yang dicari sesuai inputan ID pada path dengan method array filter
    const book = books.filter((book) => book.id === bookId)[0]

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book
            }
        }
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    })
    response.code(404) // Not Found
    return response
}

// ✔️ [HANDLER 3] = UPDATE/EDIT BOOK BY ID
const editBookByIdHandler = (request, h) => {
    // dapatkan nilai ID dari path parameter
    const { bookId } = request.params

    // dapatkan nilai yang mau diupdate dari request payload
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    // update nilai updatedAt dengan data realtime setelah selesai di-edit
    const updatedAt = new Date().toISOString()

    // dapatkan index array yang akan diupdate dengan mencocokkan id dengan method array findIndex
    const index = books.findIndex((book) => book.id === bookId)

    // ✔️ Case 1 - Client tidak melampirkan properti name pada request body.
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400) // Bad Request
        return response
    }

    // ✔️ Case 2 - Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400) // Bad Request
        return response
    }

    // ✔️ Buku berhasil diedit/update
    if (index !== -1) {
        books[index] = {
            ...books[index], // id, finished, insertedAt tidak ikut berubah
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        }
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })
        response.code(200) // OK
        return response
    }
    // ✔️ Case 3 - Id yang dilampirkan oleh client tidak ditemukkan oleh server
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404) // Not Found
    return response
}

// ✔️ [HANDLER 4] = DELETE BOOK BY ID
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params

    const index = books.findIndex((book) => book.id === bookId)

    if (index !== -1) {
        books.splice(index, 1)
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200) // OK
        return response
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404) // Not Found
    return response
}

// export dengan metode object literals agar memudahkan ekspor lebih dari satu nilai pada satu berkas JS.
module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }