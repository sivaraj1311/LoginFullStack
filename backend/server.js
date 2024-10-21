require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');
const mongoose=require('mongoose')

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  console.log("Path: " + req.path + " | Method: " + req.method);
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON' });
  }
  next();
});
// app.post('/login', (req, res) => {
//   console.log(req.body); 
//   const { username, email, password } = req.body;
// });
// app.post('/signup', (req, res) => {
//   console.log(req.body);  
//   const { username, email, password } = req.body;
// });

app.use('/',authRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Mongodb connection & Server running on port ${process.env.PORT}`);
  });
}).catch(error => {
  console.error(error);
});
