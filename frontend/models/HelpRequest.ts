import { Action, Part } from "./MaintenanceItem";
import { blankUser, User } from "./User";

export enum NeedType {
  QUESTION = "I have a question",
  DOUBLE_CHECK = "Double check my work",
  WATCH_ME = "Watch me do it",
  TEACH_ME = "Teach me how to do it",
};

export enum MechanicQualification {
  PROFESSIONAL = "Professional",
  AVID_AMATURE = "Avid Amateur",
  NOVICE = "Novice",
  NEWBIE = "Newbie",
};

export interface HelpRequest {
  id: number;
  user: User;
  comments: HelpComment[];
  part: string;
  action: string;
  needType: NeedType;
  description: string;
  resolved: boolean;
  createdOn: Date;
}

export interface HelpComment {
  id: number;
  user: User;
  votes: HelpCommentVote[];
  comment: string;
}

export interface HelpCommentVote {
  id: number;
  helpComment: HelpComment;
  user: User;
  flag: boolean;
  up: boolean;
}

export interface HelpOffer {
  id: number;
  helpRequest: HelpRequest;
  user: User;
  qualification: MechanicQualification;
}

export const newHelpRequest = () => {
  return {
    id: 0,
    user: blankUser(),
    part: "Chain",
    action: "Check",
    description: "",
    needType: NeedType.QUESTION,
    comments: [],
    resolved: false,
    createdOn: new Date(),
  };
}
