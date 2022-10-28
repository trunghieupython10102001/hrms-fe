/* 
@BusinessID int= 0,-- 
@BusinessName nvarchar(255)= '',--        Tên doanh nghiệp
@BusinessType smallint= 0,--        Loại công ty: 0: all; 1: Công ty xuất khẩu; 2: Công ty nhập khẩu
@BusinessEmail nvarchar(255)= '',--        
@BusinessPhone varchar(20)= '',--        
@Status smallint= 1,--        Status: -1: all; 0: unactive; 1: active 
@TotalRow BIGINT = 0 OUTPUT

*/

export interface BuniesssUser {
  key: string;
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  tags: string[];
}

export const EEnterpriseType = ['all', 'Công ty xuất khẩu', 'Công ty nhập khẩu'];
export const EEnterpriseStatus = ['unactive', 'active'];

export interface IEnterprise {
  id: number;
  name: string;
  type: 0 | 1 | 2;
  email: string;
  phone: string;
  status: -1 | 0 | 1;
}
