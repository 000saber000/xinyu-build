export type GardenState = { dew: number; growth: number; rewarded: string[] };

export function rewardActivity(
  state: GardenState,
  activityId: string,
): GardenState {
  if (state.rewarded.includes(activityId)) return state;
  const dew = state.dew + 1;
  return {
    dew,
    growth: Math.max(state.growth, Math.floor(dew / 3)),
    rewarded: [...state.rewarded, activityId],
  };
}
