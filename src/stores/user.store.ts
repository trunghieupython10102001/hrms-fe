import { createSlice, PayloadAction, Dispatch, createAsyncThunk } from '@reduxjs/toolkit';
import { apiLogin, apiLogout } from '@/api/user.api';
import { LoginParams, Role } from '@/interface/user/login';
import { Locale, UserState } from '@/interface/user/user';
import { getGlobalState } from '@/utils/getGloabal';

const KEY_ACCESS_TOKEN = 'accessToken';

const initialState: UserState = {
  ...getGlobalState(),
  noticeCount: 0,
  locale: (localStorage.getItem('locale')! || 'en_US') as Locale,
  newUser: JSON.parse(localStorage.getItem('newUser')!) ?? true,
  logged: localStorage.getItem(KEY_ACCESS_TOKEN) ? true : false,
  menuList: [],
  username: localStorage.getItem('username') || '',
  role: (localStorage.getItem('username') || '') as Role,
};

const login = createAsyncThunk('user/login', async (payload: LoginParams) => {
  const { result } = await apiLogin({ username: payload.username, password: payload.password });

  if (payload.remember) {
    localStorage.setItem(KEY_ACCESS_TOKEN, result.token);
  }

  return {
    username: result.username,
  };
});

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
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, state => {
      state.logged = true;
    });
  },
});

export const { setUserItem } = userSlice.actions;
export const userAsyncActions = { login };

export default userSlice.reducer;

export const logoutAsync = () => {
  return async (dispatch: Dispatch) => {
    const { status } = await apiLogout({ token: localStorage.getItem('t')! });

    if (status) {
      localStorage.clear();
      dispatch(
        setUserItem({
          logged: false,
        }),
      );

      return true;
    }

    return false;
  };
};
