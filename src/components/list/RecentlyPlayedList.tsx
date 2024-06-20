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
  Link
} from '@chakra-ui/react';

export const RecentlyPlayedList = ({ recentlyPlayedSongs }: any) => {

  return (
    <>
      <TableContainer whiteSpace='wrap' height='100vh' overflowY='auto'>
        <Table variant='striped' colorScheme='alternatePurple'>
          <Thead>
            <Tr>
              <Th fontSize={{base: '16', md: '18'}}>#</Th>
              <Th fontSize={{base: '16', md: '18'}}>Track</Th>
              <Th fontSize={{base: '16', md: '18'}}>Artist</Th>
              <Th fontSize={{base: '16', md: '18'}}></Th>
            </Tr>
          </Thead>
          <Tbody>
            {recentlyPlayedSongs.map((item: any, i: number) => {
              const dateListened = new Date(item.played_at).toLocaleString();

              return (
                <Tr key={`recently played ${item.name, i}`} h='10%' w='100%'>
                  <Td fontSize={{base: '16', md: '18'}}>{dateListened}</Td>
                  <Td fontSize={{base: '16', md: '18'}}><Link href={item.external_urls?.spotify} target='_blank'>{item.name}</Link></Td>
                  <Td fontSize={{base: '16', md: '18'}}><Link href={item.artists[0]?.external_urls?.spotify} target='_blank'>{item.artists[0]?.name}</Link></Td>
                  <Td>
                    <Link href={item.album.external_urls?.spotify} target='_blank'>
                      <Image 
                        src={item.album?.images[0]?.url} 
                        boxSize={{base: '40px', md: '60px'}} 
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