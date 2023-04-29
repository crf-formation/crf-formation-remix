import type { PublicPropertiesDto } from "~/dto/publicproperties.dto";
import useRootData from "./useRootData";

export default function usePublicProperties(): PublicPropertiesDto {
  const { publicProperties } = useRootData();

  return publicProperties as PublicPropertiesDto;
}