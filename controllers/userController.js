const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


module.exports = {
  getUser: async (req, res) => {
    const user =  await db.User.findById(req.user);
    res.json({ 
      id: user._id,
      username: user.username, 
    });
  },
  register: async (req, res) => {
    try {
      let { name, email, username, password, business, industry, phone } = req.body;
  
      // validate
  
      if (!name || !email || !username || !password) {
        return res.status(400).json({ msg: "Not all fields have been entered." });
      }
  
      if (password.length < 5) {
        return res
          .status(400)
          .json({ msg: "The password needs to be at least 5 characters long." });
      }
  
      const existingUser = await db.User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ msg: "An account with this username has already been created"});
      }
  
      const existingEmail = await db.User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ msg: "An account with this email has already been created"});
      }
  
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      // console.log(passwordHash);
  
      const newUser = new db.User({
        name,
        email,
        username,
        password: passwordHash,
        business,
        industry,
        phone
      });
      const savedUser = await newUser.save();
      res.json(savedUser);
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { username, password } =req.body;

      // validate
      if (!username || !password) {
        return res.status(400).json({ msg: "Not all fields have been entered." });
      }

      const user = await db.User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ msg: "Username does not exist!"});
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ msg: "Invalid password!"});
      }

      const token =jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({
        token, 
        user: {
          id: user._id,
          name: user.name,
          username: user.username
        }
      })
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  valid: async (req, res) => {
    try{
      const token = req.header("x-auth-token");
      if (!token) {
        return res.json(false);
      }

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) {
        return res.json(false);
      }

      const user = await db.User.findById(verified.id);
      if (!user) {
        return res.josn(false);
      }

      return res.json(true);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  delete: async (req, res) => {
    try {
      const deletedUser = await db.User.findByIdAndDelete(req.user);
      res.json(deletedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
}