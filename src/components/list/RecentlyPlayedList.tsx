'use client';
import React, { useState } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
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
  Box
} from '@chakra-ui/react';

export const RecentlyPlayedList = ({ recentlyPlayed }) => {

  console.log(recentlyPlayed)

  return (
    <>
      <TableContainer whiteSpace='wrap' height='100vh' overflowY='auto'>
        <Table variant='striped' colorScheme='alternatePurple'>
          <TableCaption placement='top'>Recently Played</TableCaption>
          <Thead>
            <Tr>
              <Th fontSize={{base: '16', md: '18'}}>#</Th>
              <Th fontSize={{base: '16', md: '18'}}>Song</Th>
              <Th fontSize={{base: '16', md: '18'}}>Image</Th>
            </Tr>
          </Thead>
          <Tbody overflowY='auto'>
            {recentlyPlayed.map((item, i) => (
              <Tr key={item.name} h='10%' w='100%'>
                <Td fontSize={{base: '16', md: '18'}}>{i + 1}</Td>
                <Td fontSize={{base: '16', md: '18'}}><Link href={item.track.external_urls?.spotify} target='_blank'>{item.track.name}</Link></Td>
                <Td>
                  <Image 
                    src={item.track.album.images[0].url} 
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
              <Th fontSize={{base: '16', md: '18'}}>Song</Th>
              <Th fontSize={{base: '16', md: '18'}}>Image</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  )
};