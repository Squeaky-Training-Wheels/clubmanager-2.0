import { ErrorResponse } from './errorResponse';

export type Event = {
    eventId: number,
    date: string,
    eventType: string,
    eventName: string,
    eventDescription: string
}

export type DeletedEvent = {
    eventId: number
}

export type PostNewEventRequest = {
    date?: string,
    eventTypeId: number,
    eventName?: string,
    eventDescription?: string
}

export type PostNewEventResponse = Event | ErrorResponse

export type GetEventRequest = {}

export type GetEventResponse = Event | ErrorResponse

export type PatchEventRequest = {
    date?: string,
    eventTypeId?: number,
    eventName?: string,
    eventDescription?: string
}

export type PatchEventResponse = Event | ErrorResponse

export type DeleteEventRequest = {}

export type DeleteEventResponse = DeletedEvent | ErrorResponse

export type GetEventListRequest = {}

export type GetEventListResponse = Event[] | ErrorResponse