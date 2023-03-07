import { format as formatDateFns } from 'date-fns';
import { fr } from 'date-fns/locale';

type DateFormat = 'date' | 'datetime' | 'hour' | string

function getFormat(dateFormat: DateFormat): string {
	switch (dateFormat) {
		case 'date':
			return 'P'
		case 'hour':
			return 'p'
		case 'datetime':
			return 'P p'
		default:
			return dateFormat
	}
}

export function formatDate(
	dateParam: Date | number | string,
	dateFormat: DateFormat,
	options = {}
) {
	const format = getFormat(dateFormat)
	const date = new Date(dateParam);
	return formatDateFns(date, format, { ...options, locale: fr });
}
