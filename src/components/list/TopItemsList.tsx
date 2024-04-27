
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
  Image
} from '@chakra-ui/react';

export const TopItemsList = ({ itemType, items }) => {
  console.log(items)

  return (
    <>
      <TableContainer>
        <Table variant='striped' colorScheme='teal'>
          <TableCaption>Top {itemType}</TableCaption>
          <Thead>
            <Tr>
              <Th fontSize={{base: '16', md: '18'}}>#</Th>
              <Th fontSize={{base: '16', md: '18'}}>{itemType}</Th>
              <Th fontSize={{base: '16', md: '18'}}>Image</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item, i) => (
              <Tr key={item.name} h='10%' w='100%' >
                <Td fontSize={{base: '16', md: '18'}}>{i + 1}</Td>
                <Td fontSize={{base: '16', md: '18'}}>{item.name}</Td>
                <Td><Image src={item.images[0].url} boxSize={{base: '40px', md: '60px'}} borderRadius='full' fallbackSrc='https://via.placeholder.com/150' /></Td>
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