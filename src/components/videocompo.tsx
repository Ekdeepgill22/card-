import { AbsoluteFill, Img, interpolate, useCurrentFrame, Audio } from 'remotion';

interface VideoProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  music?: string;
  textColor: string;
  name: string;
  message: string;
}

export const VideoComposition: React.FC<VideoProps> = ({
  title,
  subtitle,
  backgroundImage,
  music,
  textColor,
  name,
  message,
}) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1]);
  const subtitleOpacity = interpolate(frame, [20, 50], [0, 1]);
  const messageOpacity = interpolate(frame, [40, 70], [0, 1]);

  // Use staticFile for Remotion's asset handling
  // If backgroundImage is an absolute path (server-side), use it as is
  // If it's a relative path (browser), use staticFile
  const isAbsolutePath = backgroundImage.startsWith('/') && !backgroundImage.startsWith('http');
  const resolvedBg = isAbsolutePath && typeof window === 'undefined' 
    ? `file://${backgroundImage}` 
    : backgroundImage;

  const resolvedMusic = music 
    ? (music.startsWith('/') && typeof window === 'undefined' 
        ? `file://${music}` 
        : music)
    : null;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* Background Image */}
      <Img
        src={resolvedBg}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Dark overlay for better text readability */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
      />

      {/* Background Music */}
      {resolvedMusic && <Audio src={resolvedMusic} volume={0.3} />}

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
        }}
      >
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
      </div>
    </AbsoluteFill>
  );
};