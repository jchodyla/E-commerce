const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://jakubchodyla:dbUserPassword@cluster0.z6xjuxg.mongodb.net/e-commerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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
app.use('/images', express.static('upload/images'));


const fetchuser = async (req, res, next) => {
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

const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number
  },
  old_price: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now,
  },
  avilable: {
    type: Boolean,
    default: true,
  },
});

const Order = mongoose.model("Order", {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  products: [{
    productId: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  }],
  totalPrice: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  deliveryType: {
    type: String,
    required: true,
  },
  paymentType: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});



app.post("/placeorder", fetchuser, async (req, res) => {
  console.log("Placing order...");
  try {
    const { address, deliveryType, paymentType, cartItems, totalPrice } = req.body;
    console.log("Order details received:", req.body);
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
    console.log("Order saved:", order);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/orders", fetchuser, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId');
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/", (req, res) => {
  res.send("Root");
});

app.get("/search", async (req, res) => {
  const searchTerm = req.query.q;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;

  try {
    let query = {};
    
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (minPrice !== undefined && minPrice !== '' && maxPrice !== undefined && maxPrice !== '') {
      query.new_price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    } else if (minPrice !== undefined && minPrice !== '') {
      query.new_price = { $gte: Number(minPrice) };
    } else if (maxPrice !== undefined && maxPrice !== '') {
      query.new_price = { $lte: Number(maxPrice) };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/login', async (req, res) => {
  console.log("Login");
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
      console.log(user.id);
      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success, token, user: data.user });
    } else {
      return res.status(400).json({ success: success, errors: "please try with correct email/password" });
    }
  } else {
    return res.status(400).json({ success: success, errors: "please try with correct email/password" });
  }
});

app.post('/register', async (req, res) => {
  console.log("Sign Up");
  let success = false;
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: success, errors: "existing user found with this email" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();
  const data = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
  const token = jwt.sign(data, 'secret_ecom');
  success = true;
  res.json({ success, token, user: data.user });
});

app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products");
  res.send(products);
});

app.post('/addtocart', fetchuser, async (req, res) => {
  console.log("Add Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Added");
});

app.post('/removefromcart', fetchuser, async (req, res) => {
  console.log("Remove Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] != 0) {
    userData.cartData[req.body.itemId] -= 1;
  }
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Removed");
});

app.post('/getcart', fetchuser, async (req, res) => {
  console.log("Get Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({ success: true, name: req.body.name });
});

app.post("/removeproduct", async (req, res) => {
  const product = await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({ success: true, name: req.body.name });
});

app.get("/products/:category", async (req, res) => {
  const category = req.params.category;
  let products = await Product.find({ category });
  res.send(products);
});

app.get('/product/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findOne({ id });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, (error) => {
  if (!error) console.log("Server Running on port " + port);
  else console.log("Error : ", error);
});
