import moment from "moment";

export const getExpiryDate = (envValue) => {
  const value = parseInt(envValue, 10);
  const unit = envValue.replace(/[0-9]/g, "");
  return moment().add(value, unit).toDate();
};

export const isExpired = (expiryDate) => {
  if (!expiryDate) return true;
  return moment().isAfter(moment(expiryDate));
};
