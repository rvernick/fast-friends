import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Part } from '../bike/part';
import { Action } from '../bike/action';

export enum NeedType {
  QUESTION = "I have a question",
  DOUBLE_CHECK = "Double check my work",
  WATCH_ME = "Watch me do it",
  TEACH_ME = "Teach me how to do it",
};

export const getNeedTypeFor = (value: string): NeedType | null => {
  const vals = Object.values(NeedType);
  const keys = Object.keys(NeedType)
  for (const checkKey in keys) {
    if (vals[checkKey] === value) {
      return NeedType[keys[checkKey]];
    }
  }
  return null;
}


export enum MechanicQualification {
  PROFESSIONAL = "Professional",
  AVID_AMATURE = "Avid Amateur",
  NOVICE = "Novice",
  NEWBIE = "Newbie",
};

@Entity()
export class HelpRequest {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, { nullable: false, cascade: false, eager: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany((type) => HelpComment, (comment) => comment.helpRequest, {
    eager: true,
    cascade: true,
  })
  comments: HelpComment[];

  @Column({
    type: "enum",
    enum: Part,
    default: Part.CHAIN,
    nullable: false,
  })
  part: Part;

  @Column({
    type: "enum",
    enum: Action,
    default: Action.REPLACE,
    nullable: false,
  })
  action: Action;

  @Column({
    type: 'enum',
    enum: NeedType,
    default: NeedType.QUESTION,
    nullable: false,
    name: 'need_type',
  })
  needType: NeedType;

  @Column({
    type: 'varchar',
    nullable: false,
    default: "",
  })
  description: string;

  @Column()
  resolved: boolean;

  @DeleteDateColumn({ nullable: true, name: 'deleted_on' })
  deletedOn: Date;

  @CreateDateColumn({ name: 'created_on' })
  createdOn: Date;

  @UpdateDateColumn({ name: 'updated_on'})
  updatedOn: Date;

}

@Entity()
export class HelpComment {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, { nullable: false, cascade: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne((type) => HelpRequest, { nullable: false, cascade: false, eager: false })
  @JoinColumn({ name: "help_request_id" })
  helpRequest: HelpRequest;

  @OneToMany((type) => HelpCommentVote, (commentVote) => commentVote.helpComment, {
    eager: true,
    cascade: true,
  })
  votes: HelpCommentVote[];

  @Column({
    type: 'varchar',
    nullable: false,
  })
  comment: string;
}

@Entity()
export class HelpCommentVote {
  constructor() {
  }
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => HelpComment, { nullable: false, cascade: false })
  @JoinColumn({ name: "help_comment_id" })
  helpComment: HelpComment;

  @ManyToOne(() => User, { nullable: false, cascade: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
  })
  flag: boolean;

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
  })
  up: boolean;
}

@Entity()
export class HelpOffer {
  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => HelpRequest, { nullable: false, cascade: false, eager: true })
  @JoinColumn({ name: "help_request_id" })
  helpRequest: HelpRequest;

  @ManyToOne(() => User, { nullable: false, cascade: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({
    type: "enum",
    enum: MechanicQualification,
    default: MechanicQualification.AVID_AMATURE,
    nullable: false,
  })
  qualification: MechanicQualification;
}

