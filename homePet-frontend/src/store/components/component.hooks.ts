import { useAppSelector } from "../hooks";
import {
  selectCanView,
  selectCanCreate,
  selectCanEdit,
  selectCanDelete,
  selectCanExport,
  selectCanExecute,
  selectPermissionByCode,
} from "./component.selectors";

export function useCanView(code: string) {
  return useAppSelector(selectCanView(code));
}

export function useCanCreate(code: string) {
  return useAppSelector(selectCanCreate(code));
}

export function useCanEdit(code: string) {
  return useAppSelector(selectCanEdit(code));
}

export function useCanDelete(code: string) {
  return useAppSelector(selectCanDelete(code));
}

export function useCanExport(code: string) {
  return useAppSelector(selectCanExport(code));
}

export function useCanExecute(code: string) {
  return useAppSelector(selectCanExecute(code));
}

export function usePermission(code: string) {
  return useAppSelector(selectPermissionByCode(code));
}
