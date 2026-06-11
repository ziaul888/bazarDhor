import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { unitsApi, type Unit } from '../services/units';
import { useZone } from '@/providers/zone-provider';

export const unitKeys = {
  all: ['units'] as const,
  lists: () => [...unitKeys.all, 'list'] as const,
};

export const useUnits = (): UseQueryResult<Unit[], Error> => {
  const { zone } = useZone();
  return useQuery({
    queryKey: unitKeys.lists(),
    queryFn: () => unitsApi.getAll(),
    enabled: !!zone?.id,
    // Why: units rarely change — keep them cached for an hour to avoid refetching
    // every time the add-item drawer opens.
    staleTime: 60 * 60 * 1000,
  });
};
