import type { PseFormationDto } from '~/dto/pseformation.dto';
import useRootData from './useRootData';

export default function useCurrentPseFormation(): PseFormationDto {
	const { currentPseFormation } = useRootData()

	return currentPseFormation as PseFormationDto
}