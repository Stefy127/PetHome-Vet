# RESUMEN EJECUTIVO - Estructura Backend PET HOME

## 🎯 En 60 segundos

| Aspecto | Detalle |
|--------|---------|
| **Relación Cita → Consulta** | ✅ **OPCIONAL** (nullable FK) |
| **Historial se crea automático** | ✅ **SÍ** en primer POST a consulta |
| **Citas se cancelan automáticas** | ✅ **SÍ** cuando vencen |
| **Multi-tenancy** | ✅ Todas las operaciones validadas |
| **Estructura** | Mascota (1:1) → Historial (1:N) → Consulta (1:N) → Detalles |

---

## 📋 TABLA RÁPIDA

### **Modelos Principales**

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   MASCOTA   │────▶│ HISTORIAL CLINICO│────▶│ CONSULTA CLINICA │
│   (1 mascota)    (1 por mascota)       (N consultas)
│             │     │                  │     │                  │
└─────────────┘     └──────────────────┘     └──────────────────┘
       ▲
       │ N
       │
    ┌──────┐
    │ CITA │ ────────┐ (FK opcional)
    └──────┘         │
                     ▼
              ┌──────────────────┐
              │ CONSULTA CLINICA │
              │ (cita_id nullable)
              └──────────────────┘
```

### **Estados y Campos Clave**

| Modelo | Estado | PK | Auto-creación | Opcional |
|--------|--------|----|-|-|
| **Mascota** | Boolean | id_mascota | - | - |
| **Cita** | PENDIENTE/CONFIRMADA/CANCELADA/COMPLETADA | id_cita | - | - |
| **HistorialClinico** | Boolean | id_historial | ✅ SÍ | - |
| **ConsultaClinica** | Boolean | id_consulta | - | cita (nullable) |

---

## 🔄 FLUJOS AUTOMATIZADOS

### **1️⃣ Auto-creación de HistorialClinico**

```
POST /clinica/historiales/{id}/consultas/
    ↓
ClinicaService.registrar_consulta()
    ↓
HistorialClinico.objects.get_or_create(mascota_id=1)
    ├─ Si NO existe → CREA
    └─ Si existe → usa existente
    ↓
ConsultaClinica.objects.create(historial_clinico=...)
    ↓
201 Created
```

**Código:**
```python
historial, created = HistorialClinico.objects.get_or_create(
    mascota_id=mascota_id,
    defaults={'estado': True}
)
consulta = ConsultaClinica.objects.create(historial_clinico=historial, ...)
```

---

### **2️⃣ Cancelación Automática de Citas**

```
GET /servicios-reserva/citas/
    ↓
CitaService.cancelar_vencidas_por_tenant(veterinaria_id)
    ↓
UPDATE cita SET estado='CANCELADA'
WHERE fecha_programada < hoy AND estado IN ('PENDIENTE', 'CONFIRMADA')
    ↓
Retorna listado con citas actualizadas
```

**Cuándo:** Cada vez que se listan citas

---

## 📊 ENDPOINTS CRÍTICOS

| Método | Endpoint | Automático | Notas |
|--------|----------|--------|-|
| POST | `/servicios-reserva/citas/` | - | Crea cita PENDIENTE |
| GET | `/servicios-reserva/citas/` | ✅ Cancela vencidas | Filtra por tenant |
| PUT | `/servicios-reserva/citas/{id}/estado/` | - | Cambia estado |
| **POST** | **/clinica/historiales/{id}/consultas/** | ✅ **Crea historial si falta** | ← Punto clave |
| GET | `/clinica/historiales/` | - | Lista con consultas |

---

## 🔐 VALIDACIÓN MULTI-TENANCY

**En TODA operación:**
```python
if mascota.veterinaria_id != tenant_id:
    raise ValidationError("No pertenece a su veterinaria")
```

**Result:** Aislamiento completo entre clínicas

---

## ⚠️ PUNTOS CRÍTICOS

### ✅ **LA CITA ES OPCIONAL EN CONSULTA**

```json
// Válido - CON cita
{
  "cita": 42,
  "motivo_consulta": "Seguimiento de lesión"
}

// Válido - SIN cita (emergencia)
{
  "cita": null,
  "motivo_consulta": "Urgencia - vómito"
}
```

**Por qué:** Permite consultas de emergencia sin reserva previa

---

### ✅ **HISTORIALCLÍNICO SE CREA AUTOMÁTICO**

```python
# NO NECESITAS hacer esto:
POST /clinica/historiales/
{
  "mascota": 1,
  "observaciones_generales": "..."
}

# Se crea automático en primer POST consulta
POST /clinica/historiales/56/consultas/
{
  "motivo_consulta": "..."
  # HistorialClinico se crea automáticamente aquí
}
```

---

### ✅ **CITAS VENCIDAS SE CANCELAN AUTOMÁTICO**

```python
# Cita para: 2024-05-10 10:00
# Hoy es: 2024-05-15 14:30

