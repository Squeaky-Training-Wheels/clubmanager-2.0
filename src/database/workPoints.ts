import _ from 'lodash';
import { RowDataPacket } from 'mysql2';
import { WorkPoints } from 'src/typedefs/workPoints';
import logger from '../logger';
import { getPool } from './pool';

export const GET_WORK_POINTS_BY_MEMBER_SQL =
    'select total_points from v_work_points_by_member where member_id = ? and year = ?';
export const GET_WORK_POINTS_BY_MEMBERSHIP_SQL =
    'select total_points from v_work_points_by_membership where membership_id = ? and year = ?';

export async function getWorkPointsByMember(memberId: number, year: number): Promise<WorkPoints> {
    const values = [memberId, year];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(GET_WORK_POINTS_BY_MEMBER_SQL, values);
    } catch (e) {
        logger.error(`DB error getting work points for member: ${e}`);
        throw new Error('internal server error');
    }
    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        total: results[0].total_points,
    };
}

export async function getWorkPointsByMembership(membershipId: number, year: number): Promise<WorkPoints> {
    const values = [membershipId, year];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(GET_WORK_POINTS_BY_MEMBERSHIP_SQL, values);
    } catch (e) {
        logger.error(`DB error getting work points for membership: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        total: results[0].total_points,
    };
}
