import { createSlice, PayloadAction, createAsyncThunk, CaseReducer } from '@reduxjs/toolkit';
import { apiLogin, getAllRoles, getAllUser } from '@/api/user.api';
import { LoginParams, Role } from '@/interface/user/login';
import { IUser, Locale, UserState } from '@/interface/user/user';
import { getGlobalState } from '@/utils/getGloabal';

const KEY_ACCESS_TOKEN = 'accessToken';

const initialState: UserState = {
  ...getGlobalState(),
  noticeCount: 0,
  id: Number(localStorage.getItem('uid')) || 1,
  locale: (localStorage.getItem('locale')! || 'en_US') as Locale,
  newUser: JSON.parse(localStorage.getItem('newUser')!) ?? true,
  logged: localStorage.getItem(KEY_ACCESS_TOKEN) ? true : false,
  menuList: [],
  username: localStorage.getItem('username') || '',
  role: (localStorage.getItem('username') || '') as Role,
  userList: {
    data: [],
    totalUser: 0,
    status: 'init',
  },
  roleList: [],
};

const login = createAsyncThunk('user/login', async (payload: LoginParams) => {
  const [response, error] = (await apiLogin({ username: payload.username, password: payload.password })) as any;

  if (error) {
    return [undefined, error];
  }

  if (payload.remember) {
    localStorage.setItem(KEY_ACCESS_TOKEN, response.data.accessToken);
  }

  if (response.data) {
    localStorage.setItem('uid', response.data.user.userId);
    localStorage.setItem('username', response.data.user.username);

    return [
      {
        username: response.data.user.username,
        id: response.data.user.userId,
      },
      undefined,
    ];
  }

  return [undefined, error];
});

const getUserList = createAsyncThunk('user/getUserList', async () => {
  const [response, error] = (await getAllUser()) as any;

  if (error) {
    return [undefined, error];
  }

  return [response, undefined];
});

const getRolesList = createAsyncThunk('user/getRolesList', async () => {
  const [data, error] = (await getAllRoles()) as any;

  if (error) {
    return [undefined, error];
  }

  return [data, undefined];
});

const _logout: CaseReducer<UserState> = state => {
  state.username = '';
  state.id = undefined;
  state.logged = false;
  localStorage.clear();
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserItem(state, action: PayloadAction<Partial<UserState>>) {
      const { username } = action.payload;

      if (username !== state.username) {
        localStorage.setItem('username', action.payload.username || '');
      }

      Object.assign(state, action.payload);
    },
    logout: _logout,
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      state.logged = true;
      const [userInfo, error] = action.payload as any;

      if (error) {
        return;
      }

      state.username = userInfo.username;
      state.id = userInfo.id;
    });

    builder.addCase(getUserList.pending, state => {
      state.userList.status = 'loading';
    });

    builder.addCase(getUserList.fulfilled, (state, action) => {
      const [users, error] = action.payload;

      if (error) {
        state.userList.status = 'error';

        return;
      }

      state.userList.data = users as IUser[];
      state.userList.totalUser = users?.length || 0;
      state.userList.status = 'success';
    });

    builder.addCase(getRolesList.fulfilled, (state, action) => {
      const [roles, error] = action.payload;

      if (error) {
        return;
      }

      state.roleList = roles;
    });
  },
});

export const { setUserItem, logout } = userSlice.actions;
export const userAsyncActions = { login, getUserList, getRolesList };

export default userSlice.reducer;
