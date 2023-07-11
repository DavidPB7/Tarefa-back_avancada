const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const linkRoutes = require('./routes/linkRoutes');

app.use(express.json());
app.use(cors());
app.use('/link', linkRoutes);

app.use(
    express.urlencoded({
        extended: true,
    })
);


app.get('/', (req, res) => {

    res.json({message: 'Oi express'});
});

mongoose.connect('mongodb://0.0.0.0:27017/APINode')
.then(() => {
    console.log('MongoDB conectado')
    app.listen(3000);
})
.catch((err) => console.log(err));