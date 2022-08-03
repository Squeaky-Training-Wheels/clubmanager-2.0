import AWS from 'aws-sdk';
import logger from '../logger';

/**
 * Create a new user in Cognito to allow them to login.
 *
 * @param email user email address.
 * @returns the user UUID in cognito.
 */
export async function createCognitoUser(email: string) {
    AWS.config.update({ region: 'us-east-1' });
    const poolId = process.env.COGNITO_POOL_ID || '';
    const cognitoIdp = new AWS.CognitoIdentityServiceProvider();
    const createResponse = await cognitoIdp.adminCreateUser({
        UserPoolId: poolId,
        Username: email,
    }).promise();
    logger.info(JSON.stringify(createResponse));
    const uuid = createResponse.User?.Username;
    if (uuid) {
        try {
            const groupResponse = await cognitoIdp.adminAddUserToGroup({
                UserPoolId: poolId,
                GroupName: 'member',
                Username: uuid,
            }).promise();
            logger.info(`User ${email} added to group member`);
            logger.debug(JSON.stringify(groupResponse));
        } catch (error) {
            logger.error(`Unable to add ${email} to group member.  User still exist, login may not work correctly`);
            logger.error(error);
            throw error;
        }
    }
    return uuid;
}

export async function deleteCognitoUser(uuid: string) {
    logger.info('delete function coming soon!');
}