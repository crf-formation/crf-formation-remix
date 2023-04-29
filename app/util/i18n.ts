import type { LocalizedTexts } from "~/dto/localizedtext.dto";
import { DEFAULT_LOCALE } from "../constant/index";

export function tr(localizedTexts: LocalizedTexts) {
  return translate(DEFAULT_LOCALE, localizedTexts);
}


export function translate(locale: string, localizedTexts: LocalizedTexts): string | undefined {
  if (!localizedTexts) {
    return undefined;
  }

  if (localizedTexts[0] && localizedTexts[0].text) {
    return localizedTexts.find(l => l.locale === DEFAULT_LOCALE)?.text;
  }

  const text = localizedTexts[locale] || localizedTexts[DEFAULT_LOCALE];
  if (text) {
    return text;
  }

  if (localizedTexts.values) {
    const [first] = localizedTexts.values();
    return first || undefined;
  }

  return undefined;
}
