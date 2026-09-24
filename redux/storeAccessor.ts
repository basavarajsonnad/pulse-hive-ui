import type { AppDispatch, RootState } from "@/redux/store";

interface IStoreLike {
  dispatch: AppDispatch;
  getState: () => RootState;
}

let storeRef: IStoreLike | null = null;

export const setStore = (store: IStoreLike) => {
  storeRef = store;
};

export const getStore = (): IStoreLike => {
  if (!storeRef) {
    throw new Error("Store accessed before initialization");
  }
  return storeRef;
};
