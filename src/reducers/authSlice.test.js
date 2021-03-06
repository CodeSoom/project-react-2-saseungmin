// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk';

import configureStore from 'redux-mock-store';

import reducer, {
  setAuth,
  setAuthError,
  clearAuth,
  requestRegister,
  requestLogin,
  setUser,
  logout,
  requestLogout,
} from './authSlice';

import { postUserLogin, postUserLogout, postUserRegister } from '../services/api';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('../services/api');

describe('reducer', () => {
  context('when previous state is undefined', () => {
    const initialState = {
      user: null,
      auth: null,
      authError: null,
    };

    it('returns initialState', () => {
      const state = reducer(undefined, { type: 'action' });

      expect(state).toEqual(initialState);
    });
  });

  describe('setAuth', () => {
    const initialState = {
      auth: null,
    };

    it('authentication success', () => {
      const userEmail = 'seungmin@naver.com';

      const { auth } = reducer(initialState, setAuth(userEmail));

      expect(auth).toBe(userEmail);
    });
  });

  describe('setAuthError', () => {
    const initialState = {
      authError: null,
    };

    it('authentication failure', () => {
      const error = 'error message';

      const { authError } = reducer(initialState, setAuthError(error));

      expect(authError).toBe(error);
    });
  });

  describe('clearAuth', () => {
    const initialState = {
      auth: 'seungmin@naver.com',
      authError: 'error',
    };

    it('clean up to auth and authError', () => {
      const { auth, authError } = reducer(initialState, clearAuth());

      expect(auth).toBe(null);
      expect(authError).toBe(null);
    });
  });

  describe('setUser', () => {
    const initialState = {
      user: null,
    };

    const userEmail = 'seungmin@naver.com';

    it('success login', () => {
      const { user } = reducer(initialState, setUser(userEmail));

      expect(user).toBe(userEmail);
    });
  });

  describe('logout', () => {
    const initialState = {
      user: 'seungmin@naver.com',
    };

    it('after logout clear user', () => {
      const { user } = reducer(initialState, logout());

      expect(user).toBe(null);
    });
  });
});

describe('async actions', () => {
  let store;

  describe('requestRegister', () => {
    const register = {
      userEmail: 'seungmin@naver.com',
      password: '123456',
    };

    beforeEach(() => {
      store = mockStore({});
    });

    context('without auth error', () => {
      const { userEmail } = register;

      postUserRegister.mockImplementationOnce(() => ({
        user: {
          email: userEmail,
        },
      }));

      it('dispatches requestRegister action success to return user email', async () => {
        await store.dispatch(requestRegister(register));

        const actions = store.getActions();

        expect(actions[0]).toEqual(setAuth(userEmail));
      });
    });

    context('with auth error', () => {
      postUserRegister.mockImplementationOnce(() => {
        throw new Error('error');
      });

      it('dispatches requestRegister action failure to return error', async () => {
        try {
          await store.dispatch(requestRegister(register));
        } catch (error) {
          const actions = store.getActions();

          expect(actions[0]).toEqual(setAuthError(error));
        }
      });
    });
  });

  describe('requestLogin', () => {
    const login = {
      userEmail: 'seungmin@naver.com',
      password: '123456',
    };

    beforeEach(() => {
      store = mockStore({});
    });

    context('without auth error', () => {
      const { userEmail } = login;

      postUserLogin.mockImplementationOnce(() => ({
        user: {
          email: userEmail,
        },
      }));

      it('dispatches requestLogin action success to return user email', async () => {
        await store.dispatch(requestLogin(login));

        const actions = store.getActions();

        expect(actions[0]).toEqual(setUser(userEmail));
      });
    });

    context('with auth error', () => {
      postUserLogin.mockImplementationOnce(() => {
        throw new Error('error');
      });

      it('dispatches requestLogin action failure to return error', async () => {
        try {
          await store.dispatch(requestLogin(login));
        } catch (error) {
          const actions = store.getActions();

          expect(actions[0]).toEqual(setAuthError(error));
        }
      });
    });
  });

  describe('requestLogout', () => {
    beforeEach(() => {
      store = mockStore({});
    });

    postUserLogout.mockImplementationOnce(() => ({}));

    it('dispatches requestLogout action success to logout', async () => {
      await store.dispatch(requestLogout());

      const actions = store.getActions();

      expect(actions[0]).toEqual(logout());
    });
  });
});
