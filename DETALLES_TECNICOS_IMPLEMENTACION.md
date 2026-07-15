# Detalles Técnicos de Implementación - Backend PET HOME

## 📁 ESTRUCTURA DE ARCHIVOS

```
Pethome_backend/apps/
│
├── GestionServiciosyReserva/
│   ├── models/
│   │   ├── citas.py ...................... Modelo principal de Citas
│   │   ├── servicios.py .................. Servicios veterinarios
│   │   ├── precioservicio.py ............. Precios por modalidad
│   │   ├── especie.py .................... Especies (Perro, Gato, etc)
│   │   └── raza.py ....................... Razas de mascotas
│   │
│   ├── serializers/
│   │   ├── citas_serializer.py ........... CitaSerializer, CitaEstadoUpdateSerializer
│   │   └── servicios_serializer.py ....... ServicioSerializer
│   │
│   ├── views/
│   │   ├── citas_view.py ................. CitaListCreateView, CitaDetailView, CitaEstadoUpdateView
│   │   ├── servicios_view.py ............. ServicioListCreateView, ServicioDetailView
│   │   └── agenda_view.py ................ DisponibilidadAgendaView, ValidarConflictoView
│   │
│   ├── services/
│   │   └── citas_service.py .............. CitaService (lógica de negocio)
│   │
│   ├── selectors/
│   │   └── servicios_selector.py ......... CitaSelector (queries optimizadas)
│   │
│   ├── urls.py ........................... Enrutamiento
│   └── permissions.py .................... Control de acceso
│
├── GestionarClinicaVeterinaria/
│   ├── models/
│   │   ├── historial_clinico.py .......... Historial de mascota
│   │   ├── consulta_clinica.py ........... Consulta (registro de atención)
│   │   ├── tratamiento.py ................ Tratamientos prescritos
│   │   ├── receta.py ..................... Recetas de medicamentos
│   │   ├── detalle_receta.py ............. Detalles de receta
│   │   ├── vacuna_aplicada.py ............ Registro de vacunas
│   │   └── archivo_clinico.py ............ Archivos adjuntos (fotos, PDFs)
│   │
│   ├── serializers/
│   │   ├── historial_clinico_serializer.py
│   │   ├── consulta_clinica_serializer.py
│   │   ├── tratamiento_serializer.py
│   │   ├── receta_serializer.py
│   │   └── vacuna_aplicada_serializer.py
│   │
│   ├── views/
│   │   ├── historial_clinico_view.py .... HistorialClinicoListCreateView
│   │   ├── consulta_clinica_view.py ..... ConsultaClinicaListCreateView
│   │   ├── tratamiento_view.py .......... TratamientoListCreateView
│   │   ├── receta_view.py ............... RecetaPorConsultaView
│   │   └── vacuna_aplicada_view.py ...... VacunaAplicadaListCreateView
│   │
│   ├── services/
│   │   └── clinica_service.py ........... ClinicaService (auto-creación de historial)
│   │
│   ├── selectors/
│   │   └── clinica_selector.py .......... HistorialClinicoSelector, ConsultaClinicaSelector
│   │
│   ├── urls.py ........................... Enrutamiento
│   └── permissions.py .................... Control de acceso
│
└── GestionClientesyMascotas/
    ├── models/
    │   └── mascota.py .................... Mascota (OneToOne → HistorialClinico)
    │
    ├── views/
    │   └── mascota_perfil_view.py ........ MascotaHistorialClinicoView
    │
    └── urls.py
```

---

## 🔧 CONFIGURACIÓN DE MODELOS

### **Modelo Mascota - Relación OneToOne**

```python
# apps/GestionClientesyMascotas/models/mascota.py
class Mascota(models.Model):
    id_mascota = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        db_column="id_usuario",
        on_delete=models.CASCADE,
        related_name="mascotas",  # User.mascotas.all()
    )
    
    # Relación inversa automática: mascota.historial_clinico
```

---

### **Modelo HistorialClinico - Relación OneToOne**

```python
# apps/GestionarClinicaVeterinaria/models/historial_clinico.py
class HistorialClinico(models.Model):
    id_historial_clinico = models.AutoField(primary_key=True)
    
    mascota = models.OneToOneField(
        "GestionClientesyMascotas.Mascota",
        db_column="id_mascota",
        on_delete=models.CASCADE,           # Si mascota se elimina, historial también
        related_name="historial_clinico",   # mascota.historial_clinico (singular!)
    )
    
    observaciones_generales = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    estado = models.BooleanField(default=True)
```

**Acceso:**
```python
mascota.historial_clinico  # Acceso directo (OneToOneField)
historial.mascota          # Acceso inverso
```

