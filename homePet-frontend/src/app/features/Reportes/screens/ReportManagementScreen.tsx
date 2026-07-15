import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Clock, LayoutDashboard, Mic, X } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { useAppSelector } from '#/store/hooks'
import { useCanView } from '#/store/auth/auth.hooks'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { reportService, type ReportHistoryParams } from '../services/reportService'

const staticFormatOptions = [
  { label: 'PDF', value: 'pdf' },
  { label: 'Excel', value: 'excel' },
  { label: 'HTML', value: 'html' },
]

const dynamicEntityOptions = [
  { label: 'Citas', value: 'citas' },
  { label: 'Servicios', value: 'servicios' },
  { label: 'Clientes', value: 'clientes' },
  { label: 'Productos', value: 'productos' },
]

const dynamicMetricPlaceholder = 'cantidad, activos, inactivos'
const dynamicDimensionPlaceholder = 'estado, fecha, categoria'

type ReportOption = {
  label: string
  value: string
}

type DynamicReportConfig = {
  metrics: ReportOption[]
  dimensions: ReportOption[]
}

const dynamicReportOptions: Record<string, DynamicReportConfig> = {
  citas: {
    metrics: [
      { label: 'Cantidad', value: 'cantidad' },
      { label: 'Pendientes', value: 'pendientes' },
      { label: 'Confirmadas', value: 'confirmadas' },
      { label: 'Canceladas', value: 'canceladas' },
      { label: 'Completadas', value: 'completadas' },
    ],
    dimensions: [
      { label: 'Estado', value: 'estado' },
      { label: 'Fecha', value: 'fecha' },
      { label: 'Cliente', value: 'cliente' },
      { label: 'Mascota', value: 'mascota' },
      { label: 'Veterinaria', value: 'veterinaria' },
    ],
  },
  servicios: {
    metrics: [
      { label: 'Cantidad', value: 'cantidad' },
      { label: 'Activos', value: 'activos' },
      { label: 'Inactivos', value: 'inactivos' },
      { label: 'A domicilio', value: 'domicilio' },
    ],
    dimensions: [
      { label: 'Estado', value: 'estado' },
      { label: 'Categoria', value: 'categoria' },
      { label: 'Servicio', value: 'nombre' },
      { label: 'Veterinaria', value: 'veterinaria' },
    ],
  },
  clientes: {
    metrics: [
      { label: 'Cantidad', value: 'cantidad' },
      { label: 'Activos', value: 'activos' },
      { label: 'Inactivos', value: 'inactivos' },
      { label: 'Nuevos', value: 'nuevos' },
    ],
    dimensions: [
      { label: 'Estado', value: 'estado' },
      { label: 'Fecha', value: 'fecha' },
      { label: 'Rol', value: 'rol' },
      { label: 'Veterinaria', value: 'veterinaria' },
    ],
  },
  productos: {
    metrics: [
      { label: 'Cantidad', value: 'cantidad' },
      { label: 'Activos', value: 'activos' },
      { label: 'Inactivos', value: 'inactivos' },
      { label: 'Stock total', value: 'stock_total' },
      { label: 'Valor inventario', value: 'valor_inventario' },
    ],
    dimensions: [
      { label: 'Categoria', value: 'categoria' },
      { label: 'Proveedor', value: 'proveedor' },
      { label: 'Estado', value: 'estado' },
      { label: 'Tipo de mascota', value: 'tipo_mascota' },
      { label: 'Veterinaria', value: 'veterinaria' },
    ],
  },
}

function getDynamicReportConfig(entity: string): DynamicReportConfig {
  return dynamicReportOptions[entity] ?? dynamicReportOptions.citas
}

function normalizeCollectionResponse(data: unknown) {
  if (Array.isArray(data)) return data
  if (!data || typeof data !== 'object') return []

  const record = data as Record<string, unknown>
  const keys = ['results', 'reportes', 'data', 'items', 'records', 'results_reportes']
  for (const key of keys) {
    const value = record[key]
    if (Array.isArray(value)) return value
  }

  return []
}

