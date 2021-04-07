import React from 'react';

import { render } from '@testing-library/react';

import ReviewList from './ReviewList';

describe('ReviewList', () => {
  const mockReviews = [{
    id: 'test@test.com',
    rating: 3,
    content: 'review',
    createdDate: new Date(),
  }];

  const renderReviewList = (reviews) => render((
    <ReviewList
      reviews={reviews}
    />
  ));

  context('With reviews', () => {
    it('Render reviews', () => {
      const { container } = renderReviewList(mockReviews);

      expect(container).toHaveTextContent('스터디를 참여한 1명의 회원 평균평점');
      expect(container).toHaveTextContent('6.0');
      expect(container).toHaveTextContent('review');
      expect(container).toHaveTextContent('test@test.com');
    });
  });

  context('Without reviews', () => {
    it('Render nothing review message', () => {
      const { container } = renderReviewList([]);

      expect(container).toHaveTextContent('등록된 리뷰가 존재하지 않습니다!');
    });
  });
});
