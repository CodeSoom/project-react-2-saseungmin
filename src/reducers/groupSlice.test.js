// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk';

import configureStore from 'redux-mock-store';

import reducer, {
  setStudyGroups,
  loadStudyGroups,
  setStudyGroup,
  loadStudyGroup,
  changeWriteField,
  writeStudyGroup,
  clearWriteFields,
  successWrite,
  updateParticipant,
  deleteParticipant,
  changeApplyFields,
  clearApplyFields,
  updateConfirmParticipant,
  deleteGroup,
  setOriginalArticle,
  editStudyGroup,
  setGroupError,
  changeStudyReviewFields,
  clearStudyReviewFields,
  setStudyReview,
} from './groupSlice';

import STUDY_GROUPS from '../../fixtures/study-groups';
import STUDY_GROUP from '../../fixtures/study-group';
import WRITE_FORM from '../../fixtures/write-form';

import {
  editPostStudyGroup, postStudyGroup, getStudyGroup, getStudyGroups,
} from '../services/api';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('../services/api');
jest.mock('../util/utils');

describe('reducer', () => {
  context('when previous state is undefined', () => {
    const initialState = {
      groups: [],
      group: null,
      groupId: null,
      originalArticleId: null,
      groupError: null,
      writeField: {
        title: '',
        contents: '',
        moderatorId: '',
        applyEndDate: '',
        participants: [],
        personnel: '1',
        tags: [],
      },
      applyFields: {
        reason: '',
        wantToGet: '',
      },
      studyReviewFields: {
        rating: 3,
        content: '',
      },
    };

    it('returns initialState', () => {
      const state = reducer(undefined, { type: 'action' });

      expect(state).toEqual(initialState);
    });
  });

  describe('setStudyGroups', () => {
    it('get study groups list', () => {
      const initialState = {
        groups: [],
      };

      const state = reducer(
        initialState,
        setStudyGroups(STUDY_GROUPS),
      );

      expect(state.groups).toHaveLength(2);
    });
  });

  describe('setStudyGroup', () => {
    it('get group detail contents', () => {
      const initialState = {
        group: null,
      };

      const state = reducer(initialState, setStudyGroup(STUDY_GROUP));

      expect(state.group.id).toBe(1);
    });
  });

  describe('setGroupError', () => {
    it('when there is an error set error', () => {
      const initialState = {
        groupError: null,
      };

      const state = reducer(initialState, setGroupError('error'));

      expect(state.groupError).toBe('error');
    });
  });

  describe('changeWriteField', () => {
    it('changes a field of establish study group write', () => {
      const initialState = {
        writeField: {
          title: '',
          contents: '',
          moderatorId: '',
          applyEndDate: '',
          participants: [],
          personnel: '1',
          tags: [],
        },
      };

      const state = reducer(
        initialState,
        changeWriteField({ name: 'tags', value: ['JavaScript', 'React'] }),
      );

      expect(state.writeField.tags).toEqual(['JavaScript', 'React']);
    });
  });

  describe('clearWriteFields', () => {
    const initialState = {
      writeField: {
        title: '타이틀',
        contents: '내용',
      },
    };

    it('clears fields of write', () => {
      const state = reducer(initialState, clearWriteFields());

      const { writeField: { title, contents } } = state;

      expect(title).toBe('');
      expect(contents).toBe('');
    });
  });

  describe('successWrite', () => {
    const initialState = {
      groupId: null,
    };

    it('groupId return after successful writing', () => {
      const state = reducer(initialState, successWrite('1'));

      expect(state.groupId).toBe('1');
    });
  });

  describe('changeApplyFields', () => {
    it('changes a field of study participation application form', () => {
      const initialState = {
        applyFields: {
          reason: '',
          wantToGet: '',
        },
      };

      const state = reducer(
        initialState,
        changeApplyFields({ name: 'reason', value: '참여합니다.' }),
      );

      expect(state.applyFields.reason).toBe('참여합니다.');
    });
  });

  describe('clearApplyFields', () => {
    const initialState = {
      applyFields: {
        reason: '타이틀',
        wantToGet: '내용',
      },
    };

    it('clears fields of application', () => {
      const state = reducer(initialState, clearApplyFields());

      const { applyFields: { reason, wantToGet } } = state;

      expect(reason).toBe('');
      expect(wantToGet).toBe('');
    });
  });

  describe('setOriginalArticle', () => {
    const initialState = {
      originalArticleId: null,
      writeField: {
        title: '',
        contents: '',
        applyEndDate: '',
        tags: '',
        personnel: '',
      },
    };

    const fields = {
      title: 'title',
      contents: 'contents',
      applyEndDate: '2020-12-19',
      tags: ['1', '2'],
      personnel: '3',
      id: '1',
    };

    it('writeFields to set original article', () => {
      const state = reducer(initialState, setOriginalArticle(fields));

      const { originalArticleId, writeField } = state;

      expect(originalArticleId).toBe('1');
      expect(writeField.title).toBe('title');
    });
  });

  describe('changeStudyReviewFields', () => {
    it('changes a field of study review form', () => {
      const initialState = {
        studyReviewFields: {
          rating: 3,
          review: '',
        },
      };

      const state = reducer(
        initialState,
        changeStudyReviewFields({ name: 'rating', value: 5 }),
      );

      expect(state.studyReviewFields.rating).toBe(5);
    });
  });

  describe('clearStudyReviewFields', () => {
    const initialState = {
      studyReviewFields: {
        rating: 5,
        content: 'test',
      },
    };

    it('clears fields of study review form', () => {
      const state = reducer(initialState, clearStudyReviewFields());

      const { studyReviewFields: { rating, content } } = state;

      expect(rating).toBe(3);
      expect(content).toBe('');
    });
  });
});

