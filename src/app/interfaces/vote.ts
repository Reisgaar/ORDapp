export interface Vote {
    user: string;
    proposalId: number;
    amount: BigInt;
    answer: number;
}