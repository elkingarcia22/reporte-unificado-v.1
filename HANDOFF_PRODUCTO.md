# Handoff a Desarrollo: Sistema Unificado de Generación y Descarga de Reportes de Talento

## 1. Resumen ejecutivo

| Aspecto | Detalle |
|---------|---------|
| **Funcionalidad** | Sistema unificado de generación, descarga y gestión de reportes de evaluación de talento (360°, Objetivos, Análisis Matriz) |
| **Módulo** | Sistema de reportes - Drawer modal flotante + Panel de descargas + Historial |
| **Objetivo** | Permitir generar reportes individuales y masivos de evaluación de talento con interfaz unificada, progreso de descarga y gestión de historial |
| **Usuario impactado** | PM, Head de People, Managers, Analistas de talento que necesitan generar, descargar y gestionar reportes |
| **Resultado esperado** | Flujo completo: Seleccionar análisis → Generar reporte (individual/masivo) → Descargar → Gestionar historial |
| **Estado de entrega** | **Prototipo funcional avanzado** - 85% construido, mockeado, en fase de refinamiento visual y flujos |
| **Versión** | 1.0 - Aplicable a S1 2025 (Analysis ID 1), S2 2024 (Analysis ID 2), y plantilla para otros análisis |

---

## 2. Contexto del problema

**Problema principal:** 
Los usuarios necesitaban generar, descargar y gestionar múltiples tipos de reportes de evaluación de talento (individuales, masivos, análisis matriz) sin tener una interfaz unificada, clara ni con visibilidad del progreso de descarga.

**Usuario afectado:**
- **Primario:** Head de People, PM de talento
- **Secundario:** Managers, analistas que generan reportes para tomar decisiones de retención y desarrollo

**Dolor actual:**
1. Flujos dispersos para reportes individuales vs. masivos
2. Sin visibilidad del progreso en descargas
3. Sin historial accesible de reportes descargados
4. Falta claridad en validaciones y errores

**Valor esperado:**
1. Generación rápida de reportes en múltiples formatos
2. Control visual del progreso y estado
3. Gestión fácil del historial de descargas (últimos 7 días)
4. Errores claros y acciones de recuperación obvias

---

## 3. Alcance

### 3.1 Dentro del alcance

| Elemento | Descripción | Evidencia | Prioridad |
|----------|-------------|-----------|-----------|
| **Generación Individual** | Seleccionar 1 colaborador → generar reporte personalizado con pesos (360°: 50%, Objetivos: 50%) | App.tsx:209-280, `reportType === 'Individual'` | 🔴 CRÍTICA |
| **Generación Masiva** | Seleccionar alcance (Todos, Área, Líder, País, Ciudad) → generar ZIP con reportes múltiples | App.tsx:253-258, `startMassiveDownload()` | 🔴 CRÍTICA |
| **Panel de Descargas Flotante** | Mostrar progreso (0-100%), estado (downloading/completed/error), listar reportes en descarga | App.tsx:31, `downloadingReports` state | 🔴 CRÍTICA |
| **Historial de Descargas** | Mostrar últimos 7 días, filtrar automáticamente, persistir en sesión | App.tsx:132-137, `getRecentDownloadHistory()` | 🟡 ALTA |
| **Validaciones** | Campo colaborador requerido (Individual), alcance requerido (Masivo), pesos = 100% | App.tsx:209-229 | 🔴 CRÍTICA |
| **Estados de Error** | Demo mode: fallo en generación (ID análisis 2), fallo en descarga (85%), fallo en abrir carpeta | App.tsx:239-251, `isErrorDemoMode` | 🟡 ALTA |
| **Notificaciones** | Toast + notificación error flotante auto-dismiss 4s, con acción de reintento | App.tsx:34-72 | 🟡 ALTA |
| **Vista Previa PDF** | Abrir reporte individual en nueva pestaña con componente `VistaPreviaPdfReporteEjecutivoFinalNuevoAzul0C5Bef` | App.tsx:261, `?pdf-preview=true` | 🟢 MEDIA |
| **Tabs en Drawer** | "Generar reporte" (formulario) y "Descargas" (lista progreso + historial) | App.tsx:10, `activeDrawerTab` | 🔴 CRÍTICA |
| **Contador de reportes en cola** | Mostrar "N reportes en cola" cuando hay descargas activas | App.tsx:29, `reportsInQueue` | 🟢 MEDIA |
| **Búsqueda de colaboradores** | Autocompletar con filtrado, sugerencias dropdown | App.tsx:139-143, `filteredColaboradores` | 🟡 ALTA |
| **Minimizar/Expandir Panel Descargas** | Minimizar a icono flotante, expandir para ver detalle | App.tsx:25, `isDownloadMinimized` | 🟢 MEDIA |

### 3.2 Fuera del alcance

| Elemento | Motivo | Posible fase futura |
|----------|--------|---------------------|
| **Integración backend real** | Actualmente mockeado en cliente, simulación de progreso | Fase 2: API REST para generación asíncrona |
| **Persistencia base de datos** | Historial solo en sesión (localStorage posible) | Fase 2: BD para historial permanente |
| **Notificaciones en tiempo real** | Sin WebSocket, sin Server-Sent Events | Fase 2: Push real de progreso |
| **Exportar a formatos múltiples** | Solo PDF y ZIP, sin XLSX/CSV | Fase 3: Exportación múltiple |
| **Análisis de matriz detallado** | Componente VistaResultadosMatriz importado pero no integrado en flujo principal | Fase 2: Integración en flujo "AnalisisMatriz" |
| **Reportes con IA** | Botón "Analizar con IA" en VistaResultadosMatriz existe pero no funciona | Fase 2: Integración con API IA |
| **Permisos granulares por rol** | Sin diferenciación de permisos (todos ven todos los análisis) | Fase 2: RBAC backend |
| **Descargas concurrentes múltiples** | Funciona, pero no optimizado para 100+ reportes simultáneos | Fase 3: Optimización backend |

### 3.3 Supuestos

1. ✅ **Análisis mockeados:** Los datos de análisis (lista, participantes, pesos) se cargan como constantes en el cliente. No hay API backend aún.
2. ✅ **Colaboradores en memoria:** Lista de 10 colaboradores hardcodeados en App.tsx:95-106. Búsqueda en cliente.
3. ⚠️ **PDF estático:** La vista previa abre siempre el mismo PDF de ejemplo (`VistaPreviaPdfReporteEjecutivoFinalNuevoAzul0C5Bef`). Personalización por usuario por confirmar.
4. ⚠️ **Error demo mode:** La lógica de fallo se activa solo si `selectedAnalysisId === 2`. Esto es para testing. **Por confirmar:** ¿se mantiene este comportamiento en producción o se reemplaza con lógica real?
5. ✅ **Historial no persiste:** Al cerrar el sitio se pierde el historial. **Por confirmar:** ¿guardar en localStorage?
6. ⚠️ **Pesos fijos 50/50:** La UI muestra inputs para 360° y Objetivos, pero el total siempre debe ser 100%. **Por confirmar:** ¿debería ser un slider unificado o dos inputs validados?

---

## 4. Artefactos y evidencias

| Artefacto | Descripción | Ubicación | Tipo |
|-----------|-------------|-----------|------|
| **Componente App principal** | Lógica central: estado, validaciones, flujos, handlers | `/src/app/App.tsx` (2470 líneas) | Componente React |
| **Vista PDF Individual** | Reporte ejecutivo de talento (Valentina Mendoza) generado desde Figma | `/src/imports/VistaPreviaPdfReporteEjecutivoFinalNuevoAzul0C5Bef/VistaPreviaPdfReporteEjecutivoFinalNuevoAzul0C5Bef.tsx` | Componente React |
| **Vista Matriz Resultados** | Matriz de talento con header, filtros, tabla de resultados | `/src/imports/VistaResultadosMatriz/VistaResultadosMatriz.tsx` | Componente React |
| **UI Kit shadcn** | 50+ componentes base (Tabs, Drawer, Button, Input, etc.) | `/src/app/components/ui/` | Componentes Radix UI |
| **Figma Design File** | Diseños de todas las pantallas (por confirmar URL) | TBD | Design System |
| **GitHub Commits** | Historial de cambios: 20+ commits sobre flujos de descarga, validaciones, UI refinements | https://github.com/elkingarcia22/reporte-unificado-v.1.git | Git history |
| **Figma Make** | Proyecto Figma original exportado a React | `/src/main.tsx` + package.json (Figma Make) | Generado desde Figma |

---

## 5. Estado real de lo construido