GET /servicios-reserva/citas/
# Cita ahora aparece con:
# estado = "CANCELADA"
# motivo_cancelacion = "Cancelacion automatica por vencimiento de fecha/hora."
```

---

## 📁 ARCHIVOS A REVISAR

```
Backend/
├── apps/GestionServiciosyReserva/
│   └── models/citas.py ..................... Modelo Cita
│   └── services/citas_service.py .......... Lógica: cancelar_vencidas_por_tenant()
│
├── apps/GestionarClinicaVeterinaria/
│   ├── models/consulta_clinica.py ......... FK opcional a Cita
│   ├── models/historial_clinico.py ........ OneToOne con Mascota
│   └── services/clinica_service.py ........ Lógica: get_or_create() HistorialClinico
│
└── apps/GestionClientesyMascotas/
    └── models/mascota.py ................... OneToOne a HistorialClinico
```

---

## 🚀 QUICK START PARA FRONTEND

### **1. Crear una Cita**

```bash
POST /api/v1/servicios-reserva/citas/
{
  "mascota": 1,
  "servicio": 5,
  "precio_servicio": 12,
  "fecha_programada": "2024-05-20",
  "hora_inicio": "10:00:00",
  "modalidad": "CLINICA"
}
# Response 201: Cita creada con estado PENDIENTE
```

### **2. Registrar una Consulta (con auto-historial)**

```bash
POST /api/v1/clinica/historiales/56/consultas/
{
  "usuario_veterinario": 3,
  "cita": 42,                    # Opcional
  "motivo_consulta": "Vacunación",
  "diagnostico": "Saludable",
  "fecha_consulta": "2024-05-15T14:30:00Z",
  "peso": 25.5
}
# Response 201: Consulta creada
# ✅ HistorialClinico se creó automáticamente
```

### **3. Ver Historial con Consultas**

```bash
GET /api/v1/clinica/mascotas/1/historial/
# Response 200: HistorialClinico con todas las consultas anidadas
```

### **4. Cambiar Estado de Cita**

```bash
PUT /api/v1/servicios-reserva/citas/42/estado/
{
  "estado": "CONFIRMADA"
}
# Response 200: Cita actualizada
```

---

## 🔍 DEBUGGING

### **Problema: "Historial no encontrado"**
- [ ] Verifica que mascota_id existe
- [ ] Verifica que mascota pertenece a la veterinaria (tenant)
- [ ] Si es primera consulta, historial se crea automático

### **Problema: "La mascota ya tiene un historial"**
- [ ] NO intentes crear historial manual
- [ ] Solo sucede si llamas POST /clinica/historiales/
- [ ] Dejalo que se cree automático en consulta

### **Problema: "Cita no pertenece a su veterinaria"**
- [ ] Verifica veterinaria_id de la cita
- [ ] Valida que el token tiene el tenant correcto

---

## 📊 COMPARATIVA: Cita vs Consulta

| Aspecto | Cita | ConsultaClinica |
|--------|------|-----------------|
| **Creada por** | Cliente/Recepcionista | Veterinario |
| **Relación a Consulta** | Optional (1:N) | Requerida a Historial (N:1) |
| **Historial** | No tiene | OneToOne con Mascota vía Historial |
| **Auto-creación** | NO | NO, pero crea HistorialClinico |
| **Estados** | 4 (PENDIENTE/CONFIRMADA/CANCELADA/COMPLETADA) | Boolean |
| **Cancela automático** | ✅ Si vence | ✗ Manual |
| **Sin reserva previa** | ✗ | ✅ (cita puede ser null) |

---

## 🎯 CASOS DE USO

### **Caso 1: Flujo Normal**
```
1. Cliente agenda cita (PENDIENTE)
2. Recepcionista confirma (CONFIRMADA)
3. Veterinario crea consulta vinculada a cita
4. HistorialClinico se crea automático
5. Cliente ve historial actualizado
```

### **Caso 2: Emergencia Sin Cita**
```
1. Mascota llega sin cita previa
2. Veterinario crea consulta sin cita (cita_id=null)
3. HistorialClinico se crea automático
4. Se registra tratamiento inmediato
```

### **Caso 3: Cita Vencida**
```
1. Cita programada para 2024-05-10
2. 2024-05-15: GET /citas/
3. Sistema cancela automáticamente
4. Cliente ve "CANCELADA por vencimiento"
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] ¿Cita→Consulta es opcional? → SÍ (cita_id nullable)
- [ ] ¿Se crea HistorialClinico automático? → SÍ (get_or_create en Consulta)
- [ ] ¿Se cancelan citas vencidas? → SÍ (en GET /citas/)
- [ ] ¿Multi-tenancy validado? → SÍ (veterinaria_id en todas partes)
- [ ] ¿Una mascota un historial? → SÍ (OneToOne + validación)
- [ ] ¿Consulta requiere historial? → SÍ (FK no-null)
- [ ] ¿Consulta requiere cita? → NO (FK nullable)

---

## 📞 CONTACTO PARA DUDAS

Refer to detailed documentation files:
- `ANALISIS_BACKEND_ESTRUCTURA.md` - Análisis completo
- `APIS_CASOS_USO.md` - APIs con ejemplos
- `DETALLES_TECNICOS_IMPLEMENTACION.md` - Implementación técnica

---

**Última actualización:** 8 de mayo de 2026  
**Estado:** ✅ Exploración completada
