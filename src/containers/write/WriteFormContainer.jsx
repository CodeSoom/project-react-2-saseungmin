import React, { useCallback } from 'react';

import { useUnmount } from 'react-use';
import { useDispatch, useSelector } from 'react-redux';

import { getGroup } from '../../util/utils';
import WriteForm from '../../components/write/WriteForm';

import { changeWriteField, clearWriteFields } from '../../reducers/groupSlice';

const WriteFormContainer = () => {
  const dispatch = useDispatch();

  const writeField = useSelector(getGroup('writeField'));

  const onChangeWriteField = useCallback(({ name, value }) => {
    dispatch(
      changeWriteField({
        name,
        value,
      }),
    );
  }, [dispatch]);

  useUnmount(() => dispatch(clearWriteFields()));

  return (
    <WriteForm
      fields={writeField}
      onChange={onChangeWriteField}
    />
  );
};

export default WriteFormContainer;