| Elemento | Estado | Evidencia | Implicación para desarrollo |
|----------|--------|-----------|------------------------------|
| **Drawer modal floante** | ✅ Construido | App.tsx:47-420 (renderizado condicionalmente), Radix UI `<Sheet/>` | Listo, requiere pulir animaciones y z-index |
| **Tabs generar/descargas** | ✅ Construido | App.tsx:10 `activeDrawerTab`, componentes Radix `<Tabs/>` | Funcional, validación de transiciones por confirmar |
| **Búsqueda colaboradores** | ✅ Mockeado | App.tsx:95-106 (10 colaboradores), App.tsx:139-143 (filtrado cliente) | Reemplazar con API cuando esté lista |
| **Selección individual** | ✅ Construido | App.tsx:14-15 (`selectedColaborador`, `setSelectedColaborador`) | Listo, validación de error mostrada OK |
| **Selección masiva (alcance)** | ✅ Mockeado | App.tsx:11 (`alcance`), App.tsx:109-130 (`getColaboradoresCount()`) | Funcional client-side, backend TBD |
| **Sliders pesos 360/Objetivos** | ✅ Construido | App.tsx:12-13, validación automática línea 148 (`hasPesoError`) | Funcional pero UI necesita refinement |
| **Generación reporte (click)** | ✅ Construido | App.tsx:209-281 (`handleGenerateReport`) | Simulación 1.5s, reemplazar con API real |
| **Panel descargas con progreso** | ✅ Construido | App.tsx:23-26, App.tsx:301-333 (loop de progreso) | Simulación +1% cada 300ms, lógica OK |
| **Estados downloading/completed/error** | ✅ Construido | App.tsx:31 (`downloadingReports`), estados en componentes | Lógica funcional, UI visual por confirmar |
| **Historial últimos 7 días** | ✅ Construido | App.tsx:32, App.tsx:132-137 (`getRecentDownloadHistory`) | Filtrado OK, pero sin persistencia |
| **Error demo mode** | ✅ Construido | App.tsx:93, App.tsx:239-251, App.tsx:305-306 | Para testing, no mantener en producción |
| **Notificación error auto-dismiss** | ✅ Construido | App.tsx:34-72 (`useEffect` 4s timeout) | Funcional con sonner toast |
| **PDF preview en nueva pestaña** | ✅ Construido | App.tsx:261 (`window.open('?pdf-preview=true')`) | Abre modo PDF, componente VistaPreviaPdf cargado |
| **Minimizar/maximizar descargas** | ✅ Construido | App.tsx:25 (`isDownloadMinimized`) | Lógica estado OK, icono flotante por confirmar |
| **Análisis lista (dropdown)** | ✅ Mockeado | App.tsx:423-434 (`analysisList`) | Mostrado en tabla, click abre drawer |
| **Contador reportes en cola** | ✅ Construido | App.tsx:29 (`reportsInQueue`) | Mostrado en tab "Descargas", lógica correcta |
| **Validación colaborador (Individual)** | ✅ Construido | App.tsx:215-217, línea 19 (`showColaboradorError`) | Valida, muestra error visual |
| **Validación alcance (Masivo)** | ✅ Construido | App.tsx:221-224, línea 20 (`showAlcanceFieldError`) | Valida, muestra error visual |
| **Validación pesos = 100%** | ✅ Construido | App.tsx:148, línea 226-228 (`hasPesoError`) | Bloquea generación, muestra error inline |
| **Reintento en descarga fallida** | ✅ Construido | App.tsx:355-378 (`handleRetryReport`) | Reinicia progreso, reintenta OK |
| **Abrir carpeta descargas** | ✅ Mockeado | App.tsx:343-352 (`handleOpenFolder`) | Simula error 35% en demo mode |
| **Vista Resultados Matriz** | ⚠️ Importado pero no integrado | `/src/imports/VistaResultadosMatriz/` | Existe componente, flujo `reportType === 'AnalisisMatriz'` no implementado |
| **Análisis con IA** | ❌ No funciona | VistaResultadosMatriz.tsx línea 33-50 (botón existe) | Botón renderizado pero sin handler |

---

## 6. Historia de usuario

### 6.1 HU Principal

**Título:** "Como Head de People, quiero generar un reporte individual de evaluación de talento para tomar decisiones basadas en datos sobre retención y desarrollo"

**Actores:** Head de People, PM de talento  
**Precondiciones:** Usuario autenticado, análisis disponibles (S1 2025, S2 2024, etc.)  
**Trigger:** Click en análisis → Drawer se abre

**Flujo Happy Path:**
1. Usuario ve lista de análisis disponibles (tabla en pantalla principal)
2. Click en análisis → Drawer "Reporte unificado" se abre
3. Por defecto en tab "Generar reporte"
4. Selecciona tipo: "Individual" (por defecto)
5. Busca y selecciona colaborador (ej: "Elkin Garcia Salazar")
6. Ve pesos automáticos: 360° 50%, Objetivos 50% (total 100% ✓)
7. Click "Generar reporte" → Simulación 1.5s
8. Automáticamente salta a tab "Descargas"
9. Ve descarga completada en lista con ✓ icono
10. Click "Ver reporte" abre PDF en nueva pestaña
11. Cierra pestaña o drawer → reporta completado en historial

**Resultado esperado:** Usuario tiene acceso al PDF descargado, puede revisar evaluación

---

### 6.2 HU Secundaria: Reporte Masivo

**Título:** "Como Head de People, quiero generar reportes masivos para todas las áreas de Tech evaluadas en el análisis"

**Precondiciones:** Análisis disponible, alcance seleccionable

**Flujo Happy Path:**
1. Análisis seleccionado, Drawer abierto, tipo "Masivo"
2. Alcance por defecto: "Todos los colaboradores en el análisis"
3. Click "Generar reporte" → Simulación descarga progresiva
4. Ver lista de reportes descargándose (progreso por línea)
5. Progreso avanza: 0% → 50% → 100%
6. Estado cambia: "downloading" → "completed"
7. ZIP descargado en cliente
8. Cierra drawer, historial persiste hasta cierre de sesión

**Resultado esperado:** ZIP con reportes de ~50-200 colaboradores descargado

---

### 6.3 HU Terciaria: Gestionar historial

**Título:** "Como usuario, quiero ver mis últimos reportes descargados para reutilizarlos sin regenerar"

**Precondiciones:** Reportes descargados en sesión actual

**Flujo Happy Path:**
1. Abre Drawer → tab "Descargas"
2. Sección "Historial de últimos 7 días"
3. Lista muestra: Nombre reporte, fecha, # colaboradores
4. Click "Descargar nuevamente" o "Abrir" → Abre carpeta/archivo
5. Filtro automático: solo últimos 7 días

**Resultado esperado:** Acceso rápido a reportes previos

---

## 7. Criterios de aceptación

| ID | Criterio | Prioridad | Cómo validar |
|----|----------|-----------|-------------|
| **CA-1** | Generar reporte individual: seleccionar colaborador, pesos validados (100%), PDF abierto | 🔴 CRÍTICA | QA: seleccionar "Valentina Mendoza", generar, confirmar pestaña nueva con PDF |
| **CA-2** | Validación: sin colaborador → mostrar error "Campo requerido" en rojo | 🔴 CRÍTICA | QA: click generar sin colaborador, error visible inmediatamente |
| **CA-3** | Generar reporte masivo: seleccionar alcance, mostrar progreso 0-100%, completar | 🔴 CRÍTICA | QA: tipo Masivo, alcance "Todos", click generar, progreso visible, completar al 100% |
| **CA-4** | Descarga completada muestra en "Descargas" tab con estado ✓ completed | 🔴 CRÍTICA | QA: post-generación, verify row rendered en downloadingReports list |
| **CA-5** | Historial: mostrar solo reportes últimos 7 días, auto-filtrado | 🟡 ALTA | QA: generar reporte, cerrar drawer, reabrirse, historial visible, fecha check |
| **CA-6** | Error notificación: auto-dismiss en 4s, mostrar titulo + mensaje + action | 🟡 ALTA | QA: trigger error (análisis ID 2), verify notif visible, timeout dismiss |
| **CA-7** | Reintento fallido: click "Reintentar", progreso vuelve a 0%, reinicia descarga | 🟡 ALTA | QA: estado error, click retry, progreso incrementa de nuevo |
| **CA-8** | Pesos: total !== 100% → botón "Generar" deshabilitado + error visual | 🟡 ALTA | QA: cambiar 360° a 60%, total 110%, validación inline, botón disabled |
| **CA-9** | Búsqueda colaboradores: typing "Elkin" muestra sugerencias, click selecciona | 🟡 ALTA | QA: search field, type "Elkin", dropdown aparece, click selecciona |
| **CA-10** | Minimizar panel descargas: icono flotante, click expande, full panel reappears | 🟢 MEDIA | QA: panel visible, minimize button, icono flotante visible, click expande |
| **CA-11** | Contador en queue: "2 reportes en cola" en tab "Descargas" cuando hay descargas activas | 🟢 MEDIA | QA: generar 2 reportes masivos simultáneamente, contador muestra "2" |
| **CA-12** | PDF preview: `?pdf-preview=true` modo abre componente full-screen sin drawer | 🟢 MEDIA | QA: click "Ver reporte", new tab opens, PDF visible, no drawer |
| **CA-13** | Cerrar drawer: campos se resetean (colaborador, alcance, pesos 50/50) | 🟢 MEDIA | QA: open drawer, seleccionar colaborador, close, reopen, colaborador = "" |
| **CA-14** | Análisis ID 2 (S2 2024): generación falla 50%, muestra error "No pudimos generar" | 🟢 MEDIA | QA: select Analysis ID 2, generate individual, error notification appears |
| **CA-15** | Tabs funcionan: click "Generar reporte" ↔ "Descargas", contenido cambia | 🔴 CRÍTICA | QA: click tabs, verify active state changes, content renders correctly |

