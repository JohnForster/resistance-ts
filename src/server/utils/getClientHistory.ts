import { last } from 'lodash';
import {
  ClientGameHistory,
  ClientMissionHistory,
  ClientNomination,
  CompletedMission,
  GameHistory,
  Nomination,
} from 'shared';
import { getUser } from '../models/user';

export const getClientHistory = (
  history: GameHistory,
  currentMissionNominations: Nomination[],
): ClientGameHistory => {
  const pastMissions = Object.entries(history)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([, mission]) => getMissionHistory(mission));

  const currentMission = {
    nominations: currentMissionNominations.map((nomination) =>
      getClientNomination(nomination),
    ),
  };

  return {
    pastMissions,
    currentMission,
  };
};

const getMissionHistory = (mission: CompletedMission): ClientMissionHistory => {
  const lastNomination = last(mission.nominations);
  const numSuccessVotes = mission.votes.filter((v) => v.succeed).length;
  const numFailVotes = mission.votes.filter((v) => !v.succeed).length;
  return {
    missionNumber: mission.missionNumber,
    team: mission.nominatedPlayerIds.map((id) => getUser(id).name),
    leader: getUser(lastNomination.leaderId).name,
    succeedFail: [numSuccessVotes, numFailVotes] as [number, number],
    succeeded: mission.success,
    nominations: mission.nominations.map((nom) => getClientNomination(nom)),
  };
};

const getClientNomination = (nomination: Nomination): ClientNomination => {
  const votes = Object.entries(nomination.votes) as [string, boolean][];
  const numApprovals = votes.filter(([, approve]) => approve).length;
  const numRejections = votes.filter(([, approve]) => !approve).length;
  return {
    leaderName: getUser(nomination.leaderId).name,
    nominatedPlayers: nomination.nominatedPlayerIds.map(
      (id) => getUser(id).name,
    ),
    votes: votes.map(([id, approved]) => ({
      playerName: getUser(id).name,
      approved,
    })),
    success: numApprovals > numRejections,
  };
};
