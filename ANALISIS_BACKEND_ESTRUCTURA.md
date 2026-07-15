# Análisis Estructura Backend - PET HOME

## 📋 Resumen Ejecutivo
Exploración completa del backend Django que revela la arquitectura relacional entre Citas, Consultas Clínicas, Historiales y Mascotas. Se detectó **lógica de creación automática** y relaciones opcionales entre estos modelos.

---

## 🗂️ ESTRUCTURA DE MODELOS

### 1. **MASCOTA** (GestionClientesyMascotas)
**Archivo:** `apps/GestionClientesyMascotas/models/mascota.py`

```python
class Mascota(models.Model):
    id_mascota (PK)
    usuario (FK → User) - Propietario
    especie (FK → Especie)
    raza (FK → Raza)
    veterinaria (FK → Veterinaria) - Tenant
    
    # Datos básicos
    nombre, color, sexo, fecha_nac, tamano, peso
    foto, alergias, notas_generales
    fecha_registro, estado (Boolean)
```

**Relaciones:**
- `OneToOne` → `HistorialClinico` (relación inversa: `historial_clinico`)
- `OneToMany` → `Cita` (relación inversa: `citas`)

---

### 2. **HISTORIAL CLÍNICO** (GestionarClinicaVeterinaria)
**Archivo:** `apps/GestionarClinicaVeterinaria/models/historial_clinico.py`

```python
class HistorialClinico(models.Model):
    id_historial_clinico (PK)
    mascota (OneToOneField → Mascota) - NO NULL
    
    observaciones_generales (TextField)
    fecha_creacion (auto_now_add)
    fecha_actualizacion (auto_now)
    estado (Boolean, default=True)
```

**Relaciones:**
- `OneToOne` ← `Mascota` (un historial por mascota)
- `OneToMany` → `ConsultaClinica` (relación inversa: `consultas_clinicas`)

**Validación:** Solo UNA instancia activa de HistorialClinico por mascota

---

### 3. **CITA** (GestionServiciosyReserva)
**Archivo:** `apps/GestionServiciosyReserva/models/citas.py`

```python
class Cita(models.Model):
    id_cita (PK)
    usuario (FK → User)
    mascota (FK → Mascota) - PROTECT
    servicio (FK → Servicio)
    precio_servicio (FK → PrecioServicio)
    veterinaria (FK → Veterinaria) - Tenant
    
    # Fechas y horario
    fecha_generada (auto_now_add)
    fecha_confirmacion (NULL)
    fecha_programada (DATE)
    hora_inicio (TIME)
    hora_fin (TIME, NULL)
    
    # Detalles
    modalidad (CLINICA/DOMICILIO)
    direccion_cita (TEXT, NULL)
    descripcion (TEXT, NULL)
    
    # Estado
    estado (PENDIENTE/CONFIRMADA/CANCELADA/COMPLETADA)
    motivo_cancelacion (TEXT, NULL)
```

**Relaciones:**
- `ManyToOne` ← `Mascota`
- `OneToMany` → `ConsultaClinica` (relación inversa: `consultas_clinicas`, nullable)

---

### 4. **CONSULTA CLÍNICA** (GestionarClinicaVeterinaria)
**Archivo:** `apps/GestionarClinicaVeterinaria/models/consulta_clinica.py`

```python
class ConsultaClinica(models.Model):
    id_consulta_clinica (PK)
    
    # Relaciones principales
    historial_clinico (FK → HistorialClinico) - CASCADE
    cita (FK → Cita, NULL) - SET_NULL - ⚠️ OPCIONAL
    usuario_veterinario (FK → User)
    veterinaria (FK → Veterinaria) - Tenant
    
    # Información clínica
    motivo_consulta (TextField)
    diagnostico (TextField, NULL)
    observaciones (TextField, NULL)
    
    # Signos vitales
    peso (Decimal, NULL)
    temperatura (Decimal, NULL)
    frecuencia_cardiaca (Integer, NULL)
    frecuencia_respiratoria (Integer, NULL)
    proxima_revision (DateTime, NULL)
    
    # Auditoría
    fecha_consulta (DateTime)
    fecha_creacion (auto_now_add)
    fecha_actualizacion (auto_now)
    estado (Boolean, default=True)
```

**Relaciones:**
- `ManyToOne` ← `HistorialClinico` (obligatoria)
- `ManyToOne` ← `Cita` (OPCIONAL - una consulta NO necesita estar vinculada a una cita)
- `OneToMany` → `Tratamiento`
- `OneToMany` → `Receta`
- `OneToMany` → `VacunaAplicada`
- `OneToMany` → `ArchivoClinico`

---

## 🔗 DIAGRAMA DE RELACIONES

```
Mascota (One)
    ↓
    ├─→ (One-to-One) HistorialClinico
    │   └─→ (One-to-Many) ConsultaClinica
    │       ├─→ (Many-to-One) Tratamiento
    │       ├─→ (Many-to-One) Receta
    │       ├─→ (Many-to-One) VacunaAplicada
    │       └─→ (Many-to-One) ArchivoClinico
    │
    └─→ (One-to-Many) Cita
        └─→ (Optional FK) ConsultaClinica ⚠️ RELACIÓN OPCIONAL
```

