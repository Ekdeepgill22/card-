import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';

interface VideoProps {
  title: string;
  subtitle: string;
  backgroundImage: string; // can be URL or absolute path
  textColor: string;
  name: string;
  message: string;
}

export const VideoComposition: React.FC<VideoProps> = ({
  title,
  subtitle,
  backgroundImage,
  textColor,
  name,
  message,
}) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1]);
  const subtitleOpacity = interpolate(frame, [20, 50], [0, 1]);
  const messageOpacity = interpolate(frame, [40, 70], [0, 1]);

  // ✅ Detect environment and resolve correct image source
  let resolvedBg: string;
  if (typeof window !== 'undefined') {
    // Running in browser (Remotion preview)
    if (backgroundImage.startsWith('http') || backgroundImage.startsWith('/')) {
      resolvedBg = backgroundImage;
    } else {
      resolvedBg = `${backgroundImage}`;
    }
  } else {
    // Running in Node (renderMedia)
    // For absolute paths like /Users/.../public/bg images/sunset.png
    resolvedBg = backgroundImage;
  }

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* ✅ Smartly load the correct background image */}
      <Img
        src={resolvedBg}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      <div
        style={{
          color: textColor,
          opacity: titleOpacity,
          fontSize: 80,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 30,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: textColor,
          opacity: subtitleOpacity,
          fontSize: 40,
          textAlign: 'center',
          marginBottom: 60,
        }}
      >
        {subtitle}
      </div>

      <div
        style={{
          color: textColor,
          opacity: messageOpacity,
          fontSize: 30,
          textAlign: 'center',
          maxWidth: '80%',
          marginBottom: 20,
        }}
      >
        {message}
      </div>

      <div
        style={{
          color: textColor,
          opacity: messageOpacity,
          fontSize: 25,
          fontStyle: 'italic',
        }}
      >
        - {name}
      </div>
    </AbsoluteFill>
  );
};