---

## 8. Descripción de la solución diseñada

### 8.1 Arquitectura general

```
┌─────────────────────────────────────────────────────────────────┐
│                   APP.TSX (Componente Principal)                │
│ • Estado unificado: pesos, alcance, reportes, historial        │
│ • Handlers: generar, descargar, validar, reintento             │
│ • Lógica: filtrado, conteo, demo error mode                    │
└────────────────────┬────────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌─────────┐ ┌──────────┐ ┌────────────────┐
   │  Drawer │ │   Tabs   │ │ Modal Análisis │
   │ Modal   │ │ (2 tabs) │ │     (List)     │
   └────┬────┘ └────┬─────┘ └────────────────┘
        │           │
        ├─ Tab 1 ───┤
        │ Generar   │ Formulario: tipo, colaborador/alcance, pesos
        │           │
        ├─ Tab 2 ───┤
        │ Descargas │ Progreso: downloading items + historial 7d
        │           │
        └───────────┘
              │
              ▼
    ┌──────────────────────────┐
    │ Panel Flotante Descargas │
    │ (minimizable/expandible) │
    └──────────────────────────┘
```

### 8.2 Flujos principales

**Flujo 1: Generar Reporte Individual**
```
Seleccionar análisis (dropdown)
  ↓
Drawer abre → Tab "Generar reporte"
  ↓
Seleccionar tipo "Individual"
  ↓
Search + select colaborador
  ↓
Validar: colaborador selected? sí → continue, no → show error
  ↓
Click "Generar"
  ↓
Simulación 1.5s (await 1500ms)
  ↓
Check error mode: análisis ID 2 → fail → error notification
  ↓
Éxito: abrir PDF nueva pestaña + mostrar en "Descargas" (100% completed)
  ↓
Historial auto-agregado
```

**Flujo 2: Generar Reporte Masivo**
```
Seleccionar análisis
  ↓
Drawer abre → "Generar reporte"
  ↓
Tipo "Masivo"
  ↓
Alcance opciones: Todos / Área / Líder / País / Ciudad
  ↓
Si alcance !== "Todos": seleccionar valores en multi-select
  ↓
Validar: campo completo? sí → continue, no → error
  ↓
Click "Generar"
  ↓
Saltar a "Descargas" tab
  ↓
Simular descarga: progress += 1% cada 300ms
  ↓
Error mode check (85%+ progreso) → puede fallar
  ↓
Completado → "completed" status, ZIP listo
  ↓
Historial actualizado
```

**Flujo 3: Gestionar Historial**
```
Tab "Descargas" abierto
  ↓
Sección superior: reportes en descarga (downloading/completed/error)
  ↓
Sección inferior: historial últimos 7 días
  ↓
Si error en descarga: botón "Reintentar"
  ↓
Si completado: botón "Ver" o "Descargar nuevamente"
  ↓
Minimizar panel: solo icono flotante visible
  ↓
Click icono: panel expande
```

### 8.3 Decisiones de diseño clave

1. **Drawer modal único:** En lugar de múltiples diálogos, 1 drawer reutilizable con tabs reduce complejidad visual
2. **Salto automático a "Descargas":** Después de generar, el sistema lleva al usuario automáticamente al tab activo para ver progreso
3. **Progreso simulado client-side:** Sin backend real, incremento +1% cada 300ms da sensación de trabajo real
4. **Historial sin persistencia:** En sesión actual solamente (localStorage es mejora futura)
5. **Demo error mode:** Analysis ID 2 fuerza fallos para testing UX de recuperación
6. **Pesos fijos 50/50:** No hay UI para cambiar, pero inputs existen para futura flexibilidad
7. **Minimizable panel:** Permite trabajar con drawer y descargas simultáneamente sin obstaculizar pantalla

---

## 9. Pantallas y componentes involucrados

| Pantalla/Componente | Función | Estado | Evidencia | Notas |
|-------------------|---------|--------|-----------|-------|
| **App.tsx Main** | Vista principal: lista análisis en tabla | ✅ Construido | App.tsx:422-446 (`showAnalysisList`) | Clickeable, abre drawer |
| **App.tsx Drawer** | Modal flotante: formulario + tabs | ✅ Construido | Sheet Radix UI, App.tsx:47-420 | Responsivo, animado |
| **Tab: Generar Reporte** | Formulario con búsqueda, tipo, alcance, pesos | ✅ Construido | App.tsx:150-207 | Inputs + validaciones |
| **Tab: Descargas** | Progreso descarga + historial | ✅ Construido | App.tsx:23-32 (estado) | Dos secciones |
| **Search Colaboradores** | Input + dropdown sugerencias | ✅ Mockeado | App.tsx:139-143 | Autocomplete funcional |
| **Sliders Pesos** | 360° y Objetivos (50% cada uno) | ✅ Construido | Input range o Radix Slider | Validación automática |
| **Panel Flotante Descargas** | Minimizable, muestra progreso actual | ✅ Construido | App.tsx:25-26 | Icono + expand |
| **VistaPreviaPdf** | Componente reporte individual en PDF | ✅ Construido | VistaPreviaPdfReporteEjecutivoFinalNuevoAzul0C5Bef.tsx | 2470 líneas, estático |
| **VistaResultadosMatriz** | Matriz resultados análisis | ⚠️ Importado, no integrado | VistaResultadosMatriz.tsx | Para flujo `reportType === 'AnalisisMatriz'` futura |
| **Error Notification** | Toast notificación error auto-dismiss | ✅ Construido | Sonner + App.tsx:34-72 | 4s timeout |
| **Button "Generar"** | Trigger generación (con validación) | ✅ Construido | Radix Button | Disabled si validación falla |
| **Button "Minimizar"** | Minimiza panel descargas | ✅ Construido | App.tsx:25 | Icono flotante |

---

## 10. Flujos funcionales

### 10.1 Happy Path: Generar Individual

| # | Actor | Acción | Respuesta del sistema |
|---|-------|--------|----------------------|
| 1 | Usuario | Ve lista análisis, click "Análisis Q1 2025" | Drawer abre, tab "Generar reporte" por defecto |
| 2 | Usuario | Tipo "Individual" ya seleccionado | Tab muestra inputs: buscar colaborador, pesos |
| 3 | Usuario | Type "Elkin" en search | Dropdown muestra sugerencias (Elkin Garcia Salazar) |
| 4 | Usuario | Click "Elkin Garcia Salazar" | Campo rellenado, error `showColaboradorError` = false |
| 5 | Usuario | Ve pesos: 360° 50%, Objetivos 50%, total 100% ✓ | Botón "Generar" enabled |
| 6 | Usuario | Click "Generar reporte" | Sistema: validation check → todo OK → `setIsGeneratingPdf(true)` |
| 7 | Sistema | Simular generación 1.5s | Loading spinner visible, botón disabled |
| 8 | Sistema | Completado 1.5s | Abrir PDF: `window.open('?pdf-preview=true', '_blank')` |
| 9 | Sistema | Automáticamente saltar a "Descargas" tab | Tab activo = "descargas" |
| 10 | Usuario | Ver reporte en lista "Descargas en progreso" | Row: nombre "Elkin Garcia Salazar", status "✓ completed", progreso 100% |
| 11 | Usuario | Cerra drawer | Estado reseteado (colaborador = '', pesos = 50/50) |
| 12 | Usuario | Reabrir drawer → tab "Descargas" | Reporte visible en "Historial últimos 7 días" |

### 10.2 Flujo Alternativo: Validación fallida (sin colaborador)

| # | Actor | Acción | Respuesta del sistema |
|---|-------|--------|----------------------|
| 1 | Usuario | Tipo "Individual", NO selecciona colaborador | Campo vacío |
| 2 | Usuario | Click "Generar reporte" sin colaborador | Sistema: `if (reportType === 'Individual' && !selectedColaborador)` |
| 3 | Sistema | Validación falla | `setShowColaboradorError(true)` |
| 4 | Usuario | Ve error visual debajo del search field | Mensaje rojo: "Por favor selecciona un colaborador" |
| 5 | Sistema | NO abre PDF, NO entra a descargas | Formulario mantiene focus, espera input válido |
| 6 | Usuario | Selecciona colaborador | Error desaparece, botón habilita |

### 10.3 Flujo Alternativo: Generación falla (Error Demo Mode)

