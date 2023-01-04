// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { useEffect, useState } from 'react';
import useRootData from '~/hook/useRootData';

export default function useIsDesktop() {
	// default to true since we use SSR, and we will mostly be on desktop.
	const { isDesktop } = useRootData()
	// const [isDesktop, setIsDesktop] = useState(true)
	// const theme = useTheme();

	// const matches = useMediaQuery(theme.breakpoints.up('md'));

	// useEffect(() => {
	// 	setIsDesktop(matches)
	// 	console.log({ matches })
	// }, [matches])

	return isDesktop
}
