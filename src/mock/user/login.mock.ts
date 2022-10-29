import { mock } from '../config';

mock.mock('/user/login', 'post', () => {
  // const body: LoginResult = JSON.parse(config?.body);
  // return intercepter<LoginResult>({
  //   token: '123abcdefg',
  //   username: body?.username,
  //   role: body?.username as Role,
  // });
});
