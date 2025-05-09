const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
  console.log("Login data:", req.body);
  
  res.redirect('/dashboard'); 
});

app.post('/register', (req, res) => {
  console.log("Register data:", req.body);
  
  res.redirect('/dashboard'); 
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
