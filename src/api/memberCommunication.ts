import { Request, Response, Router } from 'express';
import AWS from 'aws-sdk';
import {
    getMemberCommunicationById, getMemberCommunications, insertMemberCommunication,
} from '../database/memberCommunication';
import { validateAdminAccess } from '../util/auth';
import logger from '../logger';
import { getMembersWithTag } from '../database/member';
import { MemberCommunication } from '../typedefs/memberCommunication';

const memberCommunication = Router();

memberCommunication.get('/', async (req: Request, res: Response) => {
    try {
        await validateAdminAccess(req, res);
        const allCommunications = await getMemberCommunications();
        res.send(allCommunications);
    } catch (error: any) {
        logger.error(`Error at path ${req.path}`);
        logger.error(error);
        res.status(500);
    }
});

memberCommunication.get('/:communicationId', async (req: Request, res: Response) => {
    try {
        await validateAdminAccess(req, res);
        const id = Number(req.params.communicationId);
        const singleCommunication = await getMemberCommunicationById(id);
        res.send(singleCommunication);
    } catch (error: any) {
        logger.error(`Error at path ${req.path}`);
        logger.error(error);
        res.status(500);
    }
});

memberCommunication.post('/', async (req: Request, res: Response) => {
    try {
        await validateAdminAccess(req, res);
        const communication : MemberCommunication = req.body;
        // use the base object type as a hashmap with any keys you want in there.
        // learned this trick ages ago.
        const uniqueRecipients : any = {};
        // I want array iteration here because I want things to be in order.
        // eslint-disable-next-line no-restricted-syntax
        for (const tag of communication.selectedTags) {
            // this is on purpose too
            // eslint-disable-next-line no-await-in-loop
            const membersWithTags = await getMembersWithTag(tag);
            membersWithTags.forEach((member) => {
                uniqueRecipients[member.memberId] = (member.memberId, member);
            });
        }
        communication.members = [];
        const uniqueRecipientIds = Object.keys(uniqueRecipients);
        uniqueRecipientIds.forEach((id: any) => {
            const memberRecord = uniqueRecipients[id];
            const paredDownRecord = {
                firstName: memberRecord.firstName,
                lastName: memberRecord.lastName,
                email: memberRecord.email,
                phone: memberRecord.phoneNumber,
            };
            communication.members?.push(paredDownRecord);
        });
        const response = await insertMemberCommunication(communication);
        // now stick the message in the respctive SQS queue for further processing, but not here.
        const outboundQueueName = `trackboss-queue-${communication.mechanism}`;
        AWS.config.update({ region: process.env.AWS_REGION });
        const sqs = new AWS.SQS();
        try {
            logger.info(`sending communication id ${response.memberCommunicationId} to outbound queue`);
            const sqsParams = {
                MessageBody: JSON.stringify(response),
                QueueUrl: `${process.env.SQS_URL}/${outboundQueueName}`,
            };
            const snsResponse = await sqs.sendMessage(sqsParams).promise();
            logger.info(`communication ${response.memberCommunicationId} sent to queue.  Id: ${snsResponse.MessageId}`);
        } catch (error) {
            logger.info(`queue send failed for communication ${response.memberCommunicationId} due to `, error);
            logger.info(`The message with subject ${response.subject} will not be delivered.`);
        }
        res.json(response);
    } catch (error: any) {
        logger.error(`Error at path ${req.path}`);
        logger.error(error);
        res.status(500);
    }
});

export default memberCommunication;
