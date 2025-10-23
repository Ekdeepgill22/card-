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

    // Bundle the Remotion project
    const bundleLocation = await bundle({
      entryPoint: path.join(__dirname, '../../src/index.ts'),
      webpackOverride: (config) => config,
    });

    // Get composition details
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps: props,
    });

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
    });

    console.log('Video rendered successfully:', outputLocation);
    return outputLocation;

  } catch (error) {
    console.error('Error in generateVideo:', error);
    throw error;
  }
}

module.exports = { generateVideo };