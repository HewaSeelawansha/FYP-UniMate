const express = require('express')
const app = express();
const cors = require('cors')
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_PK);

//middleware
app.use(cors());
app.use(express.json());

//mongodb config
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@unimate-cluster.nltol.mongodb.net/UnimateDB?retryWrites=true&w=majority&appName=Unimate-Cluster`)
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('MongoDB connection error:', err));

//jwt config
app.post('/jwt', async(req,res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  res.send({token});
})

//import routes
const listingRoutes = require('./api/routes/listingRoutes');
const boardingRoutes = require('./api/routes/boardingRoutes');
const cartRoutes = require('./api/routes/cartRoutes');
const userRoutes = require('./api/routes/userRoutes');
const paymentsRoutes = require('./api/routes/paymentRoutes');
const chatRoutes = require('./api/routes/chatRoutes');
const messageRoutes = require('./api/routes/messageRoutes');
const reviewRoutes = require('./api/routes/reviewRoutes');
app.use('/boarding', boardingRoutes);
app.use('/listing', listingRoutes);
app.use('/carts', cartRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentsRoutes);
app.use('/chat', chatRoutes);
app.use('/message', messageRoutes);
app.use('/reviews', reviewRoutes);

//stripe routes
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price*100;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd", 
    
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get('/', (req, res) => {
  res.send('Hello Baby!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});