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
  Link,
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
        <Table variant='striped'>
          <TableCaption placement='top'>Top {itemType}</TableCaption>
          <Thead>
            <Tr>
              <Th fontSize={{ sm: '12px', base: '16px', md: '18px'}}>#</Th>
              <Th fontSize={{ sm: '12px', base: '16px', md: '18px'}}>{itemType}</Th>
              <Th fontSize={{ sm: '12px', base: '16px', md: '18px'}}>Album</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items?.map((item, i) => (
              <Tr key={`recently played ${item.name, i}`} h='auto' w='100%'>
                <Td fontSize={{ sm: '12px', base: '16px', md: '18px'}}>{i + 1}</Td>
                <Td fontSize={{ sm: '12px', base: '16px', md: '18px'}}><Link href={item.external_urls.spotify} target='_blank'>{item.name}</Link></Td>
                <Td>
                  <Image 
                    src={itemType==='Artists' ? item.images[0].url : item.album.images[0].url} 
                    objectFit='contain'
                    boxSize={{ sm: '26px', base: '36px', md: '48px'}}
                    minWidth='26px'
                    fallbackSrc='https://via.placeholder.com/150' 
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th fontSize={{ sm: '12px', base: '16px', md: '18px'}}>#</Th>
              <Th fontSize={{ sm: '12px', base: '16px', md: '18px'}}>{itemType}</Th>
              <Th fontSize={{ sm: '12px', base: '16px', md: '18px'}}>Image</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  )
};