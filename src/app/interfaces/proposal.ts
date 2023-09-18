export interface Proposal {
  // Taken from json
  postedData: string;
  title: string;
  description: string;
  image: string | ArrayBuffer;
  startTimeStamp: string;
  endTimeStamp: string;
  votingOptions: string[];
  // Taken from blockchain
  proposalURI?: string;
  proposalId?: number;
  votes?: string[];
  result?: string;
  // User info on form
  email?: string;
  proposer?: string;
}
