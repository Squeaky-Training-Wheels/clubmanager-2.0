import React from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import MemberList from '../components/MemberList';

function MemberListPage() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Members" activeButtonId={3} />
            <Box pt="3em">
                <MemberList />
            </Box>
        </ChakraProvider>
    );
}

export default MemberListPage;