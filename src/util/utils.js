import moment from 'moment';

export const getAuth = (key) => (obj) => obj.authReducer[key];

export const getGroup = (key) => (obj) => obj.groupReducer[key];

export function equal(key, value) {
  return (obj) => obj[key] === value;
}

export const authorizedUsersNumber = (participants) => participants
  .filter(({ confirm }) => confirm && confirm === true)
  .length + 1;

export const isCheckedTimeStatus = ({
  time, applyEndTime, participants, personnel,
}) => (!!((
  time - applyEndTime >= 0
  || authorizedUsersNumber(participants) >= parseInt(personnel, 10)
)));

export const isCheckedOnlyTimeStatus = ({ time, applyEndTime }) => (time - applyEndTime >= 0);

const checkTrim = (value) => value.trim();

export const isCheckValidate = (values) => values.map(checkTrim).includes('');

export const changeDateToTime = (date) => new Date(date).getTime();

const nowDate = new Date();
export const tomorrow = nowDate.setDate(nowDate.getDate() + 1);
export const yesterday = nowDate.setDate(nowDate.getDate() - 1);

export const toStringEndDateFormat = (endDate) => endDate && moment(new Date(endDate))
  .format('YYYY-MM-DDTHH:mm')
  .toString();

const dateToString = (date) => date.toDate().toString();

const formatReviewDate = (reviews) => reviews.map((review) => ({
  ...review,
  createDate: dateToString(review.createDate),
}));

export const formatGroup = (group) => {
  const { applyEndDate, createDate, reviews } = group.data();

  return {
    ...group.data(),
    id: group.id,
    applyEndDate: dateToString(applyEndDate),
    createDate: dateToString(createDate),
    reviews: reviews && [...formatReviewDate(reviews)],
  };
};
