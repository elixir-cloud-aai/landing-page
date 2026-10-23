import contributors from '@/data/contributor.json';
import type { GlobeMarker } from '@/components/ui/3d-globe';

// Globe markers for every contributor with a known location and photo.
export const contributorMarkers: GlobeMarker[] = contributors
  .filter(
    (
      contributor,
    ): contributor is typeof contributor & {
      lat: number;
      lng: number;
      image: string;
    } =>
      contributor.lat !== null &&
      contributor.lng !== null &&
      !!contributor.image,
  )
  .map((contributor) => ({
    lat: contributor.lat,
    lng: contributor.lng,
    src: contributor.image,
    label: contributor.name,
  }));
