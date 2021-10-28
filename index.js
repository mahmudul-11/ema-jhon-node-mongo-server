const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;

//Middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gbhkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri); // user password thik moto set hoise kina check kora

async function run() {
    try {
        await client.connect();
        console.log('Connected to database');
        const database = client.db('onlineShop');
        const productsCollection = database.collection('products');
        //GET API
        app.get('/products', async (req, res) => {
            // console.log(req.query);
            const cursor = productsCollection.find({});
            const count = await cursor.count();
            const page = req.query.page;
            console.log(typeof (page))
            const size = parseInt(req.query.size);

            let products;
            if (page) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }


            res.send({ count, products });
        })
        //POST API

        //DELET API
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Ema jhon server is running!')
})

app.listen(port, () => {
    console.log('lisiting to port', port)
})
