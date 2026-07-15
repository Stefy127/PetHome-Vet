# APIs y Casos de Uso - PET HOME Backend

## 📞 APIs Completas con Ejemplos

### **1. CREAR CITA**

**Endpoint:** `POST /api/v1/servicios-reserva/citas/`

**Request:**
```json
{
  "mascota": 1,
  "servicio": 5,
  "precio_servicio": 12,
  "fecha_programada": "2024-05-20",
  "hora_inicio": "10:00:00",
  "hora_fin": "10:30:00",
  "modalidad": "CLINICA",
  "descripcion": "Consulta general"
}
```

**Response 201:**
```json
{
  "id_cita": 42,
  "usuario": 1,
  "correo_usuario": "cliente@example.com",
  "mascota": 1,
  "mascota_nombre": "Max",
  "servicio": 5,
  "servicio_nombre": "Consulta General",
  "precio_servicio": 12,
  "precio": "50.00",
  "fecha_generada": "2024-05-15T14:30:00Z",
  "fecha_confirmacion": null,
  "fecha_programada": "2024-05-20",
  "hora_inicio": "10:00:00",
  "hora_fin": "10:30:00",
  "modalidad": "CLINICA",
  "direccion_cita": null,
  "descripcion": "Consulta general",
  "estado": "PENDIENTE",
  "motivo_cancelacion": null
}
```

**Validaciones:**
- ✅ Mascota debe pertenece a la veterinaria (tenant)
- ✅ Servicio debe estar activo
- ✅ No puede haber solapamiento de horarios
- ✅ Fecha/hora debe ser futura

---

### **2. LISTAR CITAS**

**Endpoint:** `GET /api/v1/servicios-reserva/citas/`

**Response 200:**
```json
[
  {
    "id_cita": 42,
    "estado": "PENDIENTE",
    ...
  },
  {
    "id_cita": 41,
    "estado": "CANCELADA",
    "motivo_cancelacion": "Cancelacion automatica por vencimiento de fecha/hora."
  }
]
```

**Efecto secundario:**
- ⚠️ **AUTOMÁTICO:** Cancela citas vencidas antes de retornar el listado
- Citas con fecha/hora pasada pasan a estado `CANCELADA`

---

### **3. CAMBIAR ESTADO DE CITA**

**Endpoint:** `PUT /api/v1/servicios-reserva/citas/{id}/estado/`

**Request:**
```json
{
  "estado": "CONFIRMADA"
}
```

**Opciones de estado:**
- `PENDIENTE` → `CONFIRMADA` ✅
- `PENDIENTE` → `CANCELADA` ✅
- `CONFIRMADA` → `COMPLETADA` ✅
- `CONFIRMADA` → `CANCELADA` ✅ (con motivo_cancelacion)

---

### **4. CREAR CONSULTA CLÍNICA**

**Endpoint:** `POST /api/v1/clinica/historiales/{id_historial_clinico}/consultas/`

**Request:**
```json
{
  "usuario_veterinario": 3,
  "motivo_consulta": "Vacunación anual",
  "diagnostico": "Mascota saludable",
  "observaciones": "Sin problemas detectados",
  "fecha_consulta": "2024-05-15T14:30:00Z",
  "peso": 25.50,
  "temperatura": 38.5,
  "frecuencia_cardiaca": 90,
  "frecuencia_respiratoria": 20,
  "cita": 42  # Opcional
}
```

**Response 201:**
```json
{
  "id_consulta_clinica": 128,
  "historial_clinico": 56,
  "cita": 42,
  "usuario_veterinario": 3,
  "veterinario_nombre": "Dr. García",
  "mascota_nombre": "Max",
  "propietario_id": 1,
  "propietario_nombre": "Juan Pérez",
  "motivo_consulta": "Vacunación anual",
  "diagnostico": "Mascota saludable",
  "observaciones": "Sin problemas detectados",
  "fecha_consulta": "2024-05-15T14:30:00Z",
  "peso": 25.50,
  "temperatura": 38.5,
  "frecuencia_cardiaca": 90,
  "frecuencia_respiratoria": 20,
  "fecha_creacion": "2024-05-15T14:35:00Z",
  "fecha_actualizacion": "2024-05-15T14:35:00Z",
  "estado": true,
  "tratamientos": [],
  "receta": null,
  "vacunas_aplicadas": [],
  "archivos_clinicos": []
}
```

**⚠️ Efecto secundario - AUTOMÁTICO:**
```python
# Si NO existe HistorialClinico para esta mascota:
historial, created = HistorialClinico.objects.get_or_create(
    mascota_id=mascota_id,
    defaults={'estado': True}
)
# created = True si se creó automáticamente
```

**Resultado:** Se crea automáticamente el HistorialClinico si no existe

---

