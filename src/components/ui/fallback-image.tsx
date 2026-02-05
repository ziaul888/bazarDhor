import Image from 'next/image';
import { useState } from 'react';

interface FallbackImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  fallbackSrc?: string;
  [key: string]: any;
}

/**
 * Image component with fallback support
 * Shows a fallback image when the primary image fails to load
 */
export function FallbackImage({
  src,
  alt,
  fill = false,
  className = '',
  fallbackSrc = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop&q=80',
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  // Reset when src changes
  if (imgSrc !== src && hasError) {
    setImgSrc(src);
    setHasError(false);
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}