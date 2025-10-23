import { Composition } from 'remotion';
import { VideoComposition } from './components/videocompo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DynamicVideo"
        component={VideoComposition as any}  
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Welcome',
          subtitle: 'This is amazing!',
          backgroundImage: '/bg-images/sunset.png',
          music: '/music/upbeat.mp3',
          textColor: '#ffffff',
          name: 'John Doe',
          message: 'This is a dynamic video generated with Remotion!',
        }}
      />
    </>
  );
};