---

### **Modelo ConsultaClinica - Relación ManyToOne (OPCIONAL)**

```python
# apps/GestionarClinicaVeterinaria/models/consulta_clinica.py
class ConsultaClinica(models.Model):
    id_consulta_clinica = models.AutoField(primary_key=True)
    
    # OBLIGATORIO
    historial_clinico = models.ForeignKey(
        "GestionarClinicaVeterinaria.HistorialClinico",
        db_column="id_historial_clinico",
        on_delete=models.CASCADE,              # Si historial se elimina, consulta también
        related_name="consultas_clinicas",     # historial.consultas_clinicas.all()
    )
    
    # OPCIONAL - La clave de la relación flexible
    cita = models.ForeignKey(
        "GestionServiciosyReserva.Cita",
        db_column="id_cita",
        on_delete=models.SET_NULL,            # ← Si cita se elimina, consulta persiste
        related_name="consultas_clinicas",    # cita.consultas_clinicas.all()
        blank=True,                           # ← Validación: campo opcional en forms
        null=True,                            # ← DB: puede ser NULL
    )
    
    usuario_veterinario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        db_column="id_usuario_veterinario",
        on_delete=models.PROTECT,             # No permite eliminar veterinario en uso
        related_name="consultas_veterinarias",
    )
```

---

## 🔄 LÓGICA DE AUTO-CREACIÓN

### **1. HistorialClinico - get_or_create()**

**Archivo:** `apps/GestionarClinicaVeterinaria/services/clinica_service.py`

```python
class ClinicaService:
    @staticmethod
    @transaction.atomic
    def registrar_consulta(
        *,
        veterinaria_id,
        mascota_id,
        veterinario_id,
        motivo,
        fecha_consulta=None,
        diagnostico=None,
        observaciones=None,
        cita_id=None,  # ← OPCIONAL
        peso=None,
        temperatura=None,
        f_cardiaca=None,
        f_respiratoria=None
    ):
        """
        LÓGICA AUTOMÁTICA: Crear HistorialClinico si no existe.
        
        Atomic transaction asegura que ambas operaciones se hacen o ninguna.
        """
        
        # ⚠️ AQUÍ OCURRE LA MAGIA - get_or_create
        historial, created = HistorialClinico.objects.get_or_create(
            mascota_id=mascota_id,
            defaults={'estado': True}
        )
        
        # `created` es True si se creó, False si ya existía
        
        # Crear la consulta DENTRO de la transacción
        consulta = ConsultaClinica.objects.create(
            historial_clinico=historial,
            veterinaria_id=veterinaria_id,
            usuario_veterinario_id=veterinario_id,
            cita_id=cita_id,  # ← Puede ser NULL
            motivo_consulta=motivo,
            diagnostico=diagnostico,
            observaciones=observaciones,
            fecha_consulta=fecha_consulta or timezone.now(),
            peso=peso,
            temperatura=temperatura,
            frecuencia_cardiaca=f_cardiaca,
            frecuencia_respiratoria=f_respiratoria
        )
        return consulta
```

**Flujo de ejecución:**

```
1. Usuario llama: POST /clinica/historiales/56/consultas/
2. ConsultaClinicaListCreateView.post()
3. ConsultaClinicaSerializer valida datos
4. ClinicaService.registrar_consulta(mascota_id=1, ...) se ejecuta
5. @transaction.atomic inicia transacción
6. get_or_create(mascota_id=1):
   - ¿Existe HistorialClinico.mascota_id = 1?
   - NO → Crea con defaults={'estado': True}, created=True
   - SÍ → Recupera existente, created=False
7. ConsultaClinica.objects.create(...) dentro transacción
8. @transaction.atomic confirma o revierte todo
9. Retorna ConsultaClinica
```

---

### **2. Citas Vencidas - Cancelación Automática**

**Archivo:** `apps/GestionServiciosyReserva/services/citas_service.py`

```python
class CitaService:
    @staticmethod
    @transaction.atomic
    def cancelar_vencidas_por_tenant(veterinaria_id):
        """
        Cancela automáticamente citas PENDIENTE/CONFIRMADA cuya fecha/hora ya pasó.
        
        Se ejecuta ANTES de retornar el listado en CitaListCreateView.get()
        """
        ahora = timezone.localtime()
        hoy = ahora.date()
        hora_actual = ahora.time()
        
        # Filtrar por tenant (multi-tenancy)
        qs = Cita.objects.filter(
            veterinaria_id=veterinaria_id,
            estado__in=[
                Cita.EstadoChoices.PENDIENTE,
                Cita.EstadoChoices.CONFIRMADA
            ],
        ).filter(
            Q(fecha_programada__lt=hoy)  # Fecha pasada
            | (Q(fecha_programada=hoy) & Q(hora_inicio__lt=hora_actual))  # Hoy pero hora pasada
        )
        
        # UPDATE masivo (eficiente)
        count = qs.update(
            estado=Cita.EstadoChoices.CANCELADA,
            motivo_cancelacion="Cancelacion automatica por vencimiento de fecha/hora.",
        )
        
        return count  # Retorna número de citas canceladas
```

