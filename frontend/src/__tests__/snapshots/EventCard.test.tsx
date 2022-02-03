import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import EventCard from '../../components/EventCard';
import '@testing-library/jest-dom/extend-expect';

it('renders all props correctly', () => {
    const header = renderer.create(
        <BrowserRouter>
            <EventCard date="Dec 19th" startTime="12:00pm" endTime="5:00pm" desc="pick rocks, kid" />
        </BrowserRouter>,
    ).toJSON();
    expect(header).toMatchSnapshot();
});
