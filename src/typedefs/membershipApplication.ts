export type MembershipApplication = {
    id: number,
    status: string,
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    state: string,
    zip: string,
    email: string,
    phone: string,
    occupation: string,
    googleLink: string,
    receivedDate: Date,
    birthDate: string,
    recommendedBy: string,
    familyMember0FirstName?: string,
    familyMember0LastName?: string,
    familyMember0Age?: number,
    familyMember1FirstName?: string,
    familyMember1LastName?: string,
    familyMember1Age?: number,
    familyMember2FirstName?: string,
    familyMember2LastName?: string,
    familyMember2Age?: number,
    familyMember3FirstName?: string,
    familyMember3LastName?: string,
    familyMember3Age?: number,
    familyMember4FirstName?: string,
    familyMember4LastName?: string,
    familyMember4Age?: number,
    familyMember5FirstName?: string,
    familyMember5LastName?: string,
    familyMember5Age?: number,
    internalNotes?: string,
    sharedNotes?: string,
    applicationPriority?: number,
}
