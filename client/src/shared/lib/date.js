import {DateTime} from "luxon";

export const formatDate = (date, format, locale = "ru") => {
  if (!date) return date;
  return DateTime.fromISO(date || "")
    .setLocale(locale)
    .toFormat(format);
};