const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;
app.use(bodyParser.json());

let products = [
    { id: 1, name: 'Product A', price: 100, qty: 10 },
    { id: 2, name: 'Product B', price: 200, qty: 20 },
    { id: 3, name: 'Product C', price: 300, qty: 30 },
    { id: 4, name: 'Product D', price: 400, qty: 40 },
    { id: 5, name: 'Product E', price: 500, qty: 50 },
    { id: 6, name: 'Product F', price: 600, qty: 60 },
    { id: 7, name: 'Product G', price: 700, qty: 70 },
    { id: 8, name: 'Product H', price: 800, qty: 80 },
    { id: 9, name: 'Product I', price: 900, qty: 90 },
    { id: 10, name: 'Product J', price: 1000, qty: 100 }
];

app.get('/products', (req, res) => {
    res.json(products);
});

app.patch('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, price, qty } = req.body;

    const product = products.find(p => p.id === productId);

    if (product) {
        product.name = name;
        product.price = price;
        product.qty = qty;
        res.json({ message: 'Quantity updated successfully', product });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.post('/createOrder', (req, res) => {
    const { orderString } = req.body;

    const orders = orderString.split(',');
    const orderResults = [];
    const exceeds = [];
    const productNotFound = [];
    let grandTotal = 0;

    orders.forEach(order => {
        const [productId, qty] = order.split('-').map(Number);
        const product = products.find(p => p.id === productId);

        if (!product) {
            productNotFound.push({
                productId
            });
        } else if (qty > product.qty) {
            exceeds.push({
                productId,
                message: `Requested quantity (${qty}) exceeds available stock (${product.qty})`
            });
        }
    });

    if (productNotFound.length) {
        return res.status(400).json(
            {
                message: "Product not found.",
                productNotFound
            });
    } else if (exceeds.length) {
        return res.status(400).json(
            {
                message: "Exceeds available stock.",
                exceeds
            });
    } else {
        orders.forEach(order => {
            const [productId, qty] = order.split('-').map(Number);
            const product = products.find(p => p.id === productId);

            const total = product.price * qty;
            grandTotal += total;

            orderResults.push({
                productId,
                name: product.name,
                cost: `(${product.price} * ${qty})  = ${total}`
            });

            product.qty -= qty;
        });

        return res.status(201).json(
            {
                message: "Order created.",
                orderResults, grandTotal
            });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});