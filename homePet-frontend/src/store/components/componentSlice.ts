import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ComponenteSistema, PermisosComponente } from "./component.types";
import { flattenComponents } from "./component.utils";

interface ComponentState {
  componentTree: ComponenteSistema[];
  permissionsByCode: Record<string, PermisosComponente>;
}

const initialState: ComponentState = {
  componentTree: [],
  permissionsByCode: {},
};

const componentSlice = createSlice({
  name: "components",
  initialState,
  reducers: {
    setComponents: (state, action: PayloadAction<ComponenteSistema[]>) => {
      state.componentTree = action.payload;
      state.permissionsByCode = flattenComponents(action.payload);
    },
    clearComponents: (state) => {
      state.componentTree = [];
      state.permissionsByCode = {};
    },
  },
});

export const { setComponents, clearComponents } = componentSlice.actions;
export default componentSlice.reducer;
