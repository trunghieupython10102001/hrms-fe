import { IUserRole } from '@/interface/user/user';

export function userHasRole(roleID: number, roleList: IUserRole[]) {
  return roleList.find(role => role.functionID === roleID);
}

export function isNotHasAnyRole(roleList: IUserRole[]) {
  let isNotHasAnyRole = roleList.length === 0;

  if (isNotHasAnyRole) {
    return true;
  }

  roleList.forEach(role => {
    if (!isNotHasAnyRole) {
      return;
    }
    isNotHasAnyRole = !role.isGrant || !role.isDelete || !role.isInsert || !role.isUpdate;
  });

  return isNotHasAnyRole;
}
