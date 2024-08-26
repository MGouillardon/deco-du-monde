export const eventConfig = {
  studio_shoot: {
    roles: { photograph: 1, assistant_photograph: 1 },
    needsItem: true,
    needsSet: false,
  },
  set_preparation: {
    roles: { decorator: 1, assistant_decorator: 1, driver_assistant: 1 },
    needsItem: false,
    needsSet: true,
  },
  set_shoot: {
    roles: {
      decorator: 1,
      assistant_decorator: 1,
      photograph: 1,
      assistant_photograph: 1,
      driver_assistant: 1,
    },
    needsItem: false,
    needsSet: true,
  },
  set_removal: {
    roles: { assistant_decorator: 1, driver_assistant: 1 },
    needsItem: false,
    needsSet: true,
  },
}
