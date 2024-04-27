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
import useSpotifyAPI from '@/api/spotify';

export const TopItemsList = ({ itemType, items, additionalItems }) => {

  console.log(items)

  return (
    <>
      <TableContainer whiteSpace='wrap'>
        <Table variant='striped' colorScheme='teal'>
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
              <Tr key={item.name} h='10%' w='100%'>
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

            {additionalItems && additionalItems.map((item, i) => (
              <Tr key={item.name} h='10%' w='100%'>
                <Td fontSize={{base: '16', md: '18'}}>{i + 21}</Td>
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