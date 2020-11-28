const express = require('express');
const cors = require('cors');

const  products = [
    {
      "id": "123",
      "title": "Nome do produto 01",
      "image_url": "https://storage.googleapis.com/golden-wind/bootcamp-gostack/camiseta-ecommerce.jpg",
      "price": 50
    },
    {
      "id": "1234",
      "title": "Nome do produto 02",
      "image_url": "https://storage.googleapis.com/golden-wind/bootcamp-gostack/camiseta-ecommerce.jpg",
      "price": 60
    },
    {
      "id": "12345",
      "title": "Nome do produto 03",
      "image_url": "https://storage.googleapis.com/golden-wind/bootcamp-gostack/camiseta-ecommerce.jpg",
      "price": 70
    },
    {
      "id": "123456",
      "title": "Nome do produto 04",
      "image_url": "https://storage.googleapis.com/golden-wind/bootcamp-gostack/camiseta-ecommerce.jpg",
      "price": 80
    }
  ];

const app = express();
app.use(cors());
app.use(express.json());

app.get('/products', (req, res) => {
    return res.json(products)
})

app.listen(3333, () => {
    console.log('Back-End Started ')
});
