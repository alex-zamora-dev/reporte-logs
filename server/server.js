const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init middleware
app.use(morgan('dev'));
app.use(express.json({ extended: false }));
app.use(cors());

// API ROUTES
app.use('/api', require('./routes/logs-routes'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));