import type { LocalizedTexts } from '~/dto/localizedtext.dto';
import { translate } from '~/utils/i18n';
import useLocale from './useLocale';

export default function useI18n() {
	const locale = useLocale()

	return {
		tr: (localizedText: LocalizedTexts) => translate(locale, localizedText)
	}
}