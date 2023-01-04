import type { LocalizedTexts } from '~/dto/localizedtext.dto';
import { translate } from '~/util/i18n';
import useLocale from './useLocale';
import { useLocales } from './useLocales';

export default function useI18n() {
	const locale = useLocale()
	const locales = useLocales()

	return {
		locale,
		locales,
		tr: (localizedText: LocalizedTexts) => translate(locale, localizedText),
		formatDate: (dateParam: Date | number | string, format: Optional<string> = null, options = {}) => {
			const date = new Date(dateParam);
			const formattedDate = date.toLocaleDateString([ locale ], options) // [ locale ] to force default locale, otherwise use locales
			return formattedDate
		}
	}
}