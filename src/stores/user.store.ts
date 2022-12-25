import { createSlice, PayloadAction, createAsyncThunk, CaseReducer } from '@reduxjs/toolkit';
import { apiLogin, getAllRoles, getAllUser, getUserRole as getMyRole } from '@/api/user.api';
import { LoginParams } from '@/interface/user/login';
import { IUser, Locale, UserState } from '@/interface/user/user';
import { getGlobalState } from '@/utils/getGloabal';

const KEY_ACCESS_TOKEN = 'accessToken';
const KEY_REFRESH_TOKEN = 'refreshToken';

const initialState: UserState = {
  ...getGlobalState(),
  noticeCount: 0,
  id: Number(localStorage.getItem('uid')) || 1,
  locale: (localStorage.getItem('locale')! || 'en_US') as Locale,
  newUser: JSON.parse(localStorage.getItem('newUser')!) ?? true,
  logged: localStorage.getItem(KEY_ACCESS_TOKEN) ? true : false,
  menuList: [],
  username: localStorage.getItem('username') || '',
  role: {
    data: [],
    status: 'init',
  },
  userList: {
    data: [],
    totalUser: 0,
    status: 'init',
  },
  roleList: {
    data: [],
    status: 'init',
  },
  isChangingPassword: false,
};

const getUserRole = createAsyncThunk('user/my-role', async () => {
  const [data, error] = (await getMyRole()) as any;

  if (error) {
    return [undefined, error];
  }

  return [data, undefined];
});

const getRolesList = createAsyncThunk('user/getRolesList', async () => {
  const [data, error] = (await getAllRoles()) as any;

  if (error) {
    return [undefined, error];
  }

  return [data, undefined];
});

const login = createAsyncThunk('user/login', async (payload: LoginParams, { dispatch }) => {
  const [response, error] = (await apiLogin({ username: payload.username, password: payload.password })) as any;

  if (error || response?.data.status > 399) {
    return [undefined, error || response.data];
  }

  localStorage.setItem(KEY_ACCESS_TOKEN, response.data.accessToken);
  localStorage.setItem(KEY_REFRESH_TOKEN, response.data.refreshToken);

  if (response.data) {
    localStorage.setItem('uid', response.data.user.userId);
    localStorage.setItem('username', response.data.user.username);
    dispatch(getRolesList());
    dispatch(getUserRole());

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

const getUserList = createAsyncThunk('user/getUserList', async (params?: object) => {
  const [response, error] = (await getAllUser(params)) as any;

  if (error) {
    return [undefined, error];
  }

  return [response, undefined];
});

const _logout: CaseReducer<UserState> = state => {
  state.username = '';
  state.id = undefined;
  state.logged = false;
  state.role = {
    data: [],
    status: 'init',
  };
  state.userList = {
    data: [],
    totalUser: 0,
    status: 'init',
  };
  state.roleList = {
    data: [],
    status: 'init',
  };
  localStorage.clear();
};

const _setPasswordModalVisibility: CaseReducer<UserState, PayloadAction<boolean>> = (state, actions) => {
  state.isChangingPassword = actions.payload;
};

const _setUserFetchingStatus: CaseReducer<UserState, PayloadAction<'init' | 'loading' | 'success' | 'error'>> = (
  state,
  action,
) => {
  state.userList.status = action.payload;
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
    setUserFetchingStatus: _setUserFetchingStatus,
    setPasswordModalVisibility: _setPasswordModalVisibility,
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

    builder.addCase(getRolesList.pending, state => {
      state.roleList.status = 'loading';
      state.roleList.error = undefined;
    });

    builder.addCase(getRolesList.fulfilled, (state, action) => {
      const [roles, error] = action.payload;

      if (error) {
        state.roleList.status = 'error';
        state.roleList.error = error;
        state.roleList.data = [];

        return;
      }

      state.roleList.data = roles;
      state.roleList.status = 'success';
    });

    builder.addCase(getUserRole.pending, state => {
      state.role.status = 'loading';
      state.role.error = undefined;
    });

    builder.addCase(getUserRole.fulfilled, (state, action) => {
      const [roles, error] = action.payload;

      if (error) {
        state.role.status = 'error';
        state.role.error = error;
        state.role.data = [];

        return;
      }

      state.role.data = roles.roles;
      state.role.status = 'success';
    });
  },
});

export const { setUserItem, logout, setUserFetchingStatus, setPasswordModalVisibility } = userSlice.actions;
export const userAsyncActions = { login, getUserList, getRolesList, getUserRole };

export default userSlice.reducer;