function getReportOptionValue(report: Record<string, any>) {
  const value =
    report.tipo_reporte ||
    report.tipo ||
    report.codigo ||
    report.slug ||
    report.id ||
    report.nombre
  return value ? String(value) : ''
}

function getReportOptionLabel(report: Record<string, any>, value: string) {
  return String(
    report.nombre ||
      report.descripcion ||
      report.titulo ||
      report.label ||
      value,
  )
}

function getSelectionSummary(selected: string[], options: ReportOption[], fallback: string) {
  if (selected.length === 0) return fallback
  const labels = selected
    .map((value) => options.find((option) => option.value === value)?.label ?? value)
    .filter(Boolean)
  if (labels.length <= 2) return labels.join(', ')
  return `${labels.length} seleccionadas`
}

function extractReportId(report: Record<string, any>) {
  const value =
    report.id ??
    report.id_reporte ??
    report.id_reporte_generado ??
    report.reporte_id ??
    report.report_id ??
    report.idReporte ??
    report.codigo ??
    report.uuid
  return value ? String(value) : ''
}

function normalizeRole(value?: string | null) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
}

function isAllowedReportRole(value?: string | null) {
  const normalized = normalizeRole(value)
  return (
    normalized === 'SUPERADMIN' ||
    normalized === 'ADMIN' ||
    normalized === 'ADMINISTRADOR' ||
    normalized === 'VETERINARIAN' ||
    normalized === 'VETERINARIO'
  )
}

function getExtensionFromContentType(contentType: string) {
  if (contentType.includes('pdf')) return 'pdf'
  if (contentType.includes('spreadsheet') || contentType.includes('excel')) return 'xlsx'
  if (contentType.includes('csv')) return 'csv'
  if (contentType.includes('json')) return 'json'
  if (contentType.includes('text/plain')) return 'txt'
  if (contentType.includes('text/')) return 'txt'
  return 'bin'
}

function extractFilenameFromContentDisposition(header: string) {
  const match = /filename\*?=([^;]+)/i.exec(header)
  if (!match) return null

  let filename = match[1].trim()
  if (filename.startsWith("UTF-8''")) {
    filename = decodeURIComponent(filename.replace("UTF-8''", ''))
  }
  return filename.replace(/['"\s]/g, '') || null
}

function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }
  return fallback
}

