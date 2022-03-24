import { generateHeaders } from './utils';
import {
    GetBillListResponse,
    GetMembershipBillListResponse,
    GetWorkPointThresholdResponse,
    PostCalculateBillsResponse,
    PostPayBillResponse,
    WorkPointThreshold,
} from '../../../src/typedefs/bill';
import { ErrorResponse } from '../../../src/typedefs/errorResponse';

function isThreshold(res: WorkPointThreshold | ErrorResponse): res is WorkPointThreshold {
    return (res as WorkPointThreshold) !== undefined;
}

export async function getYearlyThreshold(token: string): Promise<GetWorkPointThresholdResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing/yearlyWorkPointThreshold`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getYearlyThresholdValue(token: string) {
    const threshold = await getYearlyThreshold(token);
    if (isThreshold(threshold)) {
        return threshold.threshold;
    }
    // else
    return undefined;
}

export async function getBills(token: string): Promise<GetBillListResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing/list`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getBillsForMembership(
    token: string,
    membershipID: number,
): Promise<GetMembershipBillListResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing/${membershipID}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function generateBills(token: string): Promise<PostCalculateBillsResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function payBill(token: string, membershipID: number): Promise<PostPayBillResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing/${membershipID}`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