---

## 📡 ENDPOINTS EXISTENTES

### **GestionServiciosyReserva (Citas)**
**Base URL:** `/api/v1/servicios-reserva/`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/citas/` | Listar todas las citas |
| POST | `/citas/` | Crear nueva cita |
| GET | `/citas/<id>/` | Detalle de una cita |
| PATCH | `/citas/<id>/` | Actualizar cita |
| PUT | `/citas/<id>/estado/` | Cambiar estado de cita |
| GET | `/agenda/` | Disponibilidad de agenda |
| POST | `/agenda/validar/` | Validar conflicto de horario |

### **GestionarClinicaVeterinaria (Consultas e Historiales)**
**Base URL:** `/api/v1/clinica/`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/historiales/` | Listar historiales clínicos |
| POST | `/historiales/` | Crear historial clínico |
| GET | `/mascotas/<id_mascota>/historial/` | Historial de mascota específica |
| GET | `/historiales/<id>/consultas/` | Listar consultas de un historial |
| POST | `/historiales/<id>/consultas/` | **Crear nueva consulta clínica** |
| GET | `/consultas/<id>/` | Detalle de consulta |
| PATCH | `/consultas/<id>/` | Actualizar consulta |
| POST | `/consultas/<id>/tratamientos/` | Agregar tratamiento |
| POST | `/consultas/<id>/receta/` | Crear receta |
| POST | `/consultas/<id>/vacunas/` | Registrar vacuna |
| POST | `/consultas/<id>/archivos/` | Adjuntar archivo |

---

## ⚙️ CAMPOS IMPORTANTES DE CADA MODELO

### **Mascota - Campos Clave**
- `id_mascota` (Auto)
- `nombre` (String)
- `usuario_id` (Propietario)
- `veterinaria_id` (Tenant - Multi-tenancy)
- `especie_id`, `raza_id`
- `estado` (Boolean)

### **Cita - Campos Clave**
- `id_cita` (Auto)
- `estado` (Choice: PENDIENTE/CONFIRMADA/CANCELADA/COMPLETADA)
- `fecha_programada`, `hora_inicio`, `hora_fin`
- `modalidad` (CLINICA/DOMICILIO)
- `veterinaria_id` (Tenant)

### **ConsultaClinica - Campos Clave**
- `id_consulta_clinica` (Auto)
- `cita_id` ⚠️ **OPCIONAL - Permite consultas sin cita**
- `historial_clinico_id` (Requerido)
- `motivo_consulta` (String)
- `diagnostico` (String)
- `fecha_consulta` (DateTime)
- `veterinaria_id` (Tenant)

### **HistorialClinico - Campos Clave**
- `id_historial_clinico` (Auto)
- `mascota_id` (OneToOne, PROTEGIDO)
- `observaciones_generales` (Text)

---

## 🔄 LÓGICA DE CREACIÓN AUTOMÁTICA

### ✅ **HistorialClinico se crea AUTOMÁTICAMENTE**

**Ubicación:** `apps/GestionarClinicaVeterinaria/services/clinica_service.py`

```python
@staticmethod
@transaction.atomic
def registrar_consulta(*, veterinaria_id, mascota_id, veterinario_id, motivo, ...):
    """
    Registra una nueva consulta clínica, asegurando que exista el historial.
    """
    # ⚠️ LÓGICA AUTOMÁTICA: Crear HistorialClinico si no existe
    historial, _ = HistorialClinico.objects.get_or_create(
        mascota_id=mascota_id,
        defaults={'estado': True}
    )
    
    # Luego se crea la ConsultaClinica
    consulta = ConsultaClinica.objects.create(
        historial_clinico=historial,
        veterinaria_id=veterinaria_id,
        ...
    )
    return consulta
```

**Implicación:** Cuando se crea la PRIMERA ConsultaClinica para una mascota, automáticamente se genera su HistorialClinico.

### ✅ **Citas vencidas se cancelan AUTOMÁTICAMENTE**

**Ubicación:** `apps/GestionServiciosyReserva/services/citas_service.py`

```python
@staticmethod
@transaction.atomic
def cancelar_vencidas_por_tenant(veterinaria_id):
    """
    Cancela automáticamente citas PENDIENTE/CONFIRMADA cuya fecha/hora ya pasó.
    """
    # Se ejecuta en cada GET /citas/
    qs = Cita.objects.filter(
        veterinaria_id=veterinaria_id,
        estado__in=[Cita.EstadoChoices.PENDIENTE, Cita.EstadoChoices.CONFIRMADA],
    ).filter(
        Q(fecha_programada__lt=hoy) | 
        (Q(fecha_programada=hoy) & Q(hora_inicio__lt=hora_actual))
    )
    
    return qs.update(
        estado=Cita.EstadoChoices.CANCELADA,
        motivo_cancelacion="Cancelacion automatica por vencimiento de fecha/hora."
    )
```

