import React from 'react';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect';
import SelectedEventModal from '../../components/SelectedEventModal';

function onViewEventClose() {
    // a void function
}

function onSignUpOpen() {
    // a void function
}

const selectedEvent = {
    eventId: 0,
    date: '2022-02-07',
    eventType: 'string',
    eventName: 'Work Day',
    eventDescription: 'string',
};

describe('selected event modal', () => {
    it('renders all props correctly as admin', () => {
        const modal = renderer.create(
            <SelectedEventModal
                isOpen
                onClose={onViewEventClose}
                selectedEvent={selectedEvent}
                onSignUpOpen={onSignUpOpen}
                admin
            />,
        ).toJSON();
        expect(modal).toMatchSnapshot();
    });

    it('renders all props correctly as not admin', () => {
        const modal = renderer.create(
            <SelectedEventModal
                isOpen
                onClose={onViewEventClose}
                selectedEvent={selectedEvent}
                onSignUpOpen={onSignUpOpen}
                admin={false}
            />,
        ).toJSON();
        expect(modal).toMatchSnapshot();
    });
});