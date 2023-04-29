import { find, sortBy } from "lodash";
import type { PseConcreteCaseGroupApiObject } from "~/apiobject/pseconcretecasegroup.apiobject";
import type {
  PseConcreteCaseSessionGroupOrderApiObject,
  PseConcreteCaseSessionGroupOrderSituationApiObject
} from "~/apiobject/pseconcretecasesession.apiobject";
import type {
  PseConcreteCaseSituationApiObject,
  PseSituationConcreteCaseGroupApiObject
} from "~/apiobject/pseconcretecasesituation.apiobject";
import { arrayGetDuplicates } from "~/util/array";


export function buildPseConcreteCaseSituationsGroupsOrder(
  pseConcreteCaseGroups: Array<PseConcreteCaseGroupApiObject>,
  pseConcreteCaseSituations: Array<PseConcreteCaseSituationApiObject>
): Array<PseConcreteCaseSessionGroupOrderApiObject> {
  const groupsOrders: Array<PseConcreteCaseSessionGroupOrderApiObject> = pseConcreteCaseGroups.map(pseConcreteCaseGroup => {

    let groupOrderSituations: Array<PseConcreteCaseSessionGroupOrderSituationApiObject> = [];
    const situationsWithoutPosition: Array<PseConcreteCaseSituationApiObject> = [];


    pseConcreteCaseSituations.forEach(pseConcreteCaseSituation => {
      const forGroup = find(
        pseConcreteCaseSituation.pseSituationConcreteCaseGroups,
        (pseSituationConcreteCaseGroup: PseSituationConcreteCaseGroupApiObject) => pseSituationConcreteCaseGroup.pseConcreteCaseGroup.id === pseConcreteCaseGroup.id
      );
      if (!forGroup) {
        situationsWithoutPosition.push(pseConcreteCaseSituation);
      } else {
        const groupOrderSituation: PseConcreteCaseSessionGroupOrderSituationApiObject = {
          position: forGroup.position,
          pseConcreteCaseSituation
        };
        groupOrderSituations.push(groupOrderSituation);
      }
    });

    groupOrderSituations = sortBy(groupOrderSituations, obj => obj.position);

    const duplicatedPositions: Array<PseConcreteCaseSessionGroupOrderSituationApiObject> = arrayGetDuplicates(
      groupOrderSituations,
      (groupOrderSituation: PseConcreteCaseSessionGroupOrderSituationApiObject) => groupOrderSituation.position
    );

    return {
      pseConcreteCaseGroup,
      groupOrderSituations,
      situationsWithoutPosition,
      duplicatedPositions,

      hasNoPositions: groupOrderSituations.length === 0,
      hasSomeSituationsWithoutPosition: groupOrderSituations.length > 0 && situationsWithoutPosition.length > 0
    } as PseConcreteCaseSessionGroupOrderApiObject;
  });

  return groupsOrders;
}