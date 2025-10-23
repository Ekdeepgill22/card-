const express = require('express');
const path = require('path');
const router = express.Router();
const { generateVideo } = require('../utils/rendervideo');
const fs = require('fs');

router.post('/generate-video', async (req, res) => {
  try {
    const {
      title,
      subtitle,
      backgroundImage,
      textColor,
      duration,
      name,
      message,
    } = req.body;

    if (!title || !name) {
      return res.status(400).json({ error: 'Title and name are required.' });
    }

    console.log('Generating video with props:', req.body);

    // ✅ Resolve background image path properly
    let resolvedBg;

    if (backgroundImage) {
      // Remove leading /public if present
      const relativePath = backgroundImage.replace(/^\/?public\//, '');
      const localPath = path.resolve(__dirname, `../public/${relativePath}`);

      // Check if file exists
      if (fs.existsSync(localPath)) {
        resolvedBg = localPath; // ✅ Use file path for server render
      } else {
        console.warn('⚠️ Background image not found at:', localPath);
        resolvedBg = path.resolve(__dirname, '../public/bg images/default.jpg');
      }
    } else {
      // Fallback to a default
      resolvedBg = path.resolve(__dirname, '../public/bg images/default.jpg');
    }

    const videoPath = await generateVideo({
      title,
      subtitle: subtitle || '',
      backgroundImage: resolvedBg, // ✅ Now absolute file path
      textColor: textColor || '#ffffff',
      duration: parseInt(duration) || 5,
      name,
      message: message || '',
    });

    const videoUrl = `http://localhost:${process.env.PORT || 3000}/videos/${path.basename(videoPath)}`;

    res.json({
      success: true,
      videoUrl,
      message: 'Video generated successfully!',
    });

  } catch (error) {
    console.error('❌ Error generating video:', error);
    res.status(500).json({
      error: 'Failed to generate video',
      details: error.message,
    });
  }
});

module.exports = router;
