const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
require('dotenv').config();
const mongoose=require('mongoose')

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey' ;
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({email});
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token =jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  signup,
  login
};
