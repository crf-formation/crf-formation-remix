import { format as formatDateFns, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

type DateFormat = "date" | "datetime" | "hour" | string

function getFormat(dateFormat: DateFormat): string {
  switch (dateFormat) {
    case "date":
      return "P";
    case "hour":
      return "p";
    case "datetime":
      return "P p";
    default:
      return dateFormat;
  }
}

function parseDate(date: Date | number | string) {
  if (`${date}`.endsWith("Z")) {
    return parseISO(date as string);
  }

  return new Date(date);
}

export function formatDate(
  dateParam: Date | number | string,
  dateFormat: DateFormat,
  options = {}
) {
  const format = getFormat(dateFormat);
  const date = parseDate(dateParam);

  return formatDateFns(date, format, { ...options, locale: fr });
}
