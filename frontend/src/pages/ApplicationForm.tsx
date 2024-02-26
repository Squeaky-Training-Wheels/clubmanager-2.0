/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Button, ChakraProvider, Grid, GridItem, Image, Input, SimpleGrid, Text } from '@chakra-ui/react';
import Autocomplete from 'react-google-autocomplete';
import DatePicker from 'react-date-picker';

import theme from '../theme';

function ApplicationForm() {
    const [season, setSeason] = useState<number>();

    const [firstName, setFirstName] = useState<string>();
    const [streetAddress, setStreetAddress] = useState<string>();
    const [zipCode, setZipCode] = useState<string>();
    const [city, setCity] = useState<string>();
    const [state, setState] = useState<string>();
    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [occupation, setOccupation] = useState<string>();
    const [referredBy, setReferredBy] = useState<string>();

    useEffect(() => {
        const date = new Date();
        const month = date.getMonth();
        if (month >= 2) {
            setSeason(date.getFullYear() + 1);
        } else {
            setSeason(date.getFullYear());
        }
    });
    return (
        <ChakraProvider theme={theme}>
            <Box mt={0} pt={0} borderWidth="5 px" width="90%">
                <SimpleGrid columns={2} maxWidth={800}>
                    <Image width={200} height={90} src="logo192.png" />
                    <Text fontSize="3xl">{`Palmyra Racing Association Application - ${season} season`}</Text>
                </SimpleGrid>
                <Box paddingBottom={5}>
                    <Text>
                        Please complete all sections. Note that when your application is accepted we will need payment,
                        waiver of liability, minor waivers, and health insurance information. We do not need any of
                        that at the time of application. The current year dues are $575 (subject to change).
                    </Text>
                </Box>
                <Box paddingBottom={5}>
                    <Text>
                        For ease of processing, we are only accepting applications online. If you need a paper
                        application, please contact us.
                    </Text>
                </Box>
                <Grid templateColumns="repeat(2, 1fr)" ml={10}>
                    <GridItem>
                        <Text>First Name</Text>
                        <Input />
                    </GridItem>
                    <GridItem ml={5}>
                        <Text>Last Name</Text>
                        <Input />
                    </GridItem>
                    <GridItem colSpan={2}>
                        <Text>Street Address</Text>
                        <Autocomplete
                            style={
                                {
                                    width: '50%',
                                    font: 'Russo One',
                                    padding: '12px 20px',
                                    margin: '8px 0;',
                                    display: 'inline-block',
                                    border: '1px solid #ccc',
                                }
                            }
                            apiKey="AIzaSyA8N7kdBhP-1M3Y393FNDL71-nWanO9lBI"
                            options={
                                {
                                    types: ['address'],
                                    componentRestrictions: { country: 'us' },
                                }
                            }
                            onPlaceSelected={
                                (place) => {
                                    let mapsStreetAddress = '';
                                    let mapsZipCode = '';
                                    place.address_components.forEach((component: any) => {
                                        const attributeShort = component.short_name;
                                        const attributeLong = component.long_name;
                                        const attributeType = component.types[0];
                                        switch (attributeType) {
                                            case 'street_number':
                                                mapsStreetAddress = attributeShort;
                                                break;
                                            case 'route':
                                                mapsStreetAddress = `${mapsStreetAddress} ${attributeLong}`;
                                                break;
                                            case 'locality':
                                                setCity(attributeShort);
                                                break;
                                            case 'administrative_area_level_1':
                                                setState(attributeShort);
                                                break;
                                            case 'postal_code':
                                                mapsZipCode = attributeShort;
                                                break;
                                            case 'postal_code_suffix':
                                                mapsZipCode = `${mapsZipCode}-${attributeShort}`;
                                                break;
                                            default:
                                                break;
                                        }
                                    });
                                    setStreetAddress(mapsStreetAddress);
                                    setZipCode(mapsZipCode);
                                }
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <Text>Phone</Text>
                        <Input />
                    </GridItem>
                    <GridItem>
                        <Text>eMail</Text>
                        <Input />
                    </GridItem>
                    <GridItem>
                        <Text>Date of Birth</Text>
                        <DatePicker />
                    </GridItem>
                    <GridItem>
                        <Text>Occupation</Text>
                        <Input />
                    </GridItem>
                    <GridItem>
                        <Text>Referred By</Text>
                        <Input />
                    </GridItem>
                </Grid>
                <Button />
            </Box>
        </ChakraProvider>
    );
}

export default ApplicationForm;