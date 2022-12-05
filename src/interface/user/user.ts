import { Device } from '@/interface/layout/index.interface';
import { MenuChild } from '@/interface/layout/menu.interface';
import { Moment } from 'moment';
import { Role } from './login';

export type Locale = 'zh_CN' | 'en_US';

export interface UserState {
  id?: number;
  username: string;

  /** menu list for init tagsView */
  menuList: MenuChild[];

  /** login status */
  logged: boolean;

  role: Role;

  /** user's device */
  device: Device;

  /** menu collapsed status */
  collapsed: boolean;

  /** notification count */
  noticeCount: number;

  /** user's language */
  locale: Locale;

  /** Is first time to view the site ? */
  newUser: boolean;

  userList: {
    data: IUser[];

    totalUser: number;

    status: 'init' | 'loading' | 'success' | 'error';

    error?: any;
  };

  roleList: {
    data: IUserRole[];

    status: 'init' | 'loading' | 'success' | 'error';

    error?: any;
  };
}

export interface IUser {
  id?: number;
  username: string;
  password?: string;
  email: string;
  fullname: string;
  phoneNumber: string;
  dateOfBirth: string | Moment;
  avatarUrl: string;
  createdBy?: number;
  createdAt?: string;
  upDatedAt?: string;
}

export interface IUserRole {
  id: number;
  functionName: string;
  isDisplay: boolean;
  isActive: boolean;
  parentID: number;
  createdBy: number;
  createdAt: string;
  upDatedAt: string;
  isGrant: boolean;
  isInsert: boolean;
  isUpdate: boolean;
  isDelete: boolean;
}
export interface IRole {
  userID: number;
  functionID: number;
  functions: IUserRole[];
  user: IUser;
}