| # | Actor | Acción | Respuesta del sistema |
|---|-------|--------|----------------------|
| 1 | Usuario | Selecciona "Análisis Q2 2024" (ID 2) | `selectedAnalysisId = 2` |
| 2 | Usuario | Llena individual, click "Generar" | Sistema: `isErrorDemoMode = true` |
| 3 | Sistema | Simula 1.5s | Loading visible |
| 4 | Sistema | Completado 1.5s, genera error lógico | `setErrorNotification({ title: "No pudimos generar...", message: "Algo salió mal" })` |
| 5 | Usuario | Ve notificación error flotante | Toast + error panel con "Intentar de nuevo" |
| 6 | Usuario | Click "Intentar de nuevo" | Sistema llama `handleGenerateReport()` nuevamente |
| 7 | Sistema | 2º intento: puede fallar de nuevo (error demo mode) | Comportamiento repetible para testing |
| 8 | Sistema | Auto-dismiss notificación en 4s | Si usuario no hace clic, desaparece |

### 10.4 Flujo Alternativo: Masivo con alcance

| # | Actor | Acción | Respuesta del sistema |
|---|-------|--------|----------------------|
| 1 | Usuario | Tipo "Masivo" | Alcance por defecto: "Todos los colaboradores" |
| 2 | Usuario | Click alcance "Todos" (mantiene por defecto) | Desactiva campo multi-select, muestra "Todos (10 colaboradores)" |
| 3 | Usuario | O: selecciona "Área" | Multi-select activo, opciones: Tecnología, Ventas, Marketing, RH, Operaciones |
| 4 | Usuario | Check "Tecnología" | Muestra "Área: Tecnología (5 colaboradores)" |
| 5 | Usuario | Click "Generar reporte" | Sistema: count = 5, `getColaboradoresCount('Área', ['Tecnología'])` |
| 6 | Sistema | Simula descargas | Tab "Descargas" → progreso 0-100% |
| 7 | Sistema | Completado | Row: "Reporte_Masivo_[timestamp].zip", 5 colaboradores, ✓ completed |
| 8 | Usuario | ZIP disponible (descargado o accesible) | "Abrir carpeta" button disponible |

### 10.5 Flujo Alternativo: Descarga falla, reintento

| # | Actor | Acción | Respuesta del sistema |
|---|-------|--------|----------------------|
| 1 | Usuario | Masivo generación en progreso | Panel flotante: reportes downloading |
| 2 | Sistema | Progresa 85%, trigger error random | Status = "error", no continua a 100% |
| 3 | Usuario | Ve row con status rojo: ❌ error | "Reintentar" button visible |
| 4 | Usuario | Click "Reintentar" | Sistema: `handleRetryReport(reportId)` |
| 5 | Sistema | Reset progress a 0%, status = "downloading" | Reinicia loop de progreso |
| 6 | Sistema | 2º intento completa exitosamente (error demo desactiva) | Progress 100%, status = "completed" |
| 7 | Usuario | Ve row actualizado con ✓ | Descarga completada |

### 10.6 Flujo Alternativo: Minimizar panel descargas

| # | Actor | Acción | Respuesta del sistema |
|---|-------|--------|----------------------|
| 1 | Usuario | Panel flotante visible, descarga en progreso | Muestra lista completa de reportes |
| 2 | Usuario | Click botón minimizar (↓ icono) | Panel colapsa a icono flotante 50x50px |
| 3 | Usuario | Puede trabajar en drawer sin obstaculización visual | Icono flotante en esquina (bottom-right?) |
| 4 | Usuario | Click icono flotante | Panel expande nuevamente |
| 5 | Usuario | Ver progreso actualizado | Estado persiste (si aún downloading, muestra % nuevo) |

---

## 11. Reglas de negocio

| ID | Regla | Aplica a | Prioridad | Responsable |
|----|-------|----------|-----------|-------------|
| **RN-1** | Pesos 360° + Objetivos deben sumar exactamente 100% | Generación Individual | 🔴 CRÍTICA | Backend (validación) |
| **RN-2** | Reporte Individual = 1 colaborador seleccionado | Generación Individual | 🔴 CRÍTICA | Sistema (validación) |
| **RN-3** | Reporte Masivo = múltiples colaboradores por filtro (Todos/Área/Líder/País/Ciudad) | Generación Masivo | 🔴 CRÍTICA | Sistema (conteo) |
| **RN-4** | Alcance "Todos los colaboradores" = incluir 100% base | Generación Masivo | 🟡 ALTA | PM/Data |
| **RN-5** | Historial mostrar solo últimos 7 días desde fecha descarga | Gestión Historial | 🟡 ALTA | Sistema (filtro temporal) |
| **RN-6** | Reporte Individual abre en nueva pestaña con PDF | Generación Individual | 🟡 ALTA | Sistema (window.open) |
| **RN-7** | Reporte Masivo descargado como ZIP | Generación Masivo | 🟡 ALTA | Backend (formato) |
| **RN-8** | Validación errores: mostrar antes de enviar a backend | Validación | 🟡 ALTA | Frontend (UX) |
| **RN-9** | Notificación error auto-dismiss en 4 segundos | Manejo error | 🟡 ALTA | Sistema (timeout) |
| **RN-10** | Reintento descarga fallida: reset progress a 0% | Recuperación | 🟡 ALTA | Sistema (reset) |
| **RN-11** | Contador "N reportes en cola" solo visible si N > 0 | UI/UX | 🟢 MEDIA | Frontend |
| **RN-12** | Drawer se resetea al cerrar (no persistir datos formulario) | UX | 🟢 MEDIA | Frontend |
| **RN-13** | Análisis ID 2 (S2 2024) puede fallar generación (demo mode) | Testing | 🟢 MEDIA | QA/Dev |

---

## 12. Permisos y restricciones

| Rol | Puede ver | Puede generar | Puede editar | Puede descargar | Notas |
|-----|-----------|---------------|--------------|-----------------|-------|
| **Head de People** | Todos análisis | ✅ Individual + Masivo | ❌ Solo parámetros (tipo, colaborador, alcance, pesos) | ✅ ZIP individual + masivo | Rol principal para feature |
| **PM Talento** | Todos análisis | ✅ Individual + Masivo | ❌ Solo parámetros | ✅ ZIP individual + masivo | Acceso similar a Head |
| **Manager** | Análisis del equipo | ✅ Individual (propio equipo) | ❌ Solo parámetros | ✅ ZIP individual | **Por confirmar:** filtro por equipo |
| **Analista Talento** | Todos análisis | ✅ Individual + Masivo | ❌ Solo parámetros | ✅ ZIP individual + masivo | Acceso full para análisis |
| **Admin** | Todos análisis | ✅ Individual + Masivo | ✅ Todo (crear análisis, editar pesos, etc.) | ✅ ZIP individual + masivo | **Por confirmar:** funcionalidad admin |
| **Viewer (readonly)** | Todos análisis | ❌ No | ❌ No | ❌ No | **Por confirmar:** rol existe? |

**Estado actual:** SIN IMPLEMENTACIÓN DE PERMISOS - todos ven todos los análisis, todos pueden generar cualquier tipo de reporte. **Por confirmar con PM/Backend cuándo agregar RBAC.**

---

## 13. Estados de UI

| Estado | Cuándo ocurre | Apariencia | Comportamiento |
|--------|---------------|-----------|-----------------|
| **Default (Normal)** | Drawer abierto, sin actividad | Formulario vacío, botón "Generar" enabled (si tipo individual) o disabled (si faltan parámetros) | Usuario puede interactuar |
| **Loading (Generando)** | Click "Generar reporte", simulación 1.5s en curso | Spinner/skeleton, botón disabled, textos grayed out | Bloqueado, espera |
| **Success (Completado)** | Post-generación exitosa, descarga 100% | Panel "Descargas" muestra reporte con ✓ check, "completed" status | Ofrecerá "Ver", "Descargar", "Reintentar" (si error) |
| **Error (Generación falla)** | Demo mode activado (análisis ID 2) | Notificación error roja, panel flotante si descarga en curso | Mostrar "Intentar de nuevo", auto-dismiss 4s |
| **Error (Descarga falla)** | Error random en descarga (85%+ progreso) | Row reporte en rojo, ❌ icono, "error" status | Botón "Reintentar" disponible |
| **Validación Error** | User intenta generar sin cumplir requisitos | Mensaje rojo inline (colaborador/alcance/pesos), botón disabled | No permite proceder |
| **Empty State (Sin descargas)** | Tab "Descargas" abierto, sin reportes en lista | Mensaje: "No hay reportes descargados" (o similar) | Mostrar instrucción generar |
| **Empty State (Historial vacío)** | Nunca generado reporte en los últimos 7 días | Sección "Historial" no se muestra o vacía | No afecta UX |
| **Downloading (Masivo)** | Progreso en curso 0-99% | Barra progreso + porcentaje, status "downloading" | Minimizable, panel flotante |
| **Minimized** | User click minimizar | Solo icono flotante en esquina, indicador progreso en icono | Click icono expande |
| **Multiple Downloads (Queue)** | Múltiples reportes generándose simultáneamente | Contador "N reportes en cola", lista con N filas | Muestra progreso independiente por reporte |

