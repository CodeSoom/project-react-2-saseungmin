import React from 'react';

import { Link } from 'react-router-dom';

import facepaint from 'facepaint';
import styled from '@emotion/styled';

import { NOT_MEMBER_YET, REGISTER, FORM_TYPE } from '../../util/constants/constants';

import palette from '../../styles/palette';
import Button from '../../styles/Button';

const mq = facepaint([
  '@media(min-width: 450px)',
  '@media(min-width: 760px)',
]);

const AuthFormWrapper = styled.div`
  ${mq({
    width: ['calc(100% - 7rem)', 'calc(100% - 10rem)', '600px'],
    height: ['280px', '350px', '380px'],
    padding: ['2rem', '3rem'],
    boxShadow: ['rgb(0 0 0 / 10%) 0px 4px 16px 0px', 'rgb(0 0 0 / 15%) 0px 4px 16px 0px'],
  })};

  display: flex;
  align-items: center;
  justify-items: center;
  flex-direction: column;
  margin: 0 auto;
  border-radius: 1rem;
  background: ${palette.gray[1]};

  h2 {
  ${mq({
    fontSize: ['1.3rem', '1.7rem', '2rem'],
  })};
    margin-top: 0;
  }
`;

const FormWrapper = styled.form`
  display: grid;
  margin-top: 32px;
  grid-row-gap: 1rem;
  grid-template-rows: repeat(1,1fr);
`;

const ErrorWrapper = styled.div`
  ${mq({
    fontSize: ['0.7rem', '0.8rem', '0.9rem'],
  })};

  text-align: center;
  color: ${palette.warn[2]};
`;

const InputWrapper = styled.input`
  ${mq({
    height: ['30px', '35px', '40px'],
    width: ['230px', '60vw', '400px'],
    padding: ['4px 12px', '8px 12px'],
    fontSize: ['.8rem', '1rem'],
  })};

  line-height: 24px;
  border: 0;
  box-shadow: none;
  border: 2px solid #D7E2EB;
  border-radius: 0.25rem;
  color: #5f5f5f;
  background: white;
  transition-duration: 0.08s;
  transition-property: all;
  transition-timing-function: ease-in-out;
  transition-delay: initial;

  &:focus, &.hover {
    border: 2px solid ${palette.teal[5]};
  }
`;

const Footer = styled.div`
  ${mq({
    fontSize: ['0.7rem', '.9rem', '1rem'],
    marginTop: ['.5rem', '1rem', '1.5rem'],
    paddingTop: ['15px', '20px'],
  })};

  display: flex;
  justify-content: flex-end;
  border-top: 1px solid ${palette.gray[4]};
  
  a {
    color: ${palette.teal[5]};

    &:hover {
      font-weight: bold;
      text-decoration: underline;
      color: ${palette.teal[4]};
    }
  }

  span {
    font-weight: lighter;
    margin-right: 0.75rem;
    color: ${palette.gray[6]};
  }
`;

const AuthBlock = styled.div`
  top: 35px;
  left: 0px;
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled(Button)`
  ${mq({
    height: ['17px', '25px', '35px'],
  })};

  font-family: 'Jua', sans-serif;
  font-weight: lighter;
  border: 2px solid ${palette.teal[5]};

  &:hover{
    border: 2px solid ${palette.teal[5]};
  }
`;

const AuthForm = ({
  type, fields, onChange, onSubmit, error,
}) => {
  const formType = FORM_TYPE[type];

  const { userEmail, password } = fields;

  const handleChange = (e) => {
    const { name, value } = e.target;

    onChange({ name, value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit();
  };

  return (
    <AuthBlock>
      <AuthFormWrapper>
        <h2>{formType}</h2>
        <FormWrapper onSubmit={handleSubmit}>
          <InputWrapper
            type="text"
            value={userEmail}
            name="userEmail"
            placeholder="이메일"
            autoComplete="email"
            onChange={handleChange}
          />
          <InputWrapper
            type="password"
            value={password}
            name="password"
            placeholder="비밀번호"
            autoComplete="password"
            onChange={handleChange}
          />
          {type === 'register' && (
            <InputWrapper
              type="password"
              value={fields.passwordConfirm}
              name="passwordConfirm"
              placeholder="비밀번호 확인"
              autoComplete="new-password"
              onChange={handleChange}
            />
          )}
          {error && (
            <ErrorWrapper>{error}</ErrorWrapper>
          )}
          <StyledButton
            success
            type="submit"
            data-testid="auth-button"
          >
            {formType}
          </StyledButton>
          {type === 'login' && (
            <Footer>
              <span>{NOT_MEMBER_YET}</span>
              <Link
                to="/register"
                data-testid="sign-up-link"
              >
                {REGISTER}
              </Link>
            </Footer>
          )}
        </FormWrapper>
      </AuthFormWrapper>
    </AuthBlock>
  );
};

export default AuthForm;
