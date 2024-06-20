'use client';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Image,
  Link
} from '@chakra-ui/react';

interface TopItemsProps {
  itemType: string;
  items: [
    {
      name: string;
      external_urls: {
        spotify: string;
      };
      images: [
        {
          url: string;
        }
      ];
      album: {
        images: [
          {
            url: string
          }
        ]
      }
    }
  ];
}

export const TopItemsList = ({ itemType, items }: TopItemsProps) => {

  return (
    <>
      <TableContainer whiteSpace='wrap' height='100vh' overflowY='auto'>
        <Table variant='striped' colorScheme='alternatePurple'>
          <TableCaption placement='top'>Top {itemType}</TableCaption>
          <Thead>
            <Tr>
              <Th fontSize={{base: '16', md: '18'}}>#</Th>
              <Th fontSize={{base: '16', md: '18'}}>{itemType}</Th>
              <Th fontSize={{base: '16', md: '18'}}>Image</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item, i) => (
              <Tr key={`recently played ${item.name, i}`} h='10%' w='100%'>
                <Td fontSize={{base: '16', md: '18'}}>{i + 1}</Td>
                <Td fontSize={{base: '16', md: '18'}}><Link href={item.external_urls.spotify} target='_blank'>{item.name}</Link></Td>
                <Td>
                  <Image 
                    src={itemType==='Artists' ? item.images[0].url : item.album.images[0].url} 
                    boxSize={{base: '40px', md: '60px'}} 
                    fallbackSrc='https://via.placeholder.com/150' 
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th fontSize={{base: '16', md: '18'}}>#</Th>
              <Th fontSize={{base: '16', md: '18'}}>{itemType}</Th>
              <Th fontSize={{base: '16', md: '18'}}>Image</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  )
};