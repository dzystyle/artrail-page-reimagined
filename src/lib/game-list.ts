import { queryOptions } from "@tanstack/react-query";
import { listGames } from "@/lib/games.functions";

export const gameListKey = ["games"] as const;

export const gameListOptions = () => queryOptions({
  queryKey: gameListKey,
  queryFn: () => listGames(),
  staleTime: 0,
  refetchInterval: 10000,
});