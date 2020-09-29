import { v4 } from 'https://deno.land/std/uuid/mod.ts'
import type { Product } from '../types.ts'

let products: Product[] = [
    {
        id: "1",
        name: "Product One",
        description: "This is product one",
        price: 29.99,
    },
    {
        id: "2",
        name: "Product Two",
        description: "This is product two",
        price: 39.99,
    },
    {
        id: "3",
        name: "Product Three",
        description: "This is product three",
        price: 49.99,
    },
]

// @desc    Get all products
// @route   GET /api/v1/products
// deno-lint-ignore no-explicit-any
const getProducts = ({ response }: { response: any }) => {
    response.body = {
        success: true,
        data: products
    }
}

// @desc    Get single product
// @route   GET /api/v1/products/:id
// deno-lint-ignore no-explicit-any
const getProduct = ({ params, response }: { params: { id: string}, response: any }) => {
    const product: Product | undefined = products.find(p => p.id === params.id)
    
    if(product) {
        response.status = 200
        response.body = {
            success: true,
            data: product
        }
    } else {
        response.status = 404
        response.body = {
            success: false,
            msg: 'No product found'
        }
    }
}

// @desc    Add product
// @route   POST /api/v1/products
// deno-lint-ignore no-explicit-any
const addProduct = async ({ request, response }: { request: any, response: any }) => {
    const body = await request.body()
    
    if (!request.hasBody) {
        response.status = 400
        response.body = {
            success: false,
            msg: 'No data'
        }
    } else {
        const product: Product = await body.value
        product.id = v4.generate()
        products.push(product)
        response.status = 201
        response.body = {
            success: true,
            data: product
        }
    }
}

// @desc    Update product
// @route   PUT /api/v1/product/:id
// deno-lint-ignore no-explicit-any
const updateProduct = async ({ params, request, response }: { params: { id: string }, request: any, response: any }) => {
    const product: Product | undefined = products.find(p => p.id === params.id)
    
    if(product) {
        const body = await request.body()

        const updatedData: {name?: string, description?: string, price?: number } = await body.value

        products = products.map(p => p.id === params.id ? { ...p, ...updatedData } : p)

        response.status = 200
        response.body = {
            success: true,
            data: products
        }
    } else {
        response.status = 404
        response.body = {
            success: false,
            msg: 'No product found'
        }
    }
}

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// deno-lint-ignore no-explicit-any
const deleteProduct = ({ params, response }: { params: { id: string }, response: any }) => {
    products = products.filter(p => p.id !== params.id)
    response.status = 200
    response.body = {
        success: true,
        msg: 'Product removed'
    }
}
export { getProducts, getProduct, addProduct, updateProduct, deleteProduct }