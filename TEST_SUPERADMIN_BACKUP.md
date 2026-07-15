# 🧪 Plan de Prueba: Backup/Restore Superadmin

**Estado:** ✅ Frontend y Backend listos

---

## 📋 Checklist Pre-Prueba

- [x] Backend actualizado: `backup_views.py`, `backup_service.py`
  - [x] Endpoint `/auth/backups/create/` acepta `scope` (TENANT/GLOBAL)
  - [x] Endpoint `/auth/backups/{id}/restore/` acepta `veterinaria_id_target`
  
- [x] Frontend compilado sin errores
  - [x] `BackupDetailsModal.tsx`: Selector de scope + dropdown de veterinarias (GLOBAL)
  - [x] `backupApi.ts`: RTK Query con `veterinaria_id_target`
  - [x] `BackupManagementScreen.tsx`: Integración de modal
  - [x] `BackupActionButtons.tsx`: Scope selector para crear backups

- [x] Endpoints de API verificados
  - [x] `GET /api/auth/public/veterinarias/` — Lista de veterinarias (para populate dropdown)

---

## 🎯 Escenarios de Prueba

### Escenario 1: Crear Backup GLOBAL (Superadmin)
```
1. Login como SUPERADMIN
2. Ir a "Gestión de Copias de Seguridad"
3. Botón "Nueva Copia" → Aparece modal con:
   - ☐ "Solo esta clínica" (TENANT)
   - ☐ "GLOBAL (todas las clínicas)" ← Seleccionar esto
4. Click "Crear Copia"
5. Verificar en Historial: Nueva copia con estado EXITOSO
6. Comprobar en DB que BackupRestore tiene:
   - scope = "GLOBAL"
   - veterinaria_id = NULL
```

### Escenario 2: Restaurar GLOBAL → Seleccionar Clínica
```
1. Login como SUPERADMIN
2. Historial de Copias → Seleccionar backup GLOBAL
3. Modal se abre → seleccionar "Restaurar"
4. En modal de detalles:
   - Selector Scope: ☑ "GLOBAL"
   - Dropdown "Selecciona una clínica":
     ☐ Todas las clínicas (sin seleccionar vet)
     ☐ Veterinaria A
     ☐ Veterinaria B
5. Seleccionar "Veterinaria A" → Click "Restaurar"
6. Verificar en DB:
   - Datos de Vet A restaurados
   - Datos de Vet B, Vet C intactos ✓
   - Usuario de superadmin sigue autenticado ✓
```

### Escenario 3: Usuario Normal (Tenant)
```
1. Login como USUARIO VET A
2. Historial de Copias → Solo ve backups de su clínica (scope=TENANT)
3. Botón "Nueva Copia":
   - NO ve opciones de scope (no es superadmin)
   - Solo ve botón "Crear Copia"
4. Crear backup → scope automático TENANT
5. Seleccionar backup → Restaurar:
   - NO ve selector de veterinarias
   - Restaura solo su clínica
```

---

## 🔧 Comandos de Prueba (Manual)

### Crear backup GLOBAL vía API
```bash
curl -X POST http://localhost:8000/api/auth/backups/create/ \
  -H "Authorization: Bearer {TOKEN_SUPERADMIN}" \
  -H "Content-Type: application/json" \
  -d '{"scope": "GLOBAL", "motivo": "Test GLOBAL backup"}'
```

### Restaurar con veterinaria_id_target
```bash
curl -X POST http://localhost:8000/api/auth/backups/{BACKUP_ID}/restore/ \
  -H "Authorization: Bearer {TOKEN_SUPERADMIN}" \
  -H "Content-Type: application/json" \
  -d '{"scope": "GLOBAL", "veterinaria_id_target": 2, "motivo": "Test selective restore"}'
```

### Cargar veterinarias (endpoint público)
```bash
curl http://localhost:8000/api/auth/public/veterinarias/
```

---

## ✅ Criterios de Éxito

| Criterio | Estado |
|----------|--------|
| Superadmin puede crear GLOBAL backup | 🔲 |
| Modal muestra dropdown de clínicas al restaurar GLOBAL | 🔲 |
| Restaurar GLOBAL con veterinaria_id_target preserva otras vets | 🔲 |
| Usuario normal solo ve TENANT backups | 🔲 |
| Backend retorna 403 si no-superadmin intenta scope=GLOBAL | 🔲 |

---

## 📝 Notas

- **Endpoint de veterinarias**: GET `/api/auth/public/veterinarias/` 
  - Frontend carga esto cuando scope=GLOBAL en modal
- **Snapshots**: Backend automáticamente preserva otras vets cuando restaura GLOBAL con `veterinaria_id_target`
- **Usuario ejecutor**: Backend preserva password + permisos del superadmin después de restore
- **URL API base**: `/api/` (frontend usa fetch con esta ruta)

---

## 🚀 Próximos Pasos Después de Pruebas

1. ✅ E2E test completo (all 4 scenarios)
2. ✅ Aplicar migraciones DB si no está hecho
3. ✅ Test scheduler dry-run
4. ✅ Deploy a Render