---

## 14. Validaciones

| Campo/Acción | Validación | Mensaje esperado | Momento validación | Verificación |
|---------------|-----------|------------------|-------------------|-------------|
| **Colaborador (Individual)** | Obligatorio si `reportType === 'Individual'` | "Por favor selecciona un colaborador" (rojo inline) | Click "Generar" | `if (!selectedColaborador)` bloquea |
| **Alcance (Masivo)** | Obligatorio si `reportType === 'Masivo'` AND `alcance !== 'Todos'` | "Por favor selecciona al menos un valor" | Click "Generar" | `if (alcanceFieldValue.length === 0)` bloquea |
| **Pesos 360°** | Valor numérico 0-100 | Validación inline: suma debe = 100% | Real-time | `totalPeso !== 100` → error visual |
| **Pesos Objetivos** | Valor numérico 0-100 | Validación inline: suma debe = 100% | Real-time | `totalPeso !== 100` → error visual |
| **Total Pesos** | 360° + Objetivos = 100% | "Los pesos deben sumar 100%. Actual: XX%" | Real-time | `hasPesoError` bloquea "Generar" |
| **Búsqueda colaborador** | Input text, autocomplete | Sugerencias filtradas en dropdown | On-change | Filtro client-side de 10 colaboradores |
| **Descarga en progreso** | No puede cerrar drawer o cambiar parámetros | Implícito: drawer locked durante descarga | Durante descarga | Panel flotante persiste, inputs disabled (TBD) |

---

## 15. Casos de error y recuperación

| Caso | Trigger | Comportamiento esperado | Acción de recuperación | Caso de QA |
|------|---------|------------------------|-----------------------|-----------|
| **Generación falla** | `isErrorDemoMode && (reportType === 'Individual' \|\| (reportType === 'Masivo' && alcance !== 'Todos')` | Error notification: "No pudimos generar tu reporte. Algo salió mal..." | Click "Intentar de nuevo" llama `handleGenerateReport()` nuevamente | Select análisis ID 2, tipo Individual, generar, confirmar error notificación |
| **Descarga falla (85%)** | `isErrorDemoMode && report.progress >= 85 && Math.random() < 0.25` | Row status = "error", ❌ icono visible, botón "Reintentar" activo | Click "Reintentar": reset progress 0%, restart descarga | Masivo descarga, esperar 85%, error aleatorio, click retry, progreso reinicia |
| **Abrir carpeta falla** | `isErrorDemoMode && Math.random() < 0.35` en `handleOpenFolder` | Error: "Error al abrir carpeta. Inténtalo más tarde" | Click "Reintentar" llama `handleOpenFolder()` nuevamente | Descarga completada, click "Abrir carpeta", error aleatorio (35%), click retry |
| **Sin colaboradores** | Análisis sin participantes (teórico) | **Por confirmar:** ¿mensaje vacío o error? | **Por confirmar** con PM | No testeable con datos mock (siempre 10 colaboradores) |
| **Sin alcance (Masivo)** | Análisis pero ningún colaborador matchea filtro | **Por confirmar:** ¿permitir generar vacío o error? | **Por confirmar** con PM | Área seleccionada pero ningún match: generar de todas formas? |
| **Conexión perdida (API real)** | **Por confirmar:** simular sin conexión en backend | **Por confirmar:** retry con backoff exponencial? | **Por confirmar** | Futura integración backend |
| **Timeout descarga** | **Por confirmar:** timeout en backend | **Por confirmar:** auto-retry o error final? | **Por confirmar** | Futura integración backend |
| **PDF no se abre** | `window.open()` bloqueada por navegador | **Por confirmar:** fallback a descarga? | **Por confirmar** | Test en navegador con popup blocker |

---

## 16. Contrato de datos esperado

### 16.1 Modelo: Análisis

```typescript
interface Analysis {
  id: number;
  name: string;                    // "Análisis Q1 2025"
  date: string;                    // "10 enero 2025"
  participants: number;            // 200
  performance_cycle?: string;      // "Q1 2025"
  potential_cycle?: string;        // "Q1 2025"
}
```

**Estado:** ✅ Hardcodeado en App.tsx línea 423-434  
**Fuente:** Cliente (mock)  
**Uso en UI:** Tabla lista análisis, click abre drawer  
**Por confirmar:** ¿viene de API backend?

### 16.2 Modelo: Colaborador

```typescript
interface Colaborador {
  id: number;
  name: string;                    // "Elkin Garcia Salazar"
  initials: string;                // "EG"
  area: string;                    // "Tecnología"
  lider: string;                   // "Juan Pérez"
  pais: string;                    // "Colombia"
  ciudad: string;                  // "Bogotá"
}
```

**Estado:** ✅ Hardcodeado en App.tsx línea 95-106  
**Fuente:** Cliente (mock)  
**Uso en UI:** Búsqueda, autocompletar, contar por filtro  
**Por confirmar:** ¿viene de API backend con lista dinámica?

### 16.3 Modelo: Generación Reporte Request

```typescript
interface GenerateReportRequest {
  analysis_id: number;
  report_type: "Individual" | "Masivo" | "AnalisisMatriz";
  
  // Si Individual
  collaborator_id?: number;
  
  // Si Masivo
  scope?: "Todos" | "Área" | "Líder" | "País" | "Ciudad";
  scope_values?: string[];        // ["Tecnología"] o ["Colombia"]
  
  // Ambos
  weight_360: number;              // 50 (%)
  weight_objectives: number;       // 50 (%)
}
```

**Estado:** ⚠️ Mockeado - frontend envía pero sin backend real  
**Fuente:** Frontend (form input)  
**Uso:** Generación PDF/ZIP  
**Por confirmar:** Definir en API backend

### 16.4 Modelo: Generación Reporte Response

```typescript
interface GenerateReportResponse {
  success: boolean;
  report_id?: string;              // "uuid-xxxx"
  file_url?: string;               // URL descarga PDF o ZIP
  error?: string;                  // Mensaje error si fail
  estimated_time?: number;         // ms estimado
}
```

**Estado:** ❌ No existe, simulado con `setTimeout` 1500ms  
**Por confirmar:** Definir contrato con backend

### 16.5 Modelo: Descarga en Progreso

```typescript
interface DownloadingReport {
  id: number;
  name: string;
  progress: number;                // 0-100
  status: "downloading" | "completed" | "error";
  collaboratorCount: number;       // Cantidad colaboradores
  isIndividual?: boolean;
  reportType?: string;             // Título análisis
}
```

**Estado:** ✅ Construido en App.tsx línea 31  
**Fuente:** Cliente (generado local)  
**Uso:** Renderizado en panel flotante + tab "Descargas"  
**Ejemplo:**
```json
{
  "id": 1714067400000,
  "name": "Reporte_Masivo_1714067400000.zip",
  "progress": 85,
  "status": "downloading",
  "collaboratorCount": 50,
  "reportType": "Reporte unificado"
}
```

### 16.6 Modelo: Historial Descarga

```typescript
interface DownloadHistoryItem {
  id: number;
  name: string;
  completedAt: Date;
  collaboratorCount: number;
  isIndividual?: boolean;
  reportType?: string;
}
```

**Estado:** ✅ Construido en App.tsx línea 32  
**Fuente:** Cliente (generado automáticamente)  
**Uso:** Mostrar historial últimos 7 días  
**Auto-filtro:** `getRecentDownloadHistory()` línea 132-137  
**Ejemplo:**
```json
{
  "id": 1714067400000,
  "name": "Reporte_Masivo_1714067400000.zip",
  "completedAt": "2025-04-28T15:30:00Z",
  "collaboratorCount": 50,
  "reportType": "Reporte unificado"
}
```

### 16.7 Estado Global (App.tsx State)

| Variable | Tipo | Inicialización | Propósito | Línea |
|----------|------|-----------------|-----------|-------|
| `isDrawerOpen` | boolean | false | Drawer modal visibility | 7 |
| `reportType` | 'Individual' \| 'Masivo' \| 'AnalisisMatriz' | 'Individual' | Tipo reporte seleccionado | 8 |
| `activeDrawerTab` | 'generar' \| 'descargas' | 'generar' | Tab activo | 10 |
| `alcance` | string | 'Todos...' | Alcance masivo | 11 |
| `peso360` | string | '50' | Peso 360° | 12 |
| `pesoObjetivos` | string | '50' | Peso Objetivos | 13 |
| `selectedColaborador` | string | '' | Colaborador individual seleccionado | 15 |
| `showColaboradorError` | boolean | false | Error individual validation | 19 |
| `showAlcanceFieldError` | boolean | false | Error masivo validation | 20 |
| `downloadingReports` | Array | [] | Reportes en descarga/completados | 31 |
| `downloadHistory` | Array | [] | Historial descargas | 32 |
| `reportsInQueue` | number | 0 | Contador reportes en cola | 29 |
| `isDownloading` | boolean | false | Flag descarga activa | 24 |
| `isDownloadMinimized` | boolean | false | Flag panel minimizado | 25 |
| `errorNotification` | object \| null | null | Error notificación actual | 34-39 |
| `selectedAnalysisId` | number \| null | null | Analysis ID seleccionado (para demo error) | 41 |

---

## 17. Endpoints, servicios o integraciones

### 17.1 Endpoints necesarios (FALTA IMPLEMENTAR)

| Endpoint | Método | Propósito | Estado | Mockeo actual |
|----------|--------|----------|--------|--------------|
| `POST /api/reports/generate` | POST | Generar reporte (individual/masivo) | ❌ No existe | `setTimeout` 1500ms en cliente |
| `GET /api/reports/{reportId}/download` | GET | Descargar PDF/ZIP | ❌ No existe | `window.open` con componente local |
| `GET /api/analyses` | GET | Listar análisis disponibles | ❌ No existe | Hardcodeado const línea 423 |
| `GET /api/collaborators` | GET | Listar colaboradores (búsqueda) | ❌ No existe | Hardcodeado const línea 95 |
| `POST /api/reports/{reportId}/retry` | POST | Reintentar descarga fallida | ❌ No existe | Reset local state en cliente |
| **Webhook/SSE** | - | Actualizar progreso descarga | ❌ No existe | Simulado con `setInterval` +1% |

### 17.2 Integraciones externas

| Servicio | Uso | Estado | Notas |
|----------|-----|--------|-------|
| **html2canvas** | Capturar componente a imagen para PDF | ✅ Instalado (package.json línea 48) | Sin usar aún en flujo actual |
| **jsPDF** | Generar PDF desde canvas | ✅ Instalado (package.json línea 50) | Sin usar aún en flujo actual |
| **Figma Make** | Componentes UI generados desde Figma | ✅ Base proyecto (package.json línea 2) | Muchos componentes importados |
| **Recharts** | Gráficos (si futura matriz resultados necesita) | ✅ Instalado (package.json línea 63) | Sin usar aún |

### 17.3 Archivos locales (Imports)

| Archivo | Propósito | Estado | Integración |
|---------|----------|--------|-------------|
| `VistaPreviaPdfReporteEjecutivoFinalNuevoAzul0C5Bef.tsx` | Reporte individual PDF preview | ✅ Importado, funcional | Abierto en pestaña nueva con `?pdf-preview=true` |
| `VistaResultadosMatriz.tsx` | Matriz resultados análisis | ⚠️ Importado, no integrado | Futura: para `reportType === 'AnalisisMatriz'` |
| PNG imágenes (Colaborador Valentina Mendoza, etc.) | Assets PDF | ✅ Importados | Usados en componente VistaPreviaPdf |

---

## 18. Microcopy

| Ubicación | Texto actual | Texto recomendado | Estado | Notas |
|-----------|-------------|------------------|--------|-------|
| **Drawer título** | "Reporte unificado" | "Reporte unificado" | ✅ OK | Línea 9: `drawerTitle` |
| **Tab Generar** | (sin texto, apenas label "Generar reporte") | "Generar reporte" | ✅ OK | Radix Tabs |
| **Tab Descargas** | (sin texto, apenas label "Descargas") | "Descargas" → "Lista de descargas" | ⚠️ Por cambiar | User story: cambiar etiqueta a "Lista de descargas" |
| **Search placeholder** | (TBD) | "Busca un colaborador..." o "Selecciona un colaborador" | 🟢 MEDIA | Implementar |
| **Error Individual** | (TBD) | "Por favor selecciona un colaborador" | 🟢 MEDIA | Línea 216: `showColaboradorError` |
| **Error Alcance** | (TBD) | "Por favor selecciona al menos un valor para el alcance" | 🟢 MEDIA | Línea 221: `showAlcanceFieldError` |
| **Error Pesos** | (TBD) | "Los pesos deben sumar exactamente 100%. Actual: XX%" | 🟢 MEDIA | Línea 148: `hasPesoError` |
| **Botón Generar** | "Generar reporte" | "Generar reporte" | ✅ OK | Radix Button |
| **Notificación error generación** | "No pudimos generar tu reporte" | "No pudimos generar tu reporte. Algo salió mal al procesar la información. Esto suele ser temporal y se resuelve solo." | ✅ OK | Línea 245-246 |
| **Notificación error masivo** | "Error al iniciar la generación masiva" | "Algo salió mal con la generación masiva. Intenta nuevamente." | 🟢 MEDIA | Línea 245 |
| **Acción error** | "Intentar de nuevo" | "Intentar de nuevo" | ✅ OK | Línea 247 |
| **Estado downloading** | (TBD) | "Descargando..." o "En progreso" | 🟢 MEDIA | Mostrar en UI |
| **Estado completed** | (TBD) | "✓ Completado" o "Listo" | 🟢 MEDIA | Mostrar en UI |
| **Estado error** | (TBD) | "❌ Error" | 🟢 MEDIA | Mostrar en UI |
| **Botón retry** | "Reintentar" | "Reintentar" | ✅ OK | Implementado línea 355 |
| **Contador cola** | "2 reportes en cola" | "2 reportes en cola" | ✅ OK | Línea 29 `reportsInQueue` |
| **Sección historial** | "Historial de últimos 7 días" o "Descargas recientes" | "Historial - Últimos 7 días" | 🟢 MEDIA | Sección título |
| **Empty state descargas** | (TBD) | "No hay descargas en progreso. Generar un reporte para comenzar." | 🟢 MEDIA | Show cuando lista vacía |

---

## 19. Consideraciones visuales, responsive y accesibilidad

### 19.1 Sistema de diseño

