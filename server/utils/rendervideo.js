const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');
const path = require('path');
const fs = require('fs');

async function generateVideo(props) {
  const compositionId = 'DynamicVideo';
  const outputLocation = path.join(
    __dirname,
    '../../public/videos',
    `video-${Date.now()}.mp4`
  );

  try {
    // Ensure videos directory exists
    const videosDir = path.join(__dirname, '../../public/videos');
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }

    console.log('Starting video render...');
    console.log('Props:', props);

    // Bundle the Remotion project
    const bundleLocation = await bundle({
      entryPoint: path.resolve(__dirname, '../../src/index.ts'),
      // Remove webpackOverride - not needed in v4
    });

    console.log('Bundle created at:', bundleLocation);

    // Get composition details
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps: props,
    });

    console.log('Composition selected:', composition);

    // Calculate duration in frames (duration in seconds * fps)
    const durationInFrames = props.duration * 30; // 30 fps

    // Render the video
    await renderMedia({
      composition: {
        ...composition,
        durationInFrames,
      },
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation,
      inputProps: props,
      // Add these for better rendering
      imageFormat: 'jpeg',
      onProgress: ({ progress }) => {
        console.log(`Rendering progress: ${Math.round(progress * 100)}%`);
      },
    });

    console.log('Video rendered successfully:', outputLocation);
    return outputLocation;

  } catch (error) {
    console.error('Error in generateVideo:', error);
    throw error;
  }
}

module.exports = { generateVideo };