**Cuándo ocurre:**

```python
# apps/GestionServiciosyReserva/views/citas_view.py
class CitaListCreateView(TenantViewMixin, APIView):
    def get(self, request):
        # ⚠️ AUTOMÁTICO: Se llama ANTES de retornar listado
        CitaService.cancelar_vencidas_por_tenant(self.get_tenant_id())
        
        # Ahora retorna citas con estados actualizados
        citas = self.get_queryset(request)
        serializer = CitaSerializer(citas, many=True)
        return Response(serializer.data)
```

---

## 📡 VALIDACIONES EN SERIALIZERS

### **CitaSerializer - Validación de Tenant**

```python
# apps/GestionServiciosyReserva/serializers/citas_serializer.py
class CitaSerializer(serializers.ModelSerializer):
    def validate(self, data):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        tenant = getattr(request, "tenant", None) if request else None
        tenant_id = getattr(tenant, "id", None)
        
        # Obtener valores: nuevos o actuales (si es update)
        mascota = data.get("mascota", getattr(self.instance, "mascota", None))
        servicio = data.get("servicio", getattr(self.instance, "servicio", None))
        precio_servicio = data.get(
            "precio_servicio",
            getattr(self.instance, "precio_servicio", None),
        )
        
        # ========== VALIDACIÓN DE TENANT ==========
        if tenant_id is None:
            raise serializers.ValidationError("No se pudo resolver el tenant activo.")
        
        if mascota and mascota.veterinaria_id != tenant_id:
            raise serializers.ValidationError(
                {"mascota": "La mascota no pertenece a la veterinaria actual."}
            )
        
        if servicio and servicio.veterinaria_id != tenant_id:
            raise serializers.ValidationError(
                {"servicio": "El servicio no pertenece a la veterinaria actual."}
            )
        
        if precio_servicio and precio_servicio.veterinaria_id != tenant_id:
            raise serializers.ValidationError(
                {"precio_servicio": "El precio no pertenece a la veterinaria actual."}
            )
        
        # ========== VALIDACIÓN DE CONFLICTO HORARIO ==========
        if fecha_programada and hora_inicio:
            fecha_hora_programada = timezone.datetime.combine(
                fecha_programada,
                hora_inicio,
            )
            fecha_hora_programada = timezone.make_aware(
                fecha_hora_programada,
                timezone.get_current_timezone(),
            )
            
            if fecha_hora_programada <= timezone.localtime():
                raise serializers.ValidationError(
                    {"fecha_programada": "La fecha y hora de la cita deben ser futuras."}
                )
        
        return data
```

---

### **ConsultaClinicaSerializer - Relación Opcional**

```python
# apps/GestionarClinicaVeterinaria/serializers/consulta_clinica_serializer.py
class ConsultaClinicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultaClinica
        fields = [
            "id_consulta_clinica",
            "historial_clinico",
            "cita",  # ← OPCIONAL
            "usuario_veterinario",
            ...
        ]
        read_only_fields = [
            "id_consulta_clinica",
            "historial_clinico",
            ...
        ]
        extra_kwargs = {
            "cita": {"required": False, "allow_null": True},  # ← Permite NULL
            "diagnostico": {"required": False, "allow_null": True},
            ...
        }
```

---

## 🔐 MULTI-TENANCY EN QUERIES

### **Selector - Obtener datos con filtro de tenant**

```python
# apps/GestionarClinicaVeterinaria/selectors/clinica_selector.py
class HistorialClinicoSelector:
    @staticmethod
    def get_historiales_by_tenant(veterinaria_id, user=None):
        """
        Retorna solo historiales de la veterinaria actual.
        """
        queryset = HistorialClinico.objects.filter(
            mascota__veterinaria_id=veterinaria_id
        ).select_related('mascota', 'mascota__usuario')
        
        # Si es cliente, solo sus mascotas
        if user and getattr(getattr(user, "role", None), "nombre", None) == RoleEnum.CLIENT.value:
            queryset = queryset.filter(mascota__usuario_id=user.id_usuario)
        
        return queryset

class ConsultaClinicaSelector:
    @staticmethod
    def get_consultas_by_historial(historial_id, veterinaria_id):
        """
        Retorna consultas validando tenant.
        """
        return ConsultaClinica.objects.filter(
            historial_clinico_id=historial_id,
            veterinaria_id=veterinaria_id  # ← Filtro de tenant
        ).select_related('usuario_veterinario', 'historial_clinico__mascota')
```

