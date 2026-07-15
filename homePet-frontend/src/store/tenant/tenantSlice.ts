import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Plan, Veterinaria, VeterinariaPublica } from "./tenant.types";

interface TenantState {
  veterinaria: Veterinaria | null;
  plan: Plan | null;
  selectedVeterinariaPublica: VeterinariaPublica | null;
}

const initialState: TenantState = {
  veterinaria: null,
  plan: null,
  selectedVeterinariaPublica: null,
};

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setTenant: (
      state,
      action: PayloadAction<{ veterinaria: Veterinaria | null; plan: Plan | null }>
    ) => {
      state.veterinaria = action.payload.veterinaria;
      state.plan = action.payload.plan;
    },
    setSelectedVeterinariaPublica: (
      state,
      action: PayloadAction<VeterinariaPublica | null>
    ) => {
      state.selectedVeterinariaPublica = action.payload;
    },
    clearTenant: (state) => {
      state.veterinaria = null;
      state.plan = null;
    },
  },
});

export const { setTenant, setSelectedVeterinariaPublica, clearTenant } =
  tenantSlice.actions;
export default tenantSlice.reducer;
