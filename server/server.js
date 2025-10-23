const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const videoRoutes = require('./routes/video');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/videos', express.static(path.join(__dirname, '../public/videos')));
app.use('/bg-images', express.static(path.join(__dirname, '../public/bg-images')));
app.use('/music', express.static(path.join(__dirname, '../public/music')));

// Serve client files if they exist
const clientPath = path.join(__dirname, '../client');
if (require('fs').existsSync(clientPath)) {
  app.use(express.static(clientPath));
}

// Routes
app.use('/api', videoRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server is running!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving videos from: ${path.join(__dirname, '../public/videos')}`);
  console.log(`🎨 Serving backgrounds from: ${path.join(__dirname, '../public/bg-images')}`);
});