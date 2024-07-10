'use client';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Image,
  Link,
  useTheme
} from '@chakra-ui/react';
import spotifyLogo from '@assets/spotify/logos/Spotify_Logo_RGB_Black.png';

interface RecentlyPlayedListProps {
  recentlyPlayedSongs: Record<string, any>[]
}

export const RecentlyPlayedList: React.FC<RecentlyPlayedListProps> = ({ recentlyPlayedSongs }) => {

  return (
    <>
      <TableContainer whiteSpace='wrap' height='100vh' overflowY='auto'>
        <Table variant='striped'>
          <Thead>
            <Tr>
              <Th fontSize={{base: '16', md: '18'}}>Time</Th>
              <Th fontSize={{base: '16', md: '18'}}>Track</Th>
              <Th fontSize={{base: '16', md: '18'}}>Artist</Th>
              <Th fontSize={{base: '16', md: '18'}}>Album</Th>
            </Tr>
          </Thead>
          <Tbody>
            {recentlyPlayedSongs?.map((item: Record<string, any>, i: number) => {
              const dateListened = new Date(item.played_at).toLocaleString();

              return (
                <Tr key={`recently played ${item.name, i}`} height='auto' w='100%'>
                  <Td fontSize={{ sm: '12px', base: '16px', md: '18px'}}>{dateListened}</Td>
                  <Td fontSize={{ sm: '12px', base: '16px', md: '18px'}}><Link href={item.external_urls?.spotify} target='_blank'>{item.name}</Link></Td>
                  <Td fontSize={{ sm: '12px', base: '16px', md: '18px'}}><Link href={item.artists[0]?.external_urls?.spotify} target='_blank'>{item.artists[0]?.name}</Link></Td>
                  <Td>
                    <Link href={item.album.external_urls?.spotify} target='_blank'>
                      <Image 
                        src={item.album?.images[0]?.url} 
                        objectFit='contain'
                        boxSize={{ sm: '26px', base: '36px', md: '48px'}}
                        minWidth='26px'
                        fallbackSrc='https://via.placeholder.com/150' 
                      />
                    </Link>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
};