const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const videoRoutes = require('./routes/video');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/videos', express.static(path.join(__dirname, '../public/videos')));
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.use('/api', videoRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});