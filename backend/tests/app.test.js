const request = require('supertest');
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(cors());

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:4000/images/${req.file.filename}`
  });
});

// Mock User Model
const Users = mongoose.model("Users", new mongoose.Schema({
  name: String,
  email: String,
  password: String,
}));

// Mock Order Model
const Order = mongoose.model("Order", new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  products: [{
    productId: Number,
    quantity: Number,
  }],
  totalPrice: Number,
  address: String,
  deliveryType: String,
  paymentType: String,
}));

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};

app.post('/login', async (req, res) => {
  let success = false;
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
      success = true;
      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success, token, user: data.user });
    } else {
      return res.status(400).json({ success: success, errors: "please try with correct email/password" });
    }
  } else {
    return res.status(400).json({ success: success, errors: "please try with correct email/password" });
  }
});

app.post("/placeorder", fetchuser, async (req, res) => {
  try {
    const { address, deliveryType, paymentType, cartItems, totalPrice } = req.body;
    const userId = req.user.id;

    const products = Object.keys(cartItems).map(productId => ({
      productId: Number(productId),
      quantity: cartItems[productId]
    }));

    const order = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      products,
      totalPrice,
      address,
      deliveryType,
      paymentType,
    });

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

describe('POST /upload', () => {
  it('should upload a file and return the image URL', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('product', path.resolve(__dirname, 'Product_list_icon.svg')); 

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', 1);
    expect(res.body).toHaveProperty('image_url');
  }, 15000);
});

describe('POST /login', () => {
  it('should log in a user and return a token', async () => {
    const user = new Users({ email: 'test@example.com', password: 'password123' });
    await user.save();

    const res = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
  }, 15000);
});

describe('POST /placeorder', () => {
  it('should place an order', async () => {
    const token = jwt.sign({ user: { id: '60d0fe4f5311236168a109ca' } }, 'secret_ecom');
    const orderData = {
      address: '123 Test St',
      deliveryType: 'Standard',
      paymentType: 'Credit Card',
      cartItems: { '1': 2, '2': 1 },
      totalPrice: 300,
    };

    const res = await request(app)
      .post('/placeorder')
      .set('auth-token', token)
      .send(orderData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('order');
  }, 15000);
});

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/ecommerce_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
