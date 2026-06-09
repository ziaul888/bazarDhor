import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { statsApi, type PulseStats } from '../services/stats';
import { useZone } from '@/providers/zone-provider';

export const statsKeys = {
  all: ['stats'] as const,
  pulse: () => [...statsKeys.all, 'pulse'] as const,
};

export const usePulse = (): UseQueryResult<PulseStats | null, Error> => {
  const { zone } = useZone();

  return useQuery({
    queryKey: statsKeys.pulse(),
    queryFn: () => statsApi.getPulse(),
    enabled: !!zone?.id,
    staleTime: 60 * 1000,
  });
};
