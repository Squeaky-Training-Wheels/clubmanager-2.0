import { format } from 'date-fns';
import { Request, Response, Router } from 'express';
import { deleteEvent, getEvent, getEventList, insertEvent, patchEvent } from '../database/event';
import {
    DeleteEventResponse,
    Event,
    GetEventListResponse,
    GetEventResponse,
    PatchEventResponse,
    PostNewEventResponse,
} from '../typedefs/event';
import { checkHeader, verify } from '../util/auth';

const event = Router();
event.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

event.post('/new', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PostNewEventResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token, 'Admin');
            const insertId = await insertEvent(req.body);
            response = await getEvent(insertId);
            res.status(201);
        } catch (e: any) {
            if (e.message === 'user input error') {
                res.status(400);
                response = { reason: 'bad request' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'Forbidden') {
                res.status(403);
                response = { reason: 'forbidden' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

event.get('/list', async (req: Request, res: Response) => {
    console.log('over here');
    const { authorization } = req.headers;
    let response: GetEventListResponse;
    const headerCheck = checkHeader(authorization);
    const verifyDate = (dateString: string) => {
        let valid = true;
        if (dateString === '') {
            valid = true;
        }
        const year = Number(dateString.slice(0, 4));
        const month = Number(dateString.slice(4, 6));
        const day = Number(dateString.slice(6, 8));
        console.log({ year, month, day });
        if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
            valid = false;
        }
        return { valid, date: new Date(year, month - 1, day) };
    };
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { range } = req.headers;
            console.log(range);
            let eventList: Event[];
            if (typeof range === 'undefined') {
                eventList = await getEventList();
                res.status(200);
            } else {
                const [start, end] = range.split('-');
                if (start === undefined || end === undefined) {
                    throw new Error('user input error');
                }
                const startData = verifyDate(start);
                const endData = verifyDate(end);
                if (!startData.valid || !endData.valid) {
                    throw new Error('user input error');
                } else {
                    if (start === '' && end !== '') {
                        eventList = await getEventList(
                            undefined,
                            `${format(endData.date, 'yyyy-MM-dd')}`,
                        );
                    } else if (end === '' && start !== '') {
                        eventList = await getEventList(`${format(startData.date, 'yyyy-MM-dd')}`);
                    } else {
                        eventList = await getEventList(
                            `${format(startData.date, 'yyyy-MM-dd')}`,
                            `${format(endData.date, 'yyyy-MM-dd')}`,
                        );
                    }
                    res.status(206);
                }
            }
            response = eventList;
        } catch (e: any) {
            if (e.message === 'user input error') {
                res.status(400);
                response = { reason: 'bad request' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

event.get('/:eventID', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetEventResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { eventID } = req.params;
            const id = Number(eventID);
            if (Number.isNaN(id)) {
                throw new Error('not found');
            }
            response = await getEvent(id);
            res.status(200);
        } catch (e: any) {
            if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

event.patch('/:eventID', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PatchEventResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            const { eventID } = req.params;
            const id = Number(eventID);
            if (Number.isNaN(id)) {
                throw new Error('not found');
            }
            await verify(headerCheck.token, 'Admin');
            await patchEvent(id, req.body);
            response = await getEvent(id);
            res.status(200);
        } catch (e: any) {
            if (e.message === 'user input error') {
                res.status(400);
                response = { reason: 'bad request' };
            } else if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'Forbidden') {
                res.status(403);
                response = { reason: 'forbidden' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

event.delete('/:eventID', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: DeleteEventResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            const { eventID } = req.params;
            const id = Number(eventID);
            if (Number.isNaN(id)) {
                throw new Error('not found');
            }
            await verify(headerCheck.token, 'Admin');
            await deleteEvent(id);
            response = { eventId: id };
            res.status(200);
        } catch (e: any) {
            if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'Forbidden') {
                res.status(403);
                response = { reason: 'forbidden' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

export default event;
