export enum ROLES_ID {
  USER_MANAGEMENT = 7,
  ENTERPRISE_MANAGEMENT = 10,
  CATEGORIES_MANAGEMENT = 12,
  CONTACT_LOG_MANAGEMENT = 13,
  ENTERPRISE_PRODUCT_MANAGEMENT = 14,
}

export const ROLE_CHILD_PARENT = {
  [ROLES_ID.CONTACT_LOG_MANAGEMENT]: ROLES_ID.ENTERPRISE_MANAGEMENT,
  [ROLES_ID.ENTERPRISE_PRODUCT_MANAGEMENT]: ROLES_ID.ENTERPRISE_MANAGEMENT,
};
