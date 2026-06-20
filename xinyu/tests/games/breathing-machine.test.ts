import { nextBreathingState } from "@/features/games/breathing-machine";

it("moves inhale to hold to exhale without failure states", () => {
  expect(nextBreathingState({ phase: "inhale", cycle: 0 }, "TIMER")).toEqual({ phase: "hold", cycle: 0 });
  expect(nextBreathingState({ phase: "hold", cycle: 0 }, "TIMER")).toEqual({ phase: "exhale", cycle: 0 });
  expect(nextBreathingState({ phase: "exhale", cycle: 0 }, "TIMER")).toEqual({ phase: "inhale", cycle: 1 });
  expect(nextBreathingState({ phase: "hold", cycle: 2 }, "EXIT")).toEqual({ phase: "idle", cycle: 2 });
});

it("completes after three cycles", () => {
  let state = nextBreathingState({ phase: "idle", cycle: 0 }, "START");
  for (let i = 0; i < 3; i++) {
    state = nextBreathingState(state, "TIMER"); // inhale -> hold
    state = nextBreathingState(state, "TIMER"); // hold -> exhale
    state = nextBreathingState(state, "TIMER"); // exhale -> ...
  }
  expect(state).toEqual({ phase: "complete", cycle: 3 });
});

it("stays idle on unrecognized events", () => {
  expect(nextBreathingState({ phase: "idle", cycle: 0 }, "TIMER")).toEqual({ phase: "idle", cycle: 0 });
});

it("exits from any phase", () => {
  expect(nextBreathingState({ phase: "inhale", cycle: 1 }, "EXIT")).toEqual({ phase: "idle", cycle: 1 });
  expect(nextBreathingState({ phase: "complete", cycle: 3 }, "EXIT")).toEqual({ phase: "idle", cycle: 3 });
});
