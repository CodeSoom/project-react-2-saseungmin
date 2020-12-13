import React from 'react';

import styled from '@emotion/styled';
import { css } from '@emotion/react';

import palette from './palette';

const DateTimeStatusWrapper = styled.div`
  margin-left: 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  font-family: 'Gamja Flower', cursive;
  padding: .2rem .6rem .2rem .6rem;
  display: inline-flex;
  color: white;
  border-radius: 0.3rem;
  margin-top: 1rem;
  margin-bottom: 1rem;    

  ${(props) => props.status === 'mainRecruit'
    && css`
      margin-bottom: 0.5rem;
      background: ${palette.cyan[4]};
      animation: blink-animation 1.5s steps(5, start) infinite;
      -webkit-animation: blink-animation 1.5s steps(5, start) infinite;
      @keyframes blink-animation {
        to {
          visibility: hidden;
        }
      }
      @-webkit-keyframes blink-animation {
        to {
          visibility: hidden;
        }
      }
  `}

  ${(props) => props.status === 'mainDeadline'
    && css`
      margin-bottom: 0.5rem;
      background: #ff6b6b;
  `}

  ${(props) => props.status === 'introduceRecruit'
    && css`
      margin: 0;
      padding: .2rem 40px .2rem 40px;
      background: white;
      font-size: 1.1rem;
      border-radius: 0.5rem;
      align-items: center;
      color: ${palette.orange[4]};
      border: 1.5px solid ${palette.orange[4]};
      animation: blink-animation 1.5s steps(5, start) infinite;
      -webkit-animation: blink-animation 1.5s steps(5, start) infinite;
      @keyframes blink-animation {
        to {
          visibility: hidden;
        }
      }
      @-webkit-keyframes blink-animation {
        to {
          visibility: hidden;
        }
      }
  `}

  ${(props) => props.status === 'introduceDeadline'
    && css`
      margin: 0;
      font-size: 1.1rem;
      padding: 0 40px 0 40px;
      align-items: center;
      background: white;
      color: #ff6b6b;
      border: 1.5px solid #ff6b6b;
  `}
`;

const DateTimeStatus = ({ children, status }) => (
  <DateTimeStatusWrapper status={status}>
    {children}
  </DateTimeStatusWrapper>
);

export default DateTimeStatus;
