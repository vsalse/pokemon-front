import React, { useState } from 'react';
import Spinner from './Spinner';

interface ImageWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({ src, alt, width, height, style, className, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        width: width || 72,
        height: height || 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      className={className}
    >
      {!loaded && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.2)', zIndex: 1 }}>
          <Spinner size={32} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.2s',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          borderRadius: style && (style as any).borderRadius,
        }}
        onLoad={() => setLoaded(true)}
        draggable={false}
        {...rest}
      />
    </div>
  );
};

export default ImageWithLoader; 