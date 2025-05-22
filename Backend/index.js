const express = require('express')
const app = express();
const cors = require('cors')
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const http = require('http');
const socketIO = require('socket.io'); 

const stripe = require("stripe")(process.env.STRIPE_PK);

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  console.log("A user connected");
  
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });

  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId)
    console.log("Data: ", data)
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
});

app.use(cors());
app.use(express.json());

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@unimate-cluster.nltol.mongodb.net/UnimateDB?retryWrites=true&w=majority&appName=Unimate-Cluster`)
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('MongoDB connection error:', err));

app.post('/jwt', async(req,res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  res.send({token});
})

const listingRoutes = require('./api/routes/listingRoutes');
const boardingRoutes = require('./api/routes/boardingRoutes');
const userRoutes = require('./api/routes/userRoutes');
const paymentsRoutes = require('./api/routes/paymentRoutes');
const chatRoutes = require('./api/routes/chatRoutes');
const messageRoutes = require('./api/routes/messageRoutes');
const reviewRoutes = require('./api/routes/reviewRoutes');
const bookingRoutes = require('./api/routes/bookingRoutes');
app.use('/boarding', boardingRoutes);
app.use('/listing', listingRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentsRoutes);
app.use('/chat', chatRoutes);
app.use('/message', messageRoutes);
app.use('/reviews', reviewRoutes);
app.use('/booking', bookingRoutes);

app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = Math.round(price * 100); 

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "lkr", 
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

server.listen(port, () => {
  console.log(`Unimate listening on port ${port}`)
});