### **5. LISTAR CONSULTAS DE UN HISTORIAL**

**Endpoint:** `GET /api/v1/clinica/historiales/{id_historial_clinico}/consultas/`

**Response 200:**
```json
[
  {
    "id_consulta_clinica": 128,
    "mascota_nombre": "Max",
    "veterinario_nombre": "Dr. García",
    "motivo_consulta": "Vacunación anual",
    "fecha_consulta": "2024-05-15T14:30:00Z",
    ...
    "tratamientos": [],
    "receta": null,
    "vacunas_aplicadas": []
  }
]
```

---

### **6. CREAR HISTORIAL CLÍNICO (Manual)**

**Endpoint:** `POST /api/v1/clinica/historiales/`

**Request:**
```json
{
  "mascota": 1,
  "observaciones_generales": "Mascota con alergias conocidas"
}
```

**Response 201:**
```json
{
  "id_historial_clinico": 56,
  "mascota": 1,
  "mascota_id": 1,
  "mascota_nombre": "Max",
  "mascota_especie": "Perro",
  "mascota_raza": "Golden Retriever",
  "propietario_id": 1,
  "propietario_nombre": "Juan Pérez",
  "observaciones_generales": "Mascota con alergias conocidas",
  "fecha_creacion": "2024-05-15T14:40:00Z",
  "fecha_actualizacion": "2024-05-15T14:40:00Z",
  "estado": true,
  "consultas_clinicas": []
}
```

**Nota:** 
- Normalmente NO necesitas crear manualmente
- Se crea automáticamente al crear la primera consulta
- Validación: solo 1 HistorialClinico activo por mascota

---

### **7. OBTENER HISTORIAL DE MASCOTA**

**Endpoint:** `GET /api/v1/clinica/mascotas/{id_mascota}/historial/`

**Response 200:**
```json
{
  "id_historial_clinico": 56,
  "mascota_id": 1,
  "mascota_nombre": "Max",
  "consultas_clinicas": [
    {
      "id_consulta_clinica": 128,
      "fecha_consulta": "2024-05-15T14:30:00Z",
      "motivo_consulta": "Vacunación anual",
      "diagnostico": "Mascota saludable"
    }
  ]
}
```

---

### **8. REGISTRAR TRATAMIENTO**

**Endpoint:** `POST /api/v1/clinica/consultas/{id_consulta_clinica}/tratamientos/`

**Request:**
```json
{
  "tipo": "Medicamento",
  "descripcion": "Antibiótico oral",
  "fecha_ini": "2024-05-15",
  "fecha_fin": "2024-05-22",
  "observacion": "Tomar después de las comidas"
}
```

**Response 201:** Tratamiento creado

---

### **9. REGISTRAR VACUNA**

**Endpoint:** `POST /api/v1/clinica/consultas/{id_consulta_clinica}/vacunas/`

**Request:**
```json
{
  "nombre_vacuna": "Rabia",
  "dosis": "1ml",
  "fecha_aplicada": "2024-05-15",
  "fecha_proxima": "2025-05-15",
  "lote": "LOTE2024-001",
  "fabricante": "Pfizer",
  "observacion": "Sin reacciones"
}
```

---

## 🎯 CASOS DE USO PRINCIPALES

### **Caso 1: Consulta desde Cita (Flujo Normal)**

```
1. Cliente agenda cita
   POST /servicios-reserva/citas/
   → Cita creada con estado PENDIENTE

2. Veterinario confirma cita
   PUT /servicios-reserva/citas/{id}/estado/
   → estado = CONFIRMADA

3. Se realiza la cita, veterinario registra consulta
   POST /clinica/historiales/{id_historial}/consultas/
   {
     "cita": 42,  ← Vinculada a la cita
     "motivo_consulta": "...",
     ...
   }
   → ConsultaClinica creada
   → HistorialClinico creado automáticamente (si no existe)

4. Veterinario agrega tratamiento y vacunas
   POST /clinica/consultas/{id_consulta}/tratamientos/
   POST /clinica/consultas/{id_consulta}/vacunas/

5. Cliente ve historial de su mascota
   GET /clinica/mascotas/{id_mascota}/historial/
   → Incluye todas las consultas, tratamientos, vacunas
```

---

### **Caso 2: Consulta Sin Cita Previa (Emergencia)**

```
1. Propietario lleva mascota a urgencias sin cita previa
   
2. Veterinario crea consulta directamente
   POST /clinica/historiales/{id_historial}/consultas/
   {
     "cita": null,  ← SIN CITA
     "motivo_consulta": "Vómito persistente",
     "urgente": true
   }
   → ConsultaClinica creada (cita_id = NULL)
   → HistorialClinico creado automáticamente

3. Se registra el tratamiento de emergencia
   POST /clinica/consultas/{id_consulta}/tratamientos/
```

