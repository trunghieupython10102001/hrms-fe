import { Suspense, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { localeConfig, LocaleFormatter } from './locales';
import { ConfigProvider, notification, Spin } from 'antd';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
// import enUS from 'antd/es/locale/en_US';
// import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
// import 'moment/locale/zh-cn';
import RenderRouter from './routes';
import { useDispatch, useSelector } from 'react-redux';
import { history, HistoryRouter } from '@/routes/history';
import { setGlobalState } from './stores/global.store';
import vi_VN from 'antd/lib/locale/vi_VN';
import { useAppSelector } from './hooks/store';
import { logout, userAsyncActions } from './stores/user.store';
import { CUSTOM_EVENTS } from './constants/keys';
import { TIME_THRESHOR } from './constants/time';
import dispatchCustomEvent from './utils/dispatchCustomEvent';

const isDev = import.meta.env.MODE === 'development';

const themes = {
  light: isDev ? '../node_modules/antd/dist/antd.less' : 'https://cdn.jsdelivr.net/npm/antd@4.17.2/dist/antd.css',
  dark: isDev
    ? '../node_modules/antd/dist/antd.dark.less'
    : 'https://cdn.jsdelivr.net/npm/antd@4.17.2/dist/antd.dark.css',
};

const App: React.FC = () => {
  const { locale } = useSelector(state => state.user);
  const { theme, loading } = useSelector(state => state.global);
  const roleStatus = useAppSelector(state => state.user.roleList.status);
  const isLoggedIn = useAppSelector(state => state.user.logged);
  const dispatch = useDispatch();
  const setTheme = (dark = true) => {
    dispatch(
      setGlobalState({
        theme: dark ? 'dark' : 'light',
      }),
    );
  };

  const initApp = () => {
    if (isLoggedIn) {
      if (roleStatus !== 'success') {
        dispatch(userAsyncActions.getRolesList());
      }

      dispatch(userAsyncActions.getUserRole());
    }
  };

  /** initial theme */
  useEffect(() => {
    setTheme(theme === 'dark');
    // watch system theme change
    if (!localStorage.getItem('theme')) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');

      function matchMode(e: MediaQueryListEvent) {
        setTheme(e.matches);
      }

      mql.addEventListener('change', matchMode);
    }

    initApp();
    let expireTimer: NodeJS.Timeout;

    const sessionExpireHandler = () => {
      dispatch(logout());

      console.log('ExpireTime: ', expireTimer, Date.now());

      if (!expireTimer) {
        clearTimeout(expireTimer);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expireTimer = 0;
      }

      notification.error({
        message: 'Phiên đăng nhập hết hạn',
        description: 'Bạn vui lòng đăng nhập lại để tiếp tục',
      });
    };

    const updateExpireTimer = () => {
      if (!expireTimer) {
        clearTimeout(expireTimer);
      }

      expireTimer = setTimeout(sessionExpireHandler, TIME_THRESHOR);
    };

    const userInteractionHandler = () => {
      dispatchCustomEvent(CUSTOM_EVENTS.UPDATE_INTERACTION_TIME);
    };

    window.addEventListener(CUSTOM_EVENTS.SESSION_EXPIRE, sessionExpireHandler);
    window.addEventListener(CUSTOM_EVENTS.UPDATE_INTERACTION_TIME, updateExpireTimer);
    window.addEventListener('click', userInteractionHandler);

    return () => {
      window.removeEventListener(CUSTOM_EVENTS.SESSION_EXPIRE, sessionExpireHandler);
      window.removeEventListener(CUSTOM_EVENTS.UPDATE_INTERACTION_TIME, updateExpireTimer);
      window.removeEventListener('click', userInteractionHandler);
    };
  }, []);

  // set the locale for the user
  // more languages options can be added here
  useEffect(() => {
    if (locale === 'en_US') {
      moment.locale('en');
    } else if (locale === 'zh_CN') {
      moment.locale('zh-cn');
    }
  }, [locale]);

  return (
    <ConfigProvider locale={vi_VN}>
      <ThemeSwitcherProvider defaultTheme={theme} themeMap={themes}>
        <IntlProvider locale={locale.split('_')[0]} messages={localeConfig[locale]}>
          <HistoryRouter history={history}>
            <Suspense fallback={null}>
              <Spin
                spinning={loading}
                className="app-loading-wrapper"
                tip={<LocaleFormatter id="gloabal.tips.loading" />}
              ></Spin>
              <RenderRouter />
            </Suspense>
          </HistoryRouter>
        </IntlProvider>
      </ThemeSwitcherProvider>
    </ConfigProvider>
  );
};

export default App;