describe('async actions', () => {
  let store;
  describe('loadStudyGroups', () => {
    const date = new Date();

    const settings = {
      createDate: date,
      applyEndDate: date,
      reviews: [{
        createDate: date,
      }],
    };

    beforeEach(() => {
      store = mockStore({});
      const data = jest.fn().mockReturnValueOnce(settings);

      getStudyGroups.mockReturnValueOnce([{
        data,
        id: '1',
      }]);
    });

    context('with tag', () => {
      it('loads study group list', async () => {
        await store.dispatch(loadStudyGroups('javascript'));

        const actions = store.getActions();

        expect(actions[0]).toEqual(setStudyGroups(null));
        expect(actions[1]).toEqual(setStudyGroups([{
          ...settings,
          id: '1',
        }]));
      });
    });

    context('without tag', () => {
      it('loads study group list', async () => {
        await store.dispatch(loadStudyGroups());

        const actions = store.getActions();

        expect(actions[0]).toEqual(setStudyGroups([{
          ...settings,
          id: '1',
        }]));
      });
    });
  });

  describe('loadStudyGroup', () => {
    const settings = {
      createDate: new Date(),
      applyEndDate: new Date(),
      reviews: [],
    };

    beforeEach(() => {
      const data = jest.fn().mockReturnValueOnce(settings);

      store = mockStore({});
      getStudyGroup.mockReturnValueOnce({
        data,
        id: '1',
      });
    });

    it('load study group detail', async () => {
      await store.dispatch(loadStudyGroup(1));

      const actions = store.getActions();

      expect(actions[0]).toEqual(setStudyGroup(null));
      expect(actions[1]).toEqual(setStudyGroup({
        ...settings,
        id: '1',
      }));
    });
  });

  describe('writeStudyGroup', () => {
    beforeEach(() => {
      store = mockStore({
        groupReducer: {
          writeField: WRITE_FORM,
        },
        authReducer: {
          user: null,
        },
      });
    });

    context('without write study error', () => {
      postStudyGroup.mockImplementationOnce(() => ('1'));

      it('dispatches clearWriteFields and successWrite', async () => {
        await store.dispatch(writeStudyGroup());

        const actions = store.getActions();

        expect(actions[0]).toEqual(successWrite('1'));
        expect(actions[1]).toEqual(clearWriteFields());
      });
    });

    context('with write study error', () => {
      postStudyGroup.mockImplementationOnce(() => {
        throw new Error('error');
      });

      it('dispatches writeStudyGroup action failure to return error', async () => {
        try {
          await store.dispatch(writeStudyGroup());
        } catch (error) {
          const actions = store.getActions();

          expect(actions[0]).toEqual(setGroupError(error));
        }
      });
    });
  });

  describe('editStudyGroup', () => {
    beforeEach(() => {
      store = mockStore({
        groupReducer: {
          writeField: WRITE_FORM,
          originalArticleId: '1',
        },
      });
    });

    context('without edit to study error', () => {
      editPostStudyGroup.mockImplementationOnce(() => (null));

      it('dispatches clearWriteFields and successWrite', async () => {
        await store.dispatch(editStudyGroup('1'));

        const actions = store.getActions();

        expect(actions[0]).toEqual({
          payload: '1',
          type: 'group/successWrite',
        });
        expect(actions[1]).toEqual({
          type: 'group/clearWriteFields',
        });
      });
    });

    context('with edit to study error', () => {
      editPostStudyGroup.mockImplementationOnce(() => {
        throw new Error('error');
      });

      it('dispatches editStudyGroup action failure to return error', async () => {
        try {
          await store.dispatch(editStudyGroup('1'));
        } catch (error) {
          const actions = store.getActions();

          expect(actions[1]).toEqual(setGroupError(error));
        }
      });
    });
  });

  describe('updateParticipant', () => {
    beforeEach(() => {
      store = mockStore({
        groupReducer: {
          group: STUDY_GROUP,
        },
        authReducer: {
          user: 'example',
        },
      });
    });

    const applyFields = {
      reason: '이유',
      wantToGet: '원하는 것',
    };

    it('dispatches setStudyGroup and clearApplyFields', async () => {
      await store.dispatch(updateParticipant(applyFields));

      const actions = store.getActions();

      expect(actions[0]).toEqual(setStudyGroup({
        ...STUDY_GROUP,
        participants: [...STUDY_GROUP.participants, {
          ...applyFields,
          id: 'example',
          confirm: false,
        }],
      }));
      expect(actions[1]).toEqual(clearApplyFields());
    });
  });

  describe('deleteParticipant', () => {
    const group = {
      id: 1,
      participants: [
        { id: 'user2' },
        { id: 'example' },
      ],
    };
    const user = 'example';

    beforeEach(() => {
      store = mockStore({
        groupReducer: {
          group,
        },
        authReducer: {
          user,
        },
      });
    });

    it('dispatches setStudyGroup', async () => {
      await store.dispatch(deleteParticipant());

      const actions = store.getActions();

      expect(actions[0]).toEqual(setStudyGroup({
        ...group,
        participants: group.participants.filter(({ id }) => id !== user),
      }));
    });
  });

  describe('updateConfirmParticipant', () => {
    context('When confirm is false ', () => {
      beforeEach(() => {
        store = mockStore({
          groupReducer: {
            group: {
              ...STUDY_GROUP,
              participants: [
                { id: 'test' },
                { id: 'test@test.com', confirm: false },
              ],
            },
          },
        });
      });

      it('dispatches setStudyGroup', async () => {
        await store.dispatch(updateConfirmParticipant('test@test.com'));

        const actions = store.getActions();

        expect(actions[0]).toEqual(setStudyGroup({
          ...STUDY_GROUP,
          participants: [
            { id: 'test' },
            { id: 'test@test.com', confirm: true },
          ],
        }));
      });
    });

    context('When confirm is true ', () => {
      beforeEach(() => {
        store = mockStore({
          groupReducer: {
            group: {
              ...STUDY_GROUP,
              participants: [
                { id: 'test' },
                { id: 'test@test.com', confirm: true },
              ],
            },
          },
        });
      });

      it('dispatches setStudyGroup', async () => {
        await store.dispatch(updateConfirmParticipant('test@test.com'));

        const actions = store.getActions();

        expect(actions[0]).toEqual(setStudyGroup({
          ...STUDY_GROUP,
          participants: [
            { id: 'test' },
            { id: 'test@test.com', confirm: false },
          ],
        }));
      });
    });
  });

  describe('deleteGroup', () => {
    beforeEach(() => {
      store = mockStore({});
    });

    it('dispatches setStudyGroup', async () => {
      const groupId = '1';

      await store.dispatch(deleteGroup(groupId));

      const actions = store.getActions();

      expect(actions[0]).toEqual();
    });
  });

  describe('setStudyReview', () => {
    beforeEach(() => {
      store = mockStore({
        groupReducer: {
          group: { id: '1' },
        },
      });
    });

    it('dispatches clearStudyReviewFields', async () => {
      await store.dispatch(setStudyReview({
        user: 'user',
        review: 'test',
        rating: 5,
      }));

      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: 'group/clearStudyReviewFields',
      });
    });
  });
});