**La clave:** `cita` es OPCIONAL (nullable)

---

### **Caso 3: Cancelación Automática de Citas**

```
Cita agendada para: 2024-05-10 a las 10:00

Si no se completa y hoy es 2024-05-15:

GET /servicios-reserva/citas/
↓
CitaService.cancelar_vencidas_por_tenant() ejecuta:
↓
UPDATE cita SET 
  estado = 'CANCELADA',
  motivo_cancelacion = 'Cancelacion automatica por vencimiento de fecha/hora.'
WHERE fecha_programada < '2024-05-15'
  AND estado IN ('PENDIENTE', 'CONFIRMADA')
↓
Respuesta incluye cita con estado CANCELADA
```

---

## 📊 TABLA COMPARATIVA DE MODELOS

| Campo | Mascota | Cita | HistorialClinico | ConsultaClinica |
|-------|---------|------|------------------|-----------------|
| PK | id_mascota | id_cita | id_historial_clinico | id_consulta_clinica |
| Usuario FK | usuario_id | usuario_id | - | usuario_veterinario_id |
| Mascota FK | - | mascota_id | mascota_id (1:1) | - |
| Cita FK | - | - | - | cita_id (nullable) |
| Veterinaria FK | sí | sí | via mascota | sí |
| Auto-creación | NO | NO | ✅ SÍ (en ConsultaClinica) | NO |
| One-to-One | - | - | ✅ Con Mascota | - |
| One-to-Many | - | - | ✅ Con ConsultaClinica | ✅ Con Tratamiento, Receta, Vacuna |
| Estado | Boolean | Enum (4 estados) | Boolean | Boolean |
| Auditoría | fecha_registro | fecha_generada | fecha_creacion/actualizacion | fecha_creacion/actualizacion |

---

## 🔍 VALIDACIONES MULTI-TENANCY

Todas las operaciones incluyen validación de `veterinaria_id`:

```python
# Ejemplo en CitaSerializer.validate()
if mascota.veterinaria_id != tenant_id:
    raise ValidationError("La mascota no pertenece a la veterinaria actual.")

if servicio.veterinaria_id != tenant_id:
    raise ValidationError("El servicio no pertenece a la veterinaria actual.")

if precio_servicio.veterinaria_id != tenant_id:
    raise ValidationError("El precio no pertenece a la veterinaria actual.")
```

---

## 🔐 PERMISOS Y RBAC

**Componentes RBAC:**
- `SERV_CITAS` - Gestión de citas
- `CLI_CONSULTAS` - Gestión de consultas clínicas
- `CLI_HISTORIALES` - Gestión de historiales clínicos
- `CLI_RECETAS` - Gestión de recetas
- `CLI_VACUNAS` - Gestión de vacunas

**Roles:**
- `CLIENT` - Solo ve sus propias mascotas/citas
- `VETERINARIAN` - Crea consultas, registra tratamientos
- `ADMIN_CLINIC` - Gestión completa de la clínica
- `SUPER_ADMIN` - Administración multi-tenancy

---

## 📋 CHECKLIST DE INTEGRACIÓN

- [ ] Endpoint `/servicios-reserva/citas/` implementado
- [ ] Endpoint `/clinica/historiales/` implementado
- [ ] Endpoint `/clinica/historiales/{id}/consultas/` implementado
- [ ] Validación de multi-tenancy en todas las operaciones
- [ ] Cancelación automática de citas vencidas funcional
- [ ] Creación automática de HistorialClinico en primer POST
- [ ] Logging de todas las operaciones (Bitácora)
- [ ] Testing de relaciones opcionales (Cita nullable)
- [ ] CORS configurado para frontend
- [ ] Documentación Swagger actualizada

---

## 🐛 DEBUGGING: Preguntas Frecuentes

**P: ¿Por qué mi consulta se rechaza sin cita?**
R: Valida que `cita` sea null o un ID válido en la misma veterinaria.

**P: ¿Se crea automáticamente el HistorialClinico?**
R: SÍ, se crea automáticamente via `get_or_create()` al registrar primera ConsultaClinica.

**P: ¿Qué pasa si una cita vence?**
R: Se cancela automáticamente en el próximo GET /citas/ con motivo_cancelacion.

**P: ¿Puedo cambiar el estado de cita de COMPLETADA a PENDIENTE?**
R: NO, solo transiciones lógicas están permitidas (validar en actualizar_estado).

**P: ¿Puede una mascota tener múltiples historiales?**
R: NO, una mascota = UN historial (OneToOne). Error si intentas crear un segundo.

**P: ¿Es obligatorio vincular una Cita a una ConsultaClinica?**
R: NO, `cita_id` es nullable. Útil para consultas de emergencia sin reserva.
