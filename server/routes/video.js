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

    // Validate required fields
    if (!title || !name) {
      return res.status(400).json({ error: 'Title and name are required.' });
    }

    if (!backgroundImage) {
      return res.status(400).json({ error: 'Background image is required.' });
    }

    console.log('Generating video with props:', req.body);

    // Resolve background image path for server-side rendering
    let resolvedBg;

    // Remove leading slash and /public prefix if present
    const cleanPath = backgroundImage.replace(/^\/?(public\/)?/, '');
    
    // Build absolute path to the image
    const publicDir = path.resolve(__dirname, '../../public');
    const imagePath = path.join(publicDir, cleanPath);

    console.log('Looking for background image at:', imagePath);

    // Check if file exists
    if (fs.existsSync(imagePath)) {
      resolvedBg = imagePath;
      console.log('✅ Background image found');
    } else {
      // Try alternative path (bg-images vs bg images)
      const altPath = path.join(publicDir, 'bg-images', path.basename(cleanPath));
      if (fs.existsSync(altPath)) {
        resolvedBg = altPath;
        console.log('✅ Background image found at alternative path');
      } else {
        console.warn('⚠️ Background image not found at:', imagePath);
        console.warn('⚠️ Alternative path also not found:', altPath);
        return res.status(400).json({ 
          error: 'Background image not found',
          details: `Image path: ${imagePath}` 
        });
      }
    }

    // Generate the video
    const videoPath = await generateVideo({
      title,
      subtitle: subtitle || '',
      backgroundImage: resolvedBg, // Absolute file path for rendering
      textColor: textColor || '#ffffff',
      duration: parseInt(duration) || 5,
      name,
      message: message || '',
    });

    // Return the video URL
    const videoUrl = `http://localhost:${process.env.PORT || 3001}/videos/${path.basename(videoPath)}`;

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
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

module.exports = router;