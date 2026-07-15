# PLAN DE ALINEACIÓN FRONTEND — PETHOME SAAS

Estado: `EN PROGRESO`  
Última actualización: `2026-05-06`  
Objetivo: Adaptar el frontend para trabajar con el backend SaaS multi-tenant usando RTK Query y Redux dinámico.

---

## 📋 Checklist de Implementación

### Fase 1: Infraestructura de API (RTK Query)
- [x] Revisar y adaptar `store/api/createBaseApi.ts` (Manejo de tokens y 401/403).
- [x] Revisar `store/api/api.ts` (Base de RTK Query).
- [x] Actualizar `store/api/tagTypes.ts` con nuevos tags SaaS (Mascotas, Servicios, etc.).

### Fase 2: Tipos y Slices de Redux
- [x] Definir tipos SaaS en `auth.types.ts`, `tenant.types.ts` y `component.types.ts`.
- [x] Adaptar `authSlice.ts` (Auth puro: tokens + user).
- [x] Crear `tenantSlice.ts` (Contexto de veterinaria y plan).
- [x] Crear `componentSlice.ts` (Árbol y mapa plano de permisos).
- [x] Implementar `flattenComponents` en `component.utils.ts`.
- [x] Configurar los reducers en `store/index.ts` y `store/store.ts`.

### Fase 3: Servicios y Contexto de Autenticación
- [x] Actualizar `authApi.ts` (Endpoints: login, me, logout, register).
- [x] Crear `publicVeterinariaApi.ts` (Descubrimiento de veterinarias).
- [x] Implementar `applyAuthContext.ts` para hidratación centralizada de Redux.

### Fase 4: Autenticación y Persistencia
- [x] Conectar `LoginPage` al nuevo flujo de `loginWeb`.
- [x] Implementar `AuthBootstrap` para ejecutar `/auth/me/` al recargar.
- [x] Asegurar persistencia de todo el contexto (Tokens, User, Tenant, Components).

### Fase 5: UI Dinámica y Permisos
- [x] Crear `iconMap.ts` para Lucide Icons.
- [x] Crear helpers y hooks de permisos (`useCanView`, `useCanCreate`, etc.).
- [x] Adaptar `Sidebar.tsx` para renderizado recursivo desde `componentTree`.
- [x] Proteger rutas en TanStack Router usando `beforeLoad` y permisos.
- [x] Condicionar renderizado de botones y acciones según permisos granulares (Módulo Mascotas completado).

### Fase 6: Flujo Móvil y Pulido
- [ ] Implementar flujo de selección de veterinaria pública.
- [ ] Conectar `loginMobile` y `registerMobile`.
- [x] Implementar `logout` completo (Limpieza de caché de RTK Query y Slices).
- [ ] Pruebas de aislamiento entre Tenants y roles (SuperAdmin vs Admin vs Vet).

---

## 📝 Registro de Avance

### 2026-05-06
- Creación del plan de alineación integrado.
- Inicio de revisión de la capa base de RTK Query.

---

## 🛠️ Notas Técnicas
- **Regla de Oro**: Redux renderiza, RTK Query consume, Backend protege.
- **Isolación**: Siempre incluir `tenantId` en los argumentos de los queries de RTK Query para separar caché.
- **SuperAdmin**: Manejar `id_veterinaria = null` con safe navigation (`?.`).
