import React from 'react';
import {
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Image,
  Flex,
  Card,
  CardHeader,
  CardBody,
  Heading,
} from '@chakra-ui/react';
import { parseISO, format } from 'date-fns';

interface TrackProps {
  selectedTrack: any;
}

export const TrackModal: React.FC<TrackProps> = ({ selectedTrack }) => {
  
  if (!selectedTrack) return

  const releaseDate = selectedTrack?.track?.album?.release_date;
  let formattedDate = "Unknown Release Date";

  if (releaseDate) {
    const parsedDate = parseISO(releaseDate);
    formattedDate = format(parsedDate, 'MMMM d, yyyy');
  }

  const formatDuration = (timeInMs: number) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m ${seconds}s`;
  };

  return (
    <>
      <Flex position="relative" alignItems="center" p={3}>
        <Image
          src={selectedTrack?.track.album.images[0].url} 
          boxSize={{base: '50px', md: '60px'}} 
          fallbackSrc='https://via.placeholder.com/150' 
          mr='3'
        />
        <Flex flexDirection='column' flex='1' wrap='wrap' alignItems='center'>
          <ModalHeader textAlign="center" m={0}>{selectedTrack?.track.name}</ModalHeader>
          <Flex wrap="wrap" justifyContent="center">
            {selectedTrack?.track.artists?.map((artist: any, index: number) => (
              <React.Fragment key={artist.id}>
                <Text fontWeight='500'>{artist.name}</Text>
                {index === 0 && selectedTrack?.track.artists.length > 1 && <Text paddingInline='1' fontWeight='bold'>feat. </Text>}
                {index > 0 && index < selectedTrack?.track.artists.length - 1 && <Text paddingRight='1'>,</Text>}
              </React.Fragment>
            ))}
          </Flex>
        </Flex>
      </Flex>
      <ModalCloseButton />
      <ModalBody marginTop={5}>
        <Flex mb='1' width='100%' justifyContent='space-around'>
          <Card size='sm' width='30%' alignItems='center'>
            <CardHeader>
              <Heading size='sm'>Popularity</Heading>
            </CardHeader>
            <CardBody>
              <Text>{selectedTrack?.track.popularity}</Text>
            </CardBody>
          </Card>
          <Card size='sm' width='30%' alignItems='center'>
            <CardHeader>
              <Heading size='sm'>Duration</Heading>
            </CardHeader>
            <CardBody>
              <Text>{formatDuration(selectedTrack?.track.duration_ms)}</Text>
            </CardBody>
          </Card>
          <Card size='sm' width='30%' alignItems='center'>
            <CardHeader>
              <Heading size='sm'>Release</Heading>
            </CardHeader>
            <CardBody>
              <Text>{formattedDate}</Text>
            </CardBody>
          </Card>
        </Flex>
      </ModalBody>
    </>
  )
}