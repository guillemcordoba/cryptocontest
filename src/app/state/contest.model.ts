import { CryptoValue } from '../web3/transaction.model';

export enum ContestPhase {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  REVISION = 'REVISION',
  ENDED = 'ENDED'
}

export const PhasesList = [ContestPhase.UPCOMING, ContestPhase.ONGOING, ContestPhase.REVISION, ContestPhase.ENDED];

export interface Hashable<T> {
  hash: string;
  content?: T;
}

export interface Contest {
  id: string;
  title: string;
  additionalContent: Hashable<{ description: string; image: Buffer }>;
  prize: CryptoValue;
  createdDate: number;
  initialDate: number;
  participationLimitDate: number;
  endDate: number;
  tags: string[];
  options: {
    limitParticipations: number; // 0 means no limit
  };
}

export interface Participation {
  title: string;
  creator: string;
  date: number;
  content: Hashable<any>;
  votes: number;
}

export function getContestPhase(contest: Contest): ContestPhase {
  if (Date.now() < contest.initialDate) return ContestPhase.UPCOMING;
  else if (Date.now() >= contest.initialDate && Date.now() < contest.participationLimitDate) {
    return ContestPhase.ONGOING;
  } else if (Date.now() >= contest.participationLimitDate && Date.now() < contest.endDate) {
    return ContestPhase.REVISION;
  } else return ContestPhase.ENDED;
}