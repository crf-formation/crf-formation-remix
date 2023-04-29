import { formatDate } from "~/util/date.util";
import useLocale from "./useLocale";
import { useLocales } from "./useLocales";

export default function useI18n() {
  const locale = useLocale();
  const locales = useLocales();


  return {
    locale,
    locales,
    formatDate
  };
}