---

## 🔌 ENDPOINTS COMPLETOS

### **Crear Cita**

```python
# POST /api/v1/servicios-reserva/citas/
# Middleware extrae tenant_id de request
# CitaListCreateView.post() → CitaService.crear_cita()
# → Valida tenant en CitaSerializer
# → Verifica conflicto horario
# → Retorna 201 o 400
```

### **Crear Consulta Clínica**

```python
# POST /api/v1/clinica/historiales/56/consultas/
# → ConsultaClinicaListCreateView.post()
# → ClinicaService.registrar_consulta()
# → get_or_create(mascota_id=...)  ← Auto-crea HistorialClinico
# → ConsultaClinica.objects.create()
# → Retorna 201 o 400
```

### **Listar Citas**

```python
# GET /api/v1/servicios-reserva/citas/
# → CitaListCreateView.get()
# → CitaService.cancelar_vencidas_por_tenant()  ← AUTOMÁTICO
# → UPDATE citas SET estado=CANCELADA WHERE vencidas
# → Retorna lista con citas actualizadas
```

---

## 📊 TRANSACCIONES Y ATOMICIDAD

**Todas las operaciones críticas usan @transaction.atomic:**

```python
@staticmethod
@transaction.atomic
def registrar_consulta(...):
    """
    Si algo falla, TODO se revierte (rollback).
    Garantiza consistencia.
    """
    historial, _ = HistorialClinico.objects.get_or_create(...)
    consulta = ConsultaClinica.objects.create(...)
    return consulta
```

**Ventaja:** Si la creación de ConsultaClinica falla, el HistorialClinico creado también se revierte.

---

## 🎯 PATRONES UTILIZADOS

| Patrón | Uso | Ejemplo |
|--------|-----|---------|
| **Selector** | Queries optimizadas con select_related | `HistorialClinicoSelector.get_historiales_by_tenant()` |
| **Service** | Lógica de negocio | `ClinicaService.registrar_consulta()` |
| **Serializer** | Validación + serialización | `ConsultaClinicaSerializer` |
| **TenantViewMixin** | Extrae tenant_id de request | Hereda en views |
| **OneToOne** | Relación 1:1 | Mascota ↔ HistorialClinico |
| **get_or_create()** | Crear si no existe | Auto-creación de historial |
| **@transaction.atomic** | Atomicidad | Operaciones multi-tabla |
| **select_related()** | Optimización N+1 | Carga FK en 1 query |

---

## 🔍 DEBUGGING COMÚN

### **Error: "Historial clínico no encontrado"**

```python
# Verificar en ConsultaClinicaListCreateView.post()
historial = HistorialClinicoSelector.get_historiales_by_tenant(vet_id).filter(
    pk=id_historial_clinico
).first()

if not historial:
    return Response(
        {"error": "Historial clínico no válido para este tenant."},
        status=status.HTTP_403_FORBIDDEN
    )
```

**Causas:**
- Mascota pertenece a otra veterinaria
- Historial no existe para esa mascota
- Usuario no tiene permisos

---

### **Error: "La mascota ya tiene un historial"**

```python
# Validación en HistorialClinicoSerializer.validate_mascota()
def validate_mascota(self, value):
    existe = HistorialClinico.objects.filter(
        mascota=value,
        estado=True
    ).exists()
    
    if existe:
        raise serializers.ValidationError(
            "Esta mascota ya tiene un historial clínico activo."
        )
```

**Solución:** Una mascota = UN historial activo. No crear manual, se crea automático.

---

## 📋 CHECKLIST DE CONFIGURACIÓN

- [ ] `DATABASES` en settings.py apunta a PostgreSQL
- [ ] `INSTALLED_APPS` incluye todas las apps
- [ ] `MIDDLEWARE` incluye TenantMiddleware
- [ ] `REST_FRAMEWORK` configurado con esquema
- [ ] `SPECTACULAR_SETTINGS` para Swagger/OpenAPI
- [ ] Migraciones ejecutadas (`python manage.py migrate`)
- [ ] Datos de prueba cargados (`python manage.py seed_saas_data.py`)
- [ ] Variables de entorno configuradas (.env)
- [ ] CORS habilitado para frontend
- [ ] Logging configurado (bitácora)
