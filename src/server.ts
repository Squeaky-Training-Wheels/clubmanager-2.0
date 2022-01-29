import express from 'express';
import api from './api/api';
import { getBike, insertBike } from './database/bike';
import logger from './logger';

const app = express();

const port = process.env.PORT || 8080;

app.use('/api', api);
const server = app.listen(port, () => {
    logger.info(`PRA Club Manager API listening on port ${port}`);
});
const fn = async () => {
    const req = {
        membershipId: 1,
    };
    const id = await insertBike(req);
    logger.info(`${JSON.stringify(await getBike(id))}`);
};

fn();

// export the HTTP server so that it can be closed if necessary (mostly for testing)
export default server;
