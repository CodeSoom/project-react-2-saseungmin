import React from 'react';

import styled from '@emotion/styled';

import StudyGroup from './StudyGroup';

const StudyGroupsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: space-between;
`;

const StudyGroups = ({ groups }) => (
  <StudyGroupsWrapper>
    {groups.map((group) => (
      <StudyGroup
        key={group.id}
        group={group}
      />
    ))}
  </StudyGroupsWrapper>
);

export default StudyGroups;