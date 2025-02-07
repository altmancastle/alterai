import { Subject } from "rxjs";

export enum ActionTypes {
  TOGGLE_COLLAPSED = "toggleCollapsed",
}

interface InitialState {
  collapsed: boolean;
}

const state: InitialState = {
  collapsed: true,
};

interface Action {
  type: string;
  payload?: unknown;
}

export const configStore = new Subject<InitialState>();
export const Dispatcher = new Subject<Action>();

Dispatcher.subscribe((action: Action) => {
  switch (action.type) {
    case ActionTypes.TOGGLE_COLLAPSED:
      state.collapsed = action.payload as boolean;
      configStore.next(state);
      break;
    default:
      break;
  }
});
