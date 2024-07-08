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

interface TableComponentProps {
  list: Record<string, any>[],
  columns: String[]
}

export const TableComponent: React.FC<TableComponentProps> = ({ list, columns }) => {
  console.log(list)

  return (
    <>
      <TableContainer whiteSpace='wrap' height='100vh' overflowY='auto'>
        <Table variant='striped' colorScheme='alternatePurple'>
          <Thead>
            <Tr>
              <Th fontSize={{base: '16', md: '18'}}>Time</Th>
              <Th fontSize={{base: '16', md: '18'}}>Track</Th>
              <Th fontSize={{base: '16', md: '18'}}>Artist</Th>
              <Th fontSize={{base: '16', md: '18'}}>Album</Th>
            </Tr>
          </Thead>
          <Tbody>
            {list?.map((item: Record<string, any>, i: number) => {

              return (
                <Tr key={`recently played ${item.track.name, i}`} height='auto' w='100%'>
                  <Td>
                    <Link href={item.track.album.external_urls?.spotify} target='_blank'>
                      <Image 
                        src={item[columns[0]]} 
                        objectFit='contain'
                        boxSize={{ sm: '26px', base: '36px', md: '48px'}}
                        minWidth='26px'
                        fallbackSrc='https://via.placeholder.com/150' 
                      />
                    </Link>
                  </Td>
                  <Td fontSize={{ sm: '12px', base: '16px', md: '18px'}}><Link href={item.track.external_urls?.spotify} target='_blank'>{item[columns[0]]}</Link></Td>
                  <Td fontSize={{ sm: '12px', base: '16px', md: '18px'}}><Link href={item.track.artists[0]?.external_urls?.spotify} target='_blank'>{item.track.artists[0]?.name}</Link></Td>
                  {/* <Td fontSize={{ sm: '12px', base: '16px', md: '18px'}}>{dateListened}</Td> */}
                  
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
};