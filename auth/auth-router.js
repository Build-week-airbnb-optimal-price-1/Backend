const router = require('express').Router();
const Users = require('./user-model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function generateToken(user) {
  console.log(user)

  const payload = {
  username: user.username,
  id: user.id,
};
const options = {
  expiresIn: '1d',
};
return jwt.sign(payload,'aeaeiouAndSometimesY', options);

}

router.post('/register', (req, res) => {
 
  const { username, password } = req.body;
  Users.insert({ username, password: bcrypt.hashSync(password, 8) })
    .then(id => {
      res.status(201).json({ message: "User registration complete", id });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Failed to register user!" });
    });
});

router.post('/login', (req, res) => {
 
  const { username, password } = req.body;
  Users
    .findByUsername(username)
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: "Login successful!",
          token,
          user_id: user.id       
          
        });
      } else {
        res.status(401).json({ message: "Password Incorrect!" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error during login attempt!" });
    });
});

module.exports = router;
