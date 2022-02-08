import { QueryOptions } from 'mysql2/promise';

import {
    GET_BIKE_LIST_BY_MEMBERSHIP_SQL,
    GET_BIKE_LIST_SQL,
    GET_BIKE_SQL,
    INSERT_BIKE_SQL,
    PATCH_BIKE_SQL,
    DELETE_BIKE_SQL,
} from '../../../database/bike';
import {
    GET_MEMBER_LIST_SQL,
    GET_MEMBER_LIST_BY_TYPE_SQL,
    GET_MEMBER_SQL,
    INSERT_MEMBER_SQL,
    PATCH_MEMBER_SQL,
} from '../../../database/member';
import pool from '../../../database/pool';
import * as bikeHelpers from './mockHelpers/bike';
import * as memberHelpers from './mockHelpers/member';

const mockQuery = jest.spyOn(pool, 'query').mockImplementation((sql: QueryOptions, values: any): Promise<any> => {
    switch (String(sql)) {
        case INSERT_BIKE_SQL:
            return bikeHelpers.insertBikeResponse(values[0]);
        case GET_BIKE_LIST_BY_MEMBERSHIP_SQL:
        case GET_BIKE_LIST_SQL:
            return bikeHelpers.getBikeListResponse(values);
        case GET_BIKE_SQL:
            return bikeHelpers.getBikeResponse(values[0]);
        case PATCH_BIKE_SQL:
            return bikeHelpers.patchBikeResponse(values[0]);
        case DELETE_BIKE_SQL:
            return bikeHelpers.deleteBikeResponse(values[0]);
        case INSERT_MEMBER_SQL:
            return memberHelpers.insertMemberResponse(values[0]);
        case GET_MEMBER_LIST_BY_TYPE_SQL:
        case GET_MEMBER_LIST_SQL:
            return memberHelpers.getMemberListResponse(values);
        case GET_MEMBER_SQL:
            return memberHelpers.getMemberResponse(values[0]);
        case PATCH_MEMBER_SQL:
            return memberHelpers.patchMemberResponse(values[0]);
        default:
            return Promise.resolve();
    }
});

export default mockQuery;