| Aspecto | Especificación | Evidencia |
|--------|-----------------|-----------|
| **Colores Primarios** | Azul oscuro (#00256E), Blanco, Gris (#5C646F) | VistaResultadosMatriz.tsx: `text-[#00256e]`, `bg-white`, `text-[#5C646F]` |
| **Tipografía Principal** | Helvetica Now Text (Bold, SemiBold, Regular), Noto Sans | App.tsx + Figma: `font-['Helvetica_Now_Text_:Bold']` |
| **Tipografía Secundaria** | Noto Sans, Inter | Múltiples componentes |
| **Border Radius** | 4px, 5px, 8px, 10px (progresivo) | App.tsx, VistaResultadosMatriz |
| **Espaciado** | 4px, 8px, 12px, 16px, 20px, 30px, 40px (escala) | Componentes Figma |
| **Sombras** | Subtle (light gray), emphasis (darker) | **Por confirmar:** definir elevación en Figma |
| **Componentes base** | Radix UI (button, input, tabs, drawer, etc.) | `/src/app/components/ui/` |

### 19.2 Variantes

| Componente | Variantes | Estado |
|-----------|----------|--------|
| **Button** | Primary (azul), Secondary (gris), Danger (rojo), Disabled | ✅ Radix UI button con className variants |
| **Input** | Default, Error (red border), Disabled, Focus | ✅ Input Radix con className |
| **Tabs** | Active (underline/border), Inactive, Hover | ✅ Radix Tabs |
| **Notificación** | Error (rojo), Success (verde), Warning (amarillo), Info (azul) | ✅ Sonner toast |
| **Panel Flotante** | Minimized (icono), Expanded (full) | ✅ Construido con `isDownloadMinimized` state |

### 19.3 Responsive

| Breakpoint | Comportamiento esperado | Estado |
|-----------|--------|--------|
| **Mobile (< 640px)** | Drawer fullscreen, tabs stackeadas, input 100% width | ⚠️ Por verificar en dev |
| **Tablet (640px - 1024px)** | Drawer 80% width, layout ajustado, tabs side-by-side | ⚠️ Por verificar en dev |
| **Desktop (> 1024px)** | Drawer 600px width, full layout, panel flotante visible | ✅ Diseñado para desktop |

### 19.4 Accesibilidad

| Aspecto | Requerimiento | Estado | Notas |
|--------|---------------|--------|-------|
| **ARIA Labels** | Todos inputs, botones, tabs deben tener `aria-label` | ❌ Por implementar | Radix UI proporciona parcial, completar en componentes custom |
| **Keyboard Navigation** | Tab order correcto, Enter activa, Escape cierra drawer | ⚠️ Parcial (Radix UI lo hace) | Verificar flujo completo |
| **Focus Visible** | Focus ring visible en todos elementos interactivos | ✅ Radix UI default | Usar outline o ring Tailwind |
| **Contraste mínimo** | WCAG AA (4.5:1 texto, 3:1 gráficos) | ⚠️ Por verificar | Revisar con herramienta (AxeDevTools) |
| **Colores no únicos** | No depender solo de color para estado | ⚠️ Usar ícono + color para error | Ej: ❌ error, ✓ success |
| **Textos alternativos** | Images con `alt`, SVG con `<title>` | ⚠️ Por verificar | Componentes Figma pueden carecer |
| **Reduced motion** | Respetar `prefers-reduced-motion` | ❌ Por implementar | Usar hook `useReducedMotion` |

### 19.5 Estados de foco

| Elemento | Focus state | Keyboard shortcut |
|----------|-------------|------------------|
| **Search input** | Azul borde, ring outline | Tab, autoenfoque al abrir |
| **Colaborador sugerencia** | Hover azul, Arrow keys para navegar | Arrow Down/Up, Enter para select |
| **Button "Generar"** | Ring azul, Enter activa si enabled | Tab, Enter |
| **Tabs** | Ring, Shift+Tab navega hacia atrás | Tab navega forward |
| **Drawer close (X)** | Ring, Escape también cierra | Tab, click, Escape |

---

## 20. Analítica recomendada

| Evento | Cuándo se dispara | Propiedades | Prioridad |
|--------|------------------|-------------|-----------|
| **report_generate_started** | Click "Generar reporte" | `report_type` (Individual/Masivo), `analysis_id`, `timestamp` | 🔴 CRÍTICA |
| **report_generate_completed** | Generación exitosa (100%) | `report_type`, `analysis_id`, `duration_ms`, `collaborator_count`, `timestamp` | 🔴 CRÍTICA |
| **report_generate_failed** | Error generación | `report_type`, `analysis_id`, `error_code`, `error_message`, `timestamp` | 🔴 CRÍTICA |
| **report_download_started** | Inicio descarga (0%) | `report_type`, `report_id`, `file_size_estimated`, `timestamp` | 🔴 CRÍTICA |
| **report_download_completed** | Descarga completada (100%) | `report_type`, `report_id`, `duration_ms`, `file_size_actual`, `timestamp` | 🔴 CRÍTICA |
| **report_download_failed** | Error en descarga | `report_type`, `report_id`, `progress_at_failure`, `error_code`, `timestamp` | 🟡 ALTA |
| **report_download_retried** | Click "Reintentar" | `report_id`, `previous_progress`, `retry_count`, `timestamp` | 🟡 ALTA |
| **drawer_opened** | Drawer se abre | `analysis_id`, `trigger` (click análisis), `timestamp` | 🟢 MEDIA |
| **drawer_closed** | Drawer se cierra | `time_open_ms`, `analysis_id`, `timestamp` | 🟢 MEDIA |
| **tab_switched** | Click tab "Generar" o "Descargas" | `from_tab`, `to_tab`, `timestamp` | 🟢 MEDIA |
| **error_notification_shown** | Error notif aparece | `error_type`, `error_message`, `has_action`, `timestamp` | 🟡 ALTA |
| **error_notification_dismissed** | Notif se cierra (auto o manual) | `error_type`, `dismissed_by` (auto/manual), `displayed_duration_ms`, `timestamp` | 🟢 MEDIA |
| **search_performed** | Usuario busca colaborador | `search_term`, `results_count`, `timestamp` | 🟢 MEDIA |
| **collaborator_selected** | Selecciona colaborador | `collaborator_id`, `collaborator_name`, `timestamp` | 🟢 MEDIA |
| **scope_changed** | Cambia alcance (Masivo) | `scope_type`, `scope_values`, `affected_collaborators`, `timestamp` | 🟢 MEDIA |
| **weight_adjusted** | Cambia pesos 360°/Objetivos | `weight_360`, `weight_objectives`, `is_valid`, `timestamp` | 🟢 MEDIA |

---

## 21. QA Checklist

### 21.1 Funcional

- [ ] **Individual flow:** Seleccionar análisis → colaborador → pesos validados → generar → PDF abre → completado en descargas
- [ ] **Masivo flow:** Seleccionar análisis → tipo Masivo → alcance → pesos → generar → progreso 0-100% → completado
- [ ] **Validation colaborador:** Sin seleccionar → click generar → error rojo visible
- [ ] **Validation alcance:** Masivo, alcance != Todos, sin valores → error visible
- [ ] **Validation pesos:** 360° + Objetivos != 100% → botón disabled + error inline
- [ ] **Búsqueda:** Type "Elkin" → sugerencias filtradas, click selecciona
- [ ] **Error generación:** Análisis ID 2 → generar → error notificación con retry
- [ ] **Error descarga:** Masivo 85% → error → retry reinicia a 0%
- [ ] **Tab switching:** Click "Descargas" → contenido cambia, click "Generar" → vuelve a formulario
- [ ] **Minimizar panel:** Click minimize → icono flotante visible, click icono → expande
- [ ] **Historial:** Generar reporte → cerrar drawer → reabrir → historial muestra reporte (últimos 7 días)
- [ ] **Contador cola:** Generar 2 reportes masivos simultáneos → contador muestra "2"
- [ ] **Auto-dismiss notificación:** Error aparece → 4 segundos → desaparece automáticamente
- [ ] **Reintento manual:** Error notificación → click "Intentar de nuevo" → reintenta
- [ ] **Formulario reset:** Cerrar drawer → reabrir → campos vacíos (colaborador = '', pesos = 50/50)

### 21.2 Estados visuales

- [ ] **Default state:** Botones enabled/disabled según validación
- [ ] **Loading state:** Spinner visible 1.5s, botón disabled
- [ ] **Success state:** ✓ icono completado, estado "completed"
- [ ] **Error state:** ❌ icono, estado "error", botón retry visible
- [ ] **Downloading state:** Barra progreso, % actualizado cada 300ms
- [ ] **Empty state (descargas):** Sin reportes → mensaje "No hay reportes"

### 21.3 Responsive

- [ ] **Mobile (375px):** Drawer fullscreen, inputs 100% width, legible
- [ ] **Tablet (768px):** Layout ajustado, tabs funcionales
- [ ] **Desktop (1440px):** Diseño original, panel flotante visible

### 21.4 Accesibilidad

- [ ] **Keyboard nav:** Tab navega inputs → botones → tabs, Enter activa
- [ ] **Focus visible:** Ring/outline visible en todo elemento interactivo
- [ ] **Color + icon:** Error muestra ❌ (no solo rojo), success muestra ✓
- [ ] **ARIA labels:** Inputs, botones, tabs tienen labels o aria-label
- [ ] **Contraste:** Mínimo 4.5:1 (texto) verificado con AxeDevTools
- [ ] **Reduced motion:** Si user prefiere motion reducida, animaciones suavizadas

### 21.5 Datos

- [ ] **Colaboradores mock:** 10 colaboradores cargados, búsqueda filtra correctamente
- [ ] **Análisis mock:** 10 análisis mostrados, click abre drawer
- [ ] **Descarga counting:** Masivo Tecnología = 5 colaboradores, Todos = 10 colaboradores
- [ ] **Historial persistence:** Durante sesión, post-refresh se pierde (expected)
- [ ] **Historial 7 días:** Reporte hoy + 8 días atrás → solo hoy mostrado (por confirmar si localStorage)

### 21.6 Permisos

- [ ] **No hay restricciones (actual):** Todos ven todos análisis, generan todo tipo
- [ ] **Futura RBAC:** Por confirmar cuándo implementar (fase 2)

---

## 22. Preguntas abiertas

| # | Pregunta | Responsable | Estado | Fecha sugerida | Impacto si no se resuelve |
|---|----------|-------------|--------|-----------------|--------------------------|
| **Q1** | ¿Integrar PDF real o mantener preview estático de Valentina Mendoza? | PM + Backend | Abierta | Fase 2 | No se generan PDFs personalizados por usuario |
| **Q2** | ¿Persistir historial en localStorage después del cierre de sesión? | Frontend + PM | Abierta | Fase 1.5 | Historial se pierde al cerrar navegador |
| **Q3** | ¿Cuándo integrar backend API para generación real (no simulada)? | Backend + PM | Abierta | Fase 2 (post-MVP) | Sistema funciona solo en cliente, sin escalabilidad |
| **Q4** | ¿Mantener demo error mode en producción o reemplazar con lógica real? | PM + Backend | Abierta | Antes de deploy | Analysis ID 2 siempre falla si es demo |
| **Q5** | ¿Implementar RBAC (Head/Manager/Analyst ven análisis diferentes)? | PM + Backend + Security | Abierta | Fase 2 | Todos ven todos análisis, sin control de acceso |
| **Q6** | ¿Cambiar etiqueta tab "Descargas" a "Lista de descargas"? | PM + Diseño | Abierta | Fase 1.5 | UX: texto poco claro |
| **Q7** | ¿Qué hacer si alcance Masivo no matchea colaboradores? | PM | Abierta | Fase 1.5 | Generar ZIP vacío o mostrar error? |
| **Q8** | ¿Implementar búsqueda colaboradores en backend (filtro server-side)? | Backend + Frontend | Abierta | Fase 2 | Con 1000+ colaboradores, búsqueda cliente será lenta |
| **Q9** | ¿Agregar más tipos reporte (AnalisisMatriz, AnalisisMultidimensional)? | PM + Diseño | Abierta | Fase 2 | Solo Individual/Masivo funciona ahora |
| **Q10** | ¿WebSocket o SSE para progreso real en descargas masivas? | Backend + Frontend | Abierta | Fase 2 | Progreso simulado, no refleja estado real backend |
| **Q11** | ¿Botón "Analizar con IA" en matriz: cuándo integrar? | PM + IA Team | Abierta | Fase 3 | Botón existe pero no hace nada |
| **Q12** | ¿Exportar a XLSX/CSV además de PDF/ZIP? | PM + Data | Abierta | Fase 3 | Solo PDF individual, ZIP masivo |

---

## 23. Riesgos y dependencias

| # | Riesgo / Dependencia | Impacto | Mitigación | Owner |
|----|----------------------|--------|-----------|-------|
| **R1** | Backend API no disponible en tiempo, flujos quedan mockeados | 🔴 CRÍTICA | Iniciar desarrollo backend en paralelo, definir contrato API ya | Backend Lead |
| **R2** | Generación PDF personalizada por usuario no funciona | 🔴 CRÍTICA | Definir template PDF + datos personalizados con backend | Backend + Diseño |
| **R3** | Progreso descarga no refleja backend real | 🟡 ALTA | Implementar WebSocket/SSE fase 2, mantener simulación ahora | Backend |
| **R4** | Error demo mode expuesto en producción | 🟡 ALTA | Remover `isErrorDemoMode` antes de deploy, reemplazar con lógica real | Frontend + PM |
| **R5** | Historial se pierde al cerrar navegador (sin localStorage) | 🟡 ALTA | Agregar localStorage soon, usuario puede perder referencia descargas | Frontend |
| **R6** | Sin RBAC: Manager ve reportes fuera su equipo | 🟢 MEDIA | Implementar filtrado backend fase 2, user story separado | Backend + PM |
| **R7** | Performance: búsqueda 1000+ colaboradores en cliente | 🟢 MEDIA | Mover a backend con pagination/search API fase 2 | Backend |
| **R8** | Análisis VistaResultadosMatriz no integrada en flujo principal | 🟢 MEDIA | Definir cuándo integrar, crear user story separada | PM |
| **R9** | Contraste/accesibilidad no verificado | 🟢 MEDIA | Correr AxeDevTools, auditoría accesibilidad antes de UAT | QA |
| **R10** | z-index drawer/panel conflictos en browser | 🟢 MEDIA | Definir z-index strategy (1000+, 2000+), documentar | Frontend |

---

## 24. Notas para desarrollo

### 24.1 Lo que DEBE respetarse

1. **Flujo tab "Generar reporte" → "Descargas":** Sistema automáticamente salta a "Descargas" post-generación. NO cambiar sin validar con PM.
2. **Validaciones client-side:** Mostrar errores ANTES de enviar backend. UX de feedback inmediato.
3. **Historial últimos 7 días:** Filtrado automático por fecha. No cambiar lógica sin PM.
4. **Pesos 360° + Objetivos = 100%:** Regla de negocio fija. Validación obligatoria.
5. **Error notificación auto-dismiss 4s:** UX decision, no cambiar timeout sin diseño.
6. **Componente VistaPreviaPdf abierto en nueva pestaña:** Modo modal flotante en app principal, NO iframe.
7. **Demo error mode para análisis ID 2:** Mantener para testing, REMOVER en producción después de cambiar por API real.

### 24.2 Lo que PUEDE ajustarse técnicamente

1. **Estado management:** Migrar de useState a Context/Zustand/Redux si crece complejidad.
2. **Progreso simulado:** Algoritmo +1% cada 300ms puede cambiarse a +2% o variable según diseño.
3. **Orden de pesos:** Cambiar orden inputs (360° abajo, Objetivos arriba) no impacta lógica.
4. **Icono minimizar:** Cambiar ícono (↓/↑ o diferente) es cosmético.
5. **Colores/estilos:** Ajustar a tokens Tailwind del proyecto.
6. **Animaciones:** Drawer enter/exit, tab transition pueden optimizarse.

### 24.3 Lo que NO DEBE cambiar sin validar con Diseño/PM

1. **Estructura drawer (2 tabs):** Si necesita 3+ tabs, solicitar re-diseño.
2. **Posición panel flotante:** Bottom-right, cambiar a top-left requiere re-diseño.
3. **Nombres inputs/campos:** "Colaborador", "Alcance", "Pesos 360°" son términos fijos.
4. **Formato descarga:** Individual = PDF, Masivo = ZIP. No cambiar sin PM.
5. **Historial filtro "últimos 7 días":** Cambiar a 14 días o ilimitado requiere PM.
6. **Contador "N reportes en cola":** Ubicación, formato, visibilidad = decisión diseño.
7. **Behaviours del error (notificación, retry, timeout):** UX flows, validar cambios.

---

## 25. Registro de cambios

| Versión | Fecha | Cambio | Responsable |
|---------|-------|--------|-------------|
| **1.0** | 2025-04-28 | Handoff inicial: MVP funcional con flujos Individual, Masivo, descargas, historial, validaciones, error recovery | Claude (Product Design Handoff Reporter) |
| TBD | TBD | Integración backend API (reportes en cola, WebSocket progreso) | Backend Team |
| TBD | TBD | Persistencia historial localStorage | Frontend Team |
| TBD | TBD | RBAC + permisos por rol | Backend + Security |
| TBD | TBD | Personalización PDF por usuario | Backend + Diseño |
| TBD | TBD | Integración IA ("Analizar con IA" button) | IA Team |
| TBD | TBD | Exportación XLSX/CSV | Data + Backend |

---

---

## RESUMEN PARA REFINAMIENTO

### ⭐ Top 5 decisiones que PM debe tomar

1. **¿Integrar backend API en fase 1.5 o fase 2?** → Actualmente todo mockeado. Bloquea progreso real, persistencia, escalabilidad.
2. **¿Persistencia historial: localStorage o backend DB?** → Hoy se pierde al refresh. Afecta UX si usuario cierra browser.
3. **¿Cambiar tab label "Descargas" a "Lista de descargas"?** → Pequeño change, mejora claridad UX.
4. **¿Cuándo integrar AnalisisMatriz y "Analizar con IA"?** → Componentes existen pero no en flujo principal, por confirmar scope.
5. **¿Mantener RBAC para fase 2 o incluir en MVP?** → Hoy todos ven todos análisis. Security risk si data sensible.

### 🔧 Top 5 dudas técnicas para desarrollo

1. **¿Cómo generar PDF personalizado por usuario desde backend?** → VistaPreviaPdf es estático (Valentina Mendoza). Necesita template dinámico.
2. **¿WebSocket vs SSE para progreso descarga?** → Ahora simulado. Decisión arquitectura importante.
3. **¿Migrar estado de useState a state management centralizado?** → Hoy +20 useState. Crece complejo con features.
4. **¿Búsqueda colaboradores: API call cada keystroke o post-select?** → Hoy client-side 10 mocks. Con 1000+ usuarios, backend necesario.
5. **¿Remover completamente demo error mode o mantener flag toggleable?** → Analysis ID 2 fuerza fallos. Para testing útil, en prod peligroso.

### 🧪 Top 5 casos de QA más importantes

1. **Happy path Individual:** Seleccionar → colaborador → pesos OK → generar → PDF abre → historial muestra → ✓
2. **Validation blocker:** Sin colaborador / sin alcance / pesos != 100% → error visible → botón disabled → ✓
3. **Error recovery:** Análisis ID 2 falla generación → error notificación → retry → éxito (o falla de nuevo) → ✓
4. **Descarga falla y retry:** Masivo 85% → error → retry → reset a 0% → progresa a 100% → ✓
5. **Tab switching + historial:** Generar → tab Descargas → cerrar → reabrir → historial muestra reporte (últimos 7 días) → ✓

### 🚫 Bloqueadores antes de iniciar desarrollo

1. **❌ Backend API contracts NO definidos** → Necesario: esquema GenerateReportRequest/Response, auth, error codes.
2. **❌ PDF template dinámico SIN definir** → VistaPreviaPdf es estático. Requisito para personalización.
3. **❌ RBAC/permisos NO aclarados** → ¿Todos vs. filtrado por rol? Afecta queries backend.
4. **❌ Error demo mode strategy** → ¿Remover antes de deploy o mantener con feature flag?
5. **❌ WebSocket/SSE NO decidido** → Progreso descarga simulado. Decisión arquitectura necesaria.

---

**Documento generado:** 2025-04-28  
**Estado:** ✅ Listo para refinamiento y planning fase 2  
**Próximo paso:** PM toma decisiones (Q1-Q5), Backend define API contracts, Frontend prepara componentes para integración
