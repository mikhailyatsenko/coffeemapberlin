import { InstagramEmbed } from 'react-social-media-embed';
import { BackgroundTexture } from './BackgroundTexture';
import cls from './InstagramEmbed.module.scss';

interface InstagramEmbedProfileProps {
  instaLink: string;
  image: string;
  normalView: boolean;
}
export const InstagramEmbedProfile = ({ instaLink, image, normalView = false }: InstagramEmbedProfileProps) => {
  return (
    <div className={`${cls.embedWrapper} ${normalView ? cls.backDrop : ''}`}>
      <div className={`${cls.embed}  ${normalView ? cls.normalView : ''}`}>
        <InstagramEmbed
          embedPlaceholder={<BackgroundTexture image={image} />}
          url={instaLink}
          width={'100%'}
          igVersion="v2"
        />
      </div>
    </div>
  );
};
