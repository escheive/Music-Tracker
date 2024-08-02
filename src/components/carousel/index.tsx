import React, { useState } from 'react';
import { Box, IconButton, Image } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';

interface CarouselProps {
  images: string[];
}

export const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <Box position="relative" width="100%" maxW="300px" mx="auto">
      {images.length > 1 && (
        <>
          <IconButton
            aria-label="Previous Image"
            icon={<ArrowBackIcon />}
            position="absolute"
            top="50%"
            left="0"
            transform="translateY(-50%)"
            zIndex="1"
            onClick={prevImage}
          />
          <IconButton
            aria-label="Next Image"
            icon={<ArrowForwardIcon />}
            position="absolute"
            top="50%"
            right="0"
            transform="translateY(-50%)"
            zIndex="1"
            onClick={nextImage}
          />
        </>
      )}
      <Image src={images[currentIndex]} alt={`Image ${currentIndex}`} boxSize="300px" objectFit="cover" />
    </Box>
  );
};
