import { v4 } from 'https://deno.land/std/uuid/mod.ts'
import type { Book } from '../types.ts'

let books: Book[] = [
    {
        id: "1",
        name: "Book One",
        description: "This is book one",
        pages: 29.99,
    },
    {
        id: "2",
        name: "Book Two",
        description: "This is book two",
        pages: 39.99,
    },
    {
        id: "3",
        name: "Book Three",
        description: "This is book three",
        pages: 49.99,
    },
]

// @desc    Get all books
// @route   GET /api/v1/books
// deno-lint-ignore no-explicit-any
const getBooks = ({ response }: { response: any }) => {
    response.body = {
        success: true,
        data: books
    }
}

// @desc    Get single book
// @route   GET /api/v1/books/:id
// deno-lint-ignore no-explicit-any
const getBook = ({ params, response }: { params: { id: string}, response: any }) => {
    const book: Book | undefined = books.find(p => p.id === params.id)
    
    if(book) {
        response.status = 200
        response.body = {
            success: true,
            data: book
        }
    } else {
        response.status = 404
        response.body = {
            success: false,
            msg: 'No book found'
        }
    }
}

// @desc    Add book
// @route   POST /api/v1/books
// deno-lint-ignore no-explicit-any
const addBook = async ({ request, response }: { request: any, response: any }) => {
    const body = await request.body()
    
    if (!request.hasBody) {
        response.status = 400
        response.body = {
            success: false,
            msg: 'No data'
        }
    } else {
        const book: Book = await body.value
        book.id = v4.generate()
        books.push(book)
        response.status = 201
        response.body = {
            success: true,
            data: book
        }
    }
}

// @desc    Update book
// @route   PUT /api/v1/book/:id
// deno-lint-ignore no-explicit-any
const updateBook = async ({ params, request, response }: { params: { id: string }, request: any, response: any }) => {
    const book: Book | undefined = books.find(p => p.id === params.id)
    
    if(book) {
        const body = await request.body()

        const updatedData: {name?: string, description?: string, pages?: number } = await body.value

        books = books.map(p => p.id === params.id ? { ...p, ...updatedData } : p)

        response.status = 200
        response.body = {
            success: true,
            data: books
        }
    } else {
        response.status = 404
        response.body = {
            success: false,
            msg: 'No book found'
        }
    }
}

// @desc    Delete book
// @route   DELETE /api/v1/books/:id
// deno-lint-ignore no-explicit-any
const deleteBook = ({ params, response }: { params: { id: string }, response: any }) => {
    books = books.filter(p => p.id !== params.id)
    response.status = 200
    response.body = {
        success: true,
        msg: 'Book removed'
    }
}
export { getBooks, getBook, addBook, updateBook, deleteBook }