export default function ReportManagementScreen() {
  const user = useAppSelector((state) => state.auth.user)
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const canViewReportsPermission = useCanView('REP_REPORTES')

  const userRole = (user as any)?.role || (user as any)?.rol
  const userEmail = user?.correo
  const userId = user?.id_usuario
  const userVeterinariaId = user?.id_veterinaria
  const isSuperAdmin = normalizeRole(userRole) === 'SUPERADMIN'
  const canAccessByRole = isAllowedReportRole(userRole)
  const canViewReports = canAccessByRole || canViewReportsPermission

  const [kpis, setKpis] = useState<Array<Record<string, any>>>([])
  const [staticReports, setStaticReports] = useState<Array<Record<string, any>>>([])
  const [reportHistory, setReportHistory] = useState<Array<Record<string, any>>>([])
  const [historyInfo, setHistoryInfo] = useState({ count: 0, next: null as string | null, previous: null as string | null })

  const [isLoadingKpis, setIsLoadingKpis] = useState(false)
  const [isLoadingStatic, setIsLoadingStatic] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isGeneratingStatic, setIsGeneratingStatic] = useState(false)
  const [isGeneratingDynamic, setIsGeneratingDynamic] = useState(false)
  const [isSendingCustom, setIsSendingCustom] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('todos')
  const [selectedType, setSelectedType] = useState('todos')
  const [historyFrom, setHistoryFrom] = useState('')
  const [historyTo, setHistoryTo] = useState('')
  const [historyFormat, setHistoryFormat] = useState('todos')

  const [staticReportType, setStaticReportType] = useState<string | undefined>(undefined)
  const [staticFormat, setStaticFormat] = useState('pdf')
  const [staticFrom, setStaticFrom] = useState('')
  const [staticTo, setStaticTo] = useState('')
  const [staticVeterinariaId, setStaticVeterinariaId] = useState('')

  const [dynamicEntity, setDynamicEntity] = useState('citas')
  const [dynamicMetrics, setDynamicMetrics] = useState<string[]>(['cantidad'])
  const [dynamicDimensions, setDynamicDimensions] = useState<string[]>(['estado'])
  const [dynamicFrom, setDynamicFrom] = useState('')
  const [dynamicTo, setDynamicTo] = useState('')
  const [dynamicFormat, setDynamicFormat] = useState('pdf')

  const [customMessage, setCustomMessage] = useState('')
  const [customFormat, setCustomFormat] = useState('pdf')
  const [transcription, setTranscription] = useState<string | null>(null)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [recordingError, setRecordingError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  const canRecordAudio = Boolean(userEmail && userId != null)
  const dynamicReportConfig = useMemo(() => getDynamicReportConfig(dynamicEntity), [dynamicEntity])

  const historyParams = useMemo(() => {
    const params: ReportHistoryParams = {}
    if (searchTerm.trim()) params.search = searchTerm.trim()
    if (selectedStatus !== 'todos') params.estado = selectedStatus
    if (selectedType !== 'todos') params.tipo_reporte = selectedType
    if (historyFrom) params.fecha_inicio = historyFrom
    if (historyTo) params.fecha_fin = historyTo
    if (historyFormat !== 'todos') params.formato = historyFormat
    return params
  }, [searchTerm, selectedStatus, selectedType, historyFrom, historyTo, historyFormat])

  const loadKPIs = async () => {
    setIsLoadingKpis(true)
    setErrorMessage(null)
    try {
      const data = await reportService.getReportKpis(accessToken)
      const normalized = Array.isArray(data)
        ? data
        : Object.keys(data || {}).map((key) => ({ label: key, value: String((data as any)[key]) }))
      setKpis(normalized)
    } catch {
      setErrorMessage('No se pudieron cargar los KPIs de reportes.')
    } finally {
      setIsLoadingKpis(false)
    }
  }

  const loadStaticReports = async () => {
    setIsLoadingStatic(true)
    setErrorMessage(null)
    try {
      const data = await reportService.getStaticReports(accessToken)
      const normalized = normalizeCollectionResponse(data) as Array<Record<string, any>>
      setStaticReports(normalized)
      if (normalized.length > 0) {
        const validValues = normalized.map((report) => getReportOptionValue(report)).filter(Boolean)
        const firstValidOption = validValues[0]
        if (firstValidOption) {
          setStaticReportType((current) =>
            current && validValues.includes(current) ? current : String(firstValidOption),
          )
        }
      }
    } catch {
      setErrorMessage('No se pudieron cargar los reportes estáticos.')
    } finally {
      setIsLoadingStatic(false)
    }
  }

  const loadReportHistory = async (params: ReportHistoryParams = {}) => {
    setIsLoadingHistory(true)
    setErrorMessage(null)
    try {
      const data = await reportService.getReportHistory({ ...historyParams, ...params }, accessToken)
      if (Array.isArray(data)) {
        setReportHistory(data)
        setHistoryInfo({ count: data.length, next: null, previous: null })
      } else {
        setReportHistory((data as any).results ?? [])
        setHistoryInfo({
          count: (data as any).count ?? ((data as any).results?.length ?? 0),
          next: (data as any).next ?? null,
          previous: (data as any).previous ?? null,
        })
      }
    } catch {
      setErrorMessage('No se pudo cargar el historial de reportes.')
    } finally {
      setIsLoadingHistory(false)
    }
  }

  useEffect(() => {
    if (!canViewReports) return
    void loadKPIs()
    void loadStaticReports()
    void loadReportHistory()
  }, [canViewReports])

  useEffect(() => {
    const metricValues = dynamicReportConfig.metrics.map((option) => option.value)
    const dimensionValues = dynamicReportConfig.dimensions.map((option) => option.value)

    setDynamicMetrics((current) => {
      const filtered = current.filter((value) => metricValues.includes(value))
      return filtered.length > 0 ? filtered : metricValues.slice(0, 1)
    })

    setDynamicDimensions((current) => {
      const filtered = current.filter((value) => dimensionValues.includes(value))
      return filtered.length > 0 ? filtered : dimensionValues.slice(0, 1)
    })
  }, [dynamicReportConfig])

  const handleApplyFilters = async () => {
    await loadReportHistory({ page: 1 })
  }

  const handlePageChange = async (url: string | null) => {
    if (!url) return
    setIsLoadingHistory(true)
    setErrorMessage(null)
    try {
      const data = await reportService.getReportHistory({ url }, accessToken)
      setReportHistory((data as any).results ?? [])
      setHistoryInfo({
        count: (data as any).count ?? ((data as any).results?.length ?? 0),
        next: (data as any).next ?? null,
        previous: (data as any).previous ?? null,
      })
    } catch {
      setErrorMessage('No se pudo cambiar de página en el historial.')
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleGenerateStaticReport = async () => {
    setIsGeneratingStatic(true)
    setStatusMessage(null)
    setErrorMessage(null)
    try {
      const payload = {
        slug: staticReportType,
        filtros: {
          fecha_inicio: staticFrom || null,
          fecha_fin: staticTo || null,
          id_veterinaria: isSuperAdmin ? (staticVeterinariaId || null) : null,
          id_veterinario: null,
        },
        formato: staticFormat,
      }
      const generatedReport = (await reportService.generateStaticReport(payload, accessToken)) as Record<string, any>
      const generatedReportId = extractReportId(generatedReport)
      setStatusMessage(
        generatedReportId
          ? `Reporte estatico generado con exito (ID ${generatedReportId}).`
          : 'Reporte estatico generado con exito.',
      )
      await loadReportHistory({ page: 1 })
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo generar el reporte estatico.'))
    } finally {
      setIsGeneratingStatic(false)
    }
  }

  const handleGenerateDynamicReport = async () => {
    setIsGeneratingDynamic(true)
    setStatusMessage(null)
    setErrorMessage(null)
    try {
      const payload = {
        entidad: dynamicEntity,
        metricas: dynamicMetrics,
        dimensiones: dynamicDimensions,
        filtros: {
          fecha_inicio: dynamicFrom || null,
          fecha_fin: dynamicTo || null,
        },
        formato: dynamicFormat,
      }
      const generatedReport = (await reportService.generateDynamicReport(payload, accessToken)) as Record<string, any>
      const generatedReportId = extractReportId(generatedReport)
      setStatusMessage(
        generatedReportId
          ? `Reporte dinamico generado con exito (ID ${generatedReportId}).`
          : 'Reporte dinamico generado con exito.',
      )
      await loadReportHistory({ page: 1 })
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo generar el reporte dinamico.'))
    } finally {
      setIsGeneratingDynamic(false)
    }
  }

  const handleStartRecording = async () => {
    setRecordingError(null)

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setRecordingError('Tu navegador no soporta transcripción de voz.')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = 'es-ES'
      recognition.interimResults = true
      recognition.continuous = true
      recognition.maxAlternatives = 1
      recognitionRef.current = recognition
      let finalTranscript = ''

      recognition.onresult = (event: any) => {
        let interim = ''
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
          } else {
            interim += result[0].transcript
          }
        }
        setInterimTranscript(interim)
        setTranscription(finalTranscript + interim)
      }

      recognition.onerror = () => {
        setRecordingError('Error al transcribir el audio.')
        setIsRecording(false)
      }

      recognition.onend = async () => {
        recognitionRef.current = null
        setIsRecording(false)

        const finalText = finalTranscript.trim()
        if (!finalText) {
          setRecordingError('No se detectó voz para transcribir.')
          return
        }
        setCustomMessage(finalText)
        await handleSendCustomReport(finalText)
      }

      recognition.start()
      setIsRecording(true)
    } catch {
      setRecordingError('No se pudo iniciar la transcripción de audio.')
    }
  }

  const handleStopRecording = () => {
    if (!recognitionRef.current) {
      setRecordingError('No hay transcripción activa.')
      return
    }

    setIsRecording(false)
    recognitionRef.current.stop()
  }

  const handleToggleRecording = async () => {
    if (isRecording) {
      handleStopRecording()
      return
    }
    await handleStartRecording()
  }

  const handleSendCustomReport = async (messageOverride?: string) => {
    const message = messageOverride ?? customMessage
    if (!message.trim()) {
      setErrorMessage('Ingresa el mensaje o transcripción para el reporte personalizado.')
      return
    }
    setIsSendingCustom(true)
    setStatusMessage(null)
    setErrorMessage(null)
    try {
      const payload = {
        mensaje: message.trim(),
        correo: userEmail,
        id_usuario: userId,
        rol: userRole,
        id_veterinaria: isSuperAdmin ? null : userVeterinariaId,
        formato: customFormat,
      }
      const response = await reportService.generateCustomReportWithWebhook(payload)
      if (!response.ok) {
        const messageResponse = await response.text()
        throw new Error(messageResponse || 'Error en el webhook de reportes personalizados.')
      }
      const contentType = response.headers.get('content-type') ?? ''
      const contentDisposition = response.headers.get('content-disposition') ?? ''
      if (contentType.includes('application/json') || contentType.startsWith('text/')) {
        const text = contentType.includes('application/json')
          ? await response.json().then((data) => JSON.stringify(data, null, 2))
          : await response.text()
        setTranscription(text)
        setStatusMessage('Reporte personalizado procesado. Revisa la respuesta.')
      } else {
        const blob = await response.blob()
        const extension = getExtensionFromContentType(contentType)
        const filename = extractFilenameFromContentDisposition(contentDisposition) || `reporte-personalizado-${Date.now()}.${extension}`
        downloadFile(blob, filename)
        setStatusMessage('Reporte personalizado descargado correctamente.')
      }
    } catch {
      setErrorMessage('No se pudo generar el reporte personalizado.')
    } finally {
      setIsSendingCustom(false)
    }
  }

  const handleGenerateCustomReportButton = async () => {
    await handleSendCustomReport()
  }

  const handleExportReport = async (id: string | number, formato: string) => {
    setStatusMessage(null)
    setErrorMessage(null)
    if (id === '' || id === null || id === undefined) {
      setErrorMessage('No se encontro un identificador valido para exportar este reporte.')
      return
    }
    try {
      const { blob, contentType, contentDisposition } = await reportService.exportReport(id, formato, accessToken)
      const extension = getExtensionFromContentType(contentType)
      const filename = extractFilenameFromContentDisposition(contentDisposition) || `reporte-${id}.${extension}`
      downloadFile(blob, filename)
      setStatusMessage(`Exportacion ${formato.toUpperCase()} descargada.`)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo exportar el reporte.'))
    }
  }

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  if (!canViewReports) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-10 text-center max-w-lg">
          <h2 className="text-2xl font-bold text-gray-900">Acceso denegado</h2>
          <p className="mt-3 text-gray-600">
            No tienes permisos para ver esta sección. Si crees que es un error, contacta con el administrador.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-2xl">
            <LayoutDashboard className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestionar reportes</h1>
            <p className="text-gray-500 mt-1">
              Consulta KPIs, genera reportes estáticos, dinámicos y personalizados.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoadingKpis
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border-none shadow-sm animate-pulse h-28" />
            ))
          : kpis.map((kpi, index) => {
              const Icon = (kpi.icon || Clock) as any
              const value = kpi.value ?? kpi.valor ?? kpi.count ?? '-'
              const label = kpi.label || kpi.nombre || kpi.titulo || Object.keys(kpi)[0]
              return (
                <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-purple-100">
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
                      <p className="text-2xl font-bold text-gray-900">{value}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Reportes estáticos</h2>
                <p className="text-sm text-gray-500">Selecciona un reporte y genera el formato deseado.</p>
              </div>
              <Badge className="bg-violet-50 text-violet-700 border-violet-100">Estático</Badge>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Reporte disponible</label>
                <Select value={staticReportType} onValueChange={setStaticReportType}>
                  <SelectTrigger className="h-12 w-full rounded-xl bg-gray-50 border-gray-200">
                    <SelectValue placeholder={isLoadingStatic ? 'Cargando...' : 'Selecciona un reporte'} />
                  </SelectTrigger>
                  <SelectContent>
                    {staticReports
                      .map((report, index) => {
                        const value = getReportOptionValue(report)
                        const label = getReportOptionLabel(report, value)
                        if (!value || String(value).trim() === '') return null
                        return { value: String(value), label, key: `${String(value)}-${index}` }
                      })
                      .filter(Boolean)
                      .map((option) => (
                        <SelectItem key={option!.key} value={option!.value}>
                          {option!.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Formato</label>
                  <Select value={staticFormat} onValueChange={setStaticFormat}>
                    <SelectTrigger className="h-12 w-full rounded-xl bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Formato" />
                    </SelectTrigger>
                    <SelectContent>
                      {staticFormatOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Desde</label>
                  <Input value={staticFrom} onChange={(e) => setStaticFrom(e.target.value)} type="date" className="h-12 rounded-xl bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Hasta</label>
                  <Input value={staticTo} onChange={(e) => setStaticTo(e.target.value)} type="date" className="h-12 rounded-xl bg-gray-50 border-gray-200" />
                </div>
              </div>

              {isSuperAdmin ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">ID Veterinaria (opcional)</label>
                  <Input
                    value={staticVeterinariaId}
                    onChange={(e) => setStaticVeterinariaId(e.target.value)}
                    placeholder="Dejar en blanco para nulo"
                    className="h-12 rounded-xl bg-gray-50 border-gray-200"
                  />
                </div>
              ) : null}

              <Button onClick={handleGenerateStaticReport} disabled={isGeneratingStatic || !staticReportType} className="w-full h-12 rounded-xl bg-purple-600 text-white hover:bg-purple-700">
                {isGeneratingStatic ? 'Generando...' : 'Generar reporte estático'}
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Reportes dinámicos</h2>
                <p className="text-sm text-gray-500">Elige entidad y métricas para generar un reporte controlado.</p>
              </div>
              <Badge className="bg-sky-50 text-sky-700 border-sky-100">Dinámico</Badge>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Entidad</label>
                <Select value={dynamicEntity} onValueChange={setDynamicEntity}>
                  <SelectTrigger className="h-12 w-full rounded-xl bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Entidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {dynamicEntityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Métricas</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-between rounded-xl bg-gray-50 border-gray-200 text-gray-900"
                    >
                      <span className="truncate text-left">
                        {getSelectionSummary(dynamicMetrics, dynamicReportConfig.metrics, dynamicMetricPlaceholder)}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 rounded-2xl border-gray-200 bg-white p-2 shadow-xl">
                    {dynamicReportConfig.metrics.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={dynamicMetrics.includes(option.value)}
                        onCheckedChange={(checked) => {
                          setDynamicMetrics((current) =>
                            Boolean(checked)
                              ? Array.from(new Set([...current, option.value]))
                              : current.filter((value) => value !== option.value),
                          )
                        }}
                        onSelect={(event) => event.preventDefault()}
                      >
                        {option.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-wrap gap-2">
                  {dynamicMetrics.map((value) => {
                    const option = dynamicReportConfig.metrics.find((item) => item.value === value)
                    return (
                      <Badge
                        key={value}
                        variant="outline"
                        className="gap-1 rounded-full border-gray-200 bg-gray-50 px-3 py-1 text-gray-700"
                      >
                        <span>{option?.label ?? value}</span>
                        <button
                          type="button"
                          className="inline-flex h-4 w-4 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                          onClick={() =>
                            setDynamicMetrics((current) => current.filter((item) => item !== value))
                          }
                          aria-label={`Quitar métrica ${option?.label ?? value}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Dimensiones</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-between rounded-xl bg-gray-50 border-gray-200 text-gray-900"
                    >
                      <span className="truncate text-left">
                        {getSelectionSummary(dynamicDimensions, dynamicReportConfig.dimensions, dynamicDimensionPlaceholder)}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 rounded-2xl border-gray-200 bg-white p-2 shadow-xl">
                    {dynamicReportConfig.dimensions.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={dynamicDimensions.includes(option.value)}
                        onCheckedChange={(checked) => {
                          setDynamicDimensions((current) =>
                            Boolean(checked)
                              ? Array.from(new Set([...current, option.value]))
                              : current.filter((value) => value !== option.value),
                          )
                        }}
                        onSelect={(event) => event.preventDefault()}
                      >
                        {option.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-wrap gap-2">
                  {dynamicDimensions.map((value) => {
                    const option = dynamicReportConfig.dimensions.find((item) => item.value === value)
                    return (
                      <Badge
                        key={value}
                        variant="outline"
                        className="gap-1 rounded-full border-gray-200 bg-gray-50 px-3 py-1 text-gray-700"
                      >
                        <span>{option?.label ?? value}</span>
                        <button
                          type="button"
                          className="inline-flex h-4 w-4 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                          onClick={() =>
                            setDynamicDimensions((current) => current.filter((item) => item !== value))
                          }
                          aria-label={`Quitar dimensión ${option?.label ?? value}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Desde</label>
                  <Input value={dynamicFrom} onChange={(e) => setDynamicFrom(e.target.value)} type="date" className="h-12 rounded-xl bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Hasta</label>
                  <Input value={dynamicTo} onChange={(e) => setDynamicTo(e.target.value)} type="date" className="h-12 rounded-xl bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Formato</label>
                  <Select value={dynamicFormat} onValueChange={setDynamicFormat}>
                    <SelectTrigger className="h-12 w-full rounded-xl bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Formato" />
                    </SelectTrigger>
                    <SelectContent>
                      {staticFormatOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerateDynamicReport}
                disabled={isGeneratingDynamic || dynamicMetrics.length === 0 || dynamicDimensions.length === 0}
                className="w-full h-12 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
              >
                {isGeneratingDynamic ? 'Generando...' : 'Generar reporte dinámico'}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Reportes personalizados</h2>
                <p className="text-sm text-gray-500">Envía una solicitud libre al webhook n8n con voz o texto.</p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">Personalizado</Badge>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Mensaje</label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Escribe aquí el mensaje del reporte personalizado"
                  className="min-h-[120px] rounded-xl bg-gray-50 border-gray-200"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Formato</label>
                  <Select value={customFormat} onValueChange={setCustomFormat}>
                    <SelectTrigger className="h-12 w-full rounded-xl bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Formato" />
                    </SelectTrigger>
                    <SelectContent>
                      {staticFormatOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Enviar por voz</label>
                  <Button
                    onClick={handleToggleRecording}
                    disabled={isSendingCustom || !canRecordAudio}
                    className={`h-12 w-full rounded-xl ${isRecording ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    {isRecording ? 'Detener y enviar' : 'Grabar audio'}
                  </Button>
                </div>
              </div>

              {(interimTranscript || transcription || recordingError) && (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Transcripción</p>
                  <p className="whitespace-pre-line text-sm text-gray-600">{interimTranscript || transcription || recordingError}</p>
                </div>
              )}

              <Button onClick={handleGenerateCustomReportButton} disabled={isSendingCustom} className="w-full h-12 rounded-xl bg-purple-600 text-white hover:bg-purple-700">
                {isSendingCustom ? 'Enviando...' : 'Enviar reporte personalizado'}
              </Button>
            </div>
          </div>

          {(statusMessage || errorMessage) && (
            <div className={`rounded-3xl p-4 ${errorMessage ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
              {errorMessage ?? statusMessage}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 flex-1">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Buscar</label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cliente, mascota o código"
                className="h-12 rounded-xl bg-gray-50 border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Estado</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-12 w-full rounded-xl bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="proceso">En proceso</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                  <SelectItem value="fallido">Fallido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Tipo</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-12 w-full rounded-xl bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="citas">Citas</SelectItem>
                  <SelectItem value="servicios">Servicios</SelectItem>
                  <SelectItem value="pedidos">Pedidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Formato</label>
              <Select value={historyFormat} onValueChange={setHistoryFormat}>
                <SelectTrigger className="h-12 w-full rounded-xl bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleApplyFilters} className="h-12 rounded-xl bg-purple-600 text-white hover:bg-purple-700">
              Aplicar filtros
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setSelectedStatus('todos')
                setSelectedType('todos')
                setHistoryFrom('')
                setHistoryTo('')
                setHistoryFormat('todos')
                void loadReportHistory({ page: 1 })
              }}
              className="h-12 rounded-xl border-gray-200"
            >
              Limpiar filtros
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Desde</label>
            <Input value={historyFrom} onChange={(e) => setHistoryFrom(e.target.value)} type="date" className="h-12 rounded-xl bg-gray-50 border-gray-200" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Hasta</label>
            <Input value={historyTo} onChange={(e) => setHistoryTo(e.target.value)} type="date" className="h-12 rounded-xl bg-gray-50 border-gray-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Historial de reportes</h2>
            <p className="text-sm text-gray-500">Registros generados desde backend.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span>{historyInfo.count} resultados</span>
            {isLoadingHistory && <span>Cargando...</span>}
          </div>
        </div>
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-none">
              <TableHead className="font-bold text-gray-500 py-4">ID</TableHead>
              <TableHead className="font-bold text-gray-500">Tipo</TableHead>
              <TableHead className="font-bold text-gray-500">Fecha</TableHead>
              <TableHead className="font-bold text-gray-500">Estado</TableHead>
              <TableHead className="font-bold text-gray-500">Formato</TableHead>
              <TableHead className="font-bold text-gray-500">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportHistory.length === 0 && !isLoadingHistory ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-gray-500">
                  No hay reportes en el historial.
                </TableCell>
              </TableRow>
            ) : (
              reportHistory.map((report) => {
                const reportId = extractReportId(report)
                const reportType = report.tipo || report.nombre || report.tipo_reporte || 'N/A'
                const reportDate = report.fecha || report.created_at || report.fecha_generacion || 'N/A'
                const reportState = report.estado || report.status || 'N/A'
                const reportFormat = report.formato || report.format || 'N/A'
                return (
                  <TableRow key={reportId || `${reportType}-${reportDate}`} className="hover:bg-gray-50/50 border-gray-100">
                    <TableCell className="font-medium text-gray-900 py-4">{reportId || 'Sin ID'}</TableCell>
                    <TableCell className="text-gray-600">{reportType}</TableCell>
                    <TableCell className="text-gray-600">{reportDate}</TableCell>
                    <TableCell>
                      <Badge className="rounded-full px-3 py-1 font-medium bg-gray-100 text-gray-700">
                        {reportState}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{reportFormat}</TableCell>
                    <TableCell className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => void handleExportReport(reportId, 'pdf')}
                        disabled={!reportId || reportState === 'ERROR'}
                        className="h-10 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                      >
                        PDF
                      </Button>
                      <Button
                        onClick={() => void handleExportReport(reportId, 'excel')}
                        disabled={!reportId || reportState === 'ERROR'}
                        className="h-10 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                      >
                        Excel
                      </Button>
                      <Button
                        onClick={() => void handleExportReport(reportId, 'html')}
                        disabled={!reportId || reportState === 'ERROR'}
                        className="h-10 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                      >
                        HTML
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row items-center justify-between">
        <div className="text-sm text-gray-500">{historyInfo.count} reportes en el historial</div>
        <div className="flex gap-2">
          <Button disabled={!historyInfo.previous || isLoadingHistory} onClick={() => void handlePageChange(historyInfo.previous)} className="h-12 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200">
            Anterior
          </Button>
          <Button disabled={!historyInfo.next || isLoadingHistory} onClick={() => void handlePageChange(historyInfo.next)} className="h-12 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200">
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
