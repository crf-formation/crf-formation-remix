
import { DEFAULT_LOCALE } from '../constants/index';
import { translate } from "./i18n";

test("translate in french", () => {
	const locale = 'fr-FR'

	const obj1 = {
		'en-US': 'us',
		'fr-FR': 'fr',
  }

	const obj2 = [
		{ locale: 'en-US', text: 'us' },
		{ locale: 'fr-FR', text: 'fr' },
	]

	expect(translate(locale, obj1)).toBe('fr')
	expect(translate(locale, obj2)).toBe('fr')
});


test("fallback to default in french", () => {
	const locale = 'fr-FR'

	const obj1 = {
		'en-GB': 'us',
		[DEFAULT_LOCALE]: 'default',
  }

	const obj2 = [
		{ locale: 'en-GB', text: 'fr' },
		{ locale: [DEFAULT_LOCALE], text: 'default' },
	]

	expect(translate(locale, obj1)).toBe('default')
	expect(translate(locale, obj2)).toBe('default')
});