**Cuándo ocurre:** Cada vez que se llama al endpoint `GET /citas/`

---

## 📌 RELACIÓN CITA → CONSULTA: ¿EXISTENCIA Y OBLIGATORIEDAD?

### **SÍ EXISTE, PERO ES OPCIONAL**

```python
cita = models.ForeignKey(
    "GestionServiciosyReserva.Cita",
    db_column="id_cita",
    on_delete=models.SET_NULL,    # ← Si se elimina cita, consulta persiste
    related_name="consultas_clinicas",
    blank=True,                    # ← Campo opcional
    null=True,                     # ← Puede ser NULL
)
```

### **Escenarios posibles:**

1. **Cita → Consulta** (Caso normal)
   - Cliente agenda cita
   - Veterinario la completa con consulta clínica
   - Estado de cita pasa a COMPLETADA
   - ConsultaClinica.cita_id = <id_cita>

2. **Consulta SIN Cita** (Caso especial)
   - Veterinario crea consulta directamente sin cita previa
   - ConsultaClinica.cita_id = NULL
   - Útil para consultas de emergencia o sin reserva

### **Validación en la API:**

**ConsultaClinicaSerializer:**
```python
extra_kwargs = {
    "cita": {"required": False, "allow_null": True},
    ...
}
```

**ConsultaClinicaListCreateView (POST):**
```python
# Validar que la cita pertenece al mismo tenant
cita_id = request.data.get("cita")
if cita_id:
    cita = CitaSelector.get_cita_detail(cita_id, vet_id)
    if not cita:
        return Response(
            {"error": "La cita proporcionada no pertenece a su veterinaria."},
            status=status.HTTP_400_BAD_REQUEST
        )
```

---

## 🔐 SEGURIDAD MULTI-TENANCY

Todos los modelos incluyen validación **veterinaria_id** (Tenant):

- **Mascota:** `veterinaria_id` (FK)
- **Cita:** `veterinaria_id` (FK)
- **ConsultaClinica:** `veterinaria_id` (FK)
- **HistorialClinico:** Heredado via OneToOne con Mascota

**Validación en Serializers:**
```python
if mascota.veterinaria_id != tenant_id:
    raise ValidationError("La mascota no pertenece a la veterinaria actual.")
```

---

## 📊 RESUMEN DE ESTRUCTURA

| Entidad | PK | Relaciones | Auto-creación | Opcional |
|---------|----|-----------|----|----------|
| **Mascota** | id_mascota | User, Especie, Raza, Vet | - | - |
| **HistorialClinico** | id_historial | Mascota (1:1) | ✅ En primer POST consulta | - |
| **Cita** | id_cita | User, Mascota, Servicio, Vet | - | - |
| **ConsultaClinica** | id_consulta | HistorialClinico (req), Cita (opt), Vet | - | Cita ← FK nullable |

---

## 📁 ARCHIVOS RELEVANTES IDENTIFICADOS

```
apps/
├── GestionServiciosyReserva/
│   ├── models/citas.py ✓
│   ├── serializers/citas_serializer.py ✓
│   ├── views/citas_view.py ✓
│   ├── services/citas_service.py ✓
│   └── urls.py ✓
│
├── GestionarClinicaVeterinaria/
│   ├── models/
│   │   ├── consulta_clinica.py ✓
│   │   ├── historial_clinico.py ✓
│   │   ├── tratamiento.py
│   │   ├── receta.py
│   │   └── vacuna_aplicada.py
│   ├── serializers/
│   │   ├── consulta_clinica_serializer.py ✓
│   │   └── historial_clinico_serializer.py ✓
│   ├── views/
│   │   ├── consulta_clinica_view.py ✓
│   │   └── historial_clinico_view.py ✓
│   ├── services/clinica_service.py ✓
│   └── urls.py ✓
│
└── GestionClientesyMascotas/
    ├── models/mascota.py ✓
    └── urls.py ✓
```

---

## 🎯 CONCLUSIONES CLAVE

1. **Relación Cita → Consulta es OPCIONAL pero NO es uno-a-uno**
   - Una cita puede tener múltiples consultas
   - Una consulta puede no tener cita asociada

2. **HistorialClinico se crea AUTOMÁTICAMENTE**
   - Se genera con `get_or_create()` en primer POST a consultas
   - Garantiza que toda mascota con consulta tiene historial

3. **Citas vencidas se cancelan AUTOMÁTICAMENTE**
   - Ocurre en cada listado de citas
   - Limpia automáticamente el estado

4. **Arquitectura Multi-tenant**
   - Todas las operaciones validadas por `veterinaria_id`
   - Aislamiento completo entre clínicas

5. **Cascada de datos**
   - Mascota → HistorialClinico (OneToOne)
   - HistorialClinico → ConsultaClinica (OneToMany)
   - ConsultaClinica → Tratamientos, Recetas, Vacunas, Archivos
