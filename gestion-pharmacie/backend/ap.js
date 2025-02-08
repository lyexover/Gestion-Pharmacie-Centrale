const express = require('express');
const auth = require('./routes/auth');   
const users = require('./routes/users'); 
const app = express();
const cors = require('cors')
const products = require('./routes/products');

app.use(express.json());
app.use(cors({origin : 'http://localhost:5173'}))

app.use('/api', auth);
app.use('/api', users);
app.use('/api', products);


const PORT = 3000;
app.listen(PORT,() => {
    console.log('listening on port');}
    )