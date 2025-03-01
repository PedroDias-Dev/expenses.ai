import moment from "moment";

export const timer = (start: moment.Moment | null = null) => {
  const now = moment();
  const duration = moment.duration(now.diff(start));
  let display = "";

  if (duration.asHours() >= 1) {
    display = `${Math.floor(duration.asHours())}h ${duration.minutes()}m`;
  } else if (duration.asMinutes() >= 1) {
    display = `${Math.floor(duration.asMinutes())}m ${duration.seconds()}s`;
  } else {
    display = `${duration.seconds()}s`;
  }

  return display;
};
