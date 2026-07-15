import type {
  ComponenteSistema,
  PermisosComponente,
} from "./component.types";

export function flattenComponents(
  components: ComponenteSistema[],
  result: Record<string, PermisosComponente> = {}
): Record<string, PermisosComponente> {
  for (const component of components) {
    result[component.codigo] = component.permisos;

    if (component.children && component.children.length > 0) {
      flattenComponents(component.children, result);
    }
  }

  return result;
}
