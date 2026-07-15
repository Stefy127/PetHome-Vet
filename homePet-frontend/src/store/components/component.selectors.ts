import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const selectComponentState = (state: RootState) => state.components;
export const selectIsSuperUser = (state: RootState) => state.auth.user?.is_superuser || false;

export const selectComponentTree = createSelector(
  [selectComponentState],
  (components) => components.componentTree
);

export const selectPermissionsByCode = createSelector(
  [selectComponentState],
  (components) => components.permissionsByCode
);

export const selectPermissionByCode = (code: string) =>
  createSelector(
    [selectPermissionsByCode],
    (permissions) => permissions[code]
  );

export const selectCanView = (code: string) =>
  createSelector(
    [selectPermissionsByCode, selectIsSuperUser],
    (permissions, isSuperUser) => isSuperUser || Boolean(permissions[code]?.ver)
  );

export const selectCanCreate = (code: string) =>
  createSelector(
    [selectPermissionsByCode, selectIsSuperUser],
    (permissions, isSuperUser) => isSuperUser || Boolean(permissions[code]?.crear)
  );

export const selectCanEdit = (code: string) =>
  createSelector(
    [selectPermissionsByCode, selectIsSuperUser],
    (permissions, isSuperUser) => isSuperUser || Boolean(permissions[code]?.editar)
  );

export const selectCanDelete = (code: string) =>
  createSelector(
    [selectPermissionsByCode, selectIsSuperUser],
    (permissions, isSuperUser) => isSuperUser || Boolean(permissions[code]?.eliminar)
  );

export const selectCanExport = (code: string) =>
  createSelector(
    [selectPermissionsByCode],
    (permissions) => Boolean(permissions[code]?.exportar)
  );

export const selectCanExecute = (code: string) =>
  createSelector(
    [selectPermissionsByCode],
    (permissions) => Boolean(permissions[code]?.ejecutar)
  );
