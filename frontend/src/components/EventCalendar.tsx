/* eslint-disable import/no-duplicates */
import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { Text, Flex, Spacer } from '@chakra-ui/react';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import Event from '../../../src/typedefs/event';

const Toolbar = require('react-big-calendar/lib/Toolbar');

interface EventCalendarProps {
    // This <any> will be replaced with our own Event Typedef, once it has all the attributes we need here
    // events: Event[],
    events: any[],
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { 'en-US': enUS },
});

function EventCalendar(props: EventCalendarProps) {
    return (
        <Calendar
            defaultView="month"
            events={props.events}
            // eslint-disable-next-line no-console
            onSelectEvent={(event) => console.log(event)} // to assist with modal development
            localizer={localizer}
            eventPropGetter={
                (event) => {
                    const newStyle = {
                        backgroundColor: 'lightgrey',
                        color: 'black',
                    };
                    if (event.type === 'Meeting') {
                        newStyle.backgroundColor = '#76CE6F';
                    } else if (event.type === 'Work') {
                        newStyle.backgroundColor = '#68A4FF';
                    } else if (event.type === 'Race') {
                        newStyle.backgroundColor = '#EE6439';
                    } else {
                        newStyle.backgroundColor = 'lightgrey';
                    }
                    return {
                        style: newStyle,
                    };
                }
            }
            style={{ height: '70vh' }}
            components={
                {
                    // eslint-disable-next-line no-shadow
                    toolbar: ({ localizer, ...props }, children) => (
                        <Toolbar
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...props}
                            localizer={
                                {
                                    messages: {
                                        ...localizer.messages,
                                    },
                                }
                            }
                            label={
                                (
                                    <Flex pl={20}>
                                        <Spacer />
                                        <Text
                                            fontFamily="sans-serif"
                                            fontWeight={30}
                                            fontSize="3xl"
                                        >
                                            {/* eslint-disable-next-line react/prop-types */}
                                            {props.label}
                                        </Text>
                                        <Spacer />
                                    </Flex>
                                )
                            }
                        >
                            {children}
                        </Toolbar>
                    ),
                }
            }
        />
    );
}

export default EventCalendar;