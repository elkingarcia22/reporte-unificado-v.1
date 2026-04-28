# Handoff a Desarrollo: Sistema Unificado de Generación y Descarga de Reportes de Talento
## Versión Corregida & Verificada

---

## 1. Resumen ejecutivo

| Aspecto | Detalle |
|---------|---------|
| **Estado actual** | ✅ PROTOTIPO FUNCIONAL: Sistema generación/descarga/historial de reportes 360° con simulación client-side completa |
| **Construcción verificada** | Drawer modal + tabs personalizados (DIVs, no Radix) + panel flotante descargas + historial últimos 7 días |
| **Simulación funcional** | Progreso +1%/300ms (generación inicial), +2%/300ms (reintento), error mode demo en ID análisis 2 |
| **Datos mockeados** | 10 colaboradores hardcodeados, 10 análisis hardcodeados, PDF estático (Valentina Mendoza) |
| **Backend pendiente** | Generación real PDFs, almacenamiento historial, API endpoints, permisos RBAC |
| **Líneas de código** | App.tsx 2470 líneas, VistaPreviaPdf 2470 líneas |

---

## 2. Estado real verificado en código

### 2.1 CONSTRUIDO ✅ (Evidencia directa en App.tsx)

| Característica | Estado | Verificación | Comportamiento real |
|---|---|---|---|
| **Drawer modal floante** | ✅ CONSTRUIDO | `isDrawerOpen` state (línea 7), condicional renderizado | DIV con z-index alto, abre/cierra con botones |
| **Tabs generar/descargas** | ✅ CONSTRUIDO | `activeDrawerTab` state (línea 10), DIVs onClick (NO Radix Tabs) | Dos tabs: "Generar reporte" (formulario) y "Descargas" (lista + historial) |
| **Búsqueda colaboradores** | ✅ CONSTRUIDO pero MOCKEADO | 10 colaboradores hardcodeados (líneas 95-106), filtrado client-side (líneas 139-143) | Input text, dropdown con sugerencias, selección funciona |
| **Validación campos** | ✅ CONSTRUIDO | `showColaboradorError` (línea 19), `showAlcanceFieldError` (línea 20), `hasPesoError` (línea 148) | Errors mostrados en rojo, botón "Generar" bloqueado si faltan requisitos |
| **Pesos 360°/Objetivos** | ✅ CONSTRUIDO | `peso360`, `pesoObjetivos` estados (líneas 12-13), validación línea 145-148 | Inputs numéricos, validación suma = 100% obligatoria |
| **Generación reporte** | ✅ CONSTRUIDO | `handleGenerateReport()` (línea 209), simulación 1.5s (línea 234) | Click "Generar" → espera 1.5s → abre PDF o inicia descarga |
| **Descarga simulada** | ✅ CONSTRUIDO | `startMassiveDownload()` (línea 283), intervalo +1% cada 300ms (línea 301) | Progress bar visual, lista reportes descargando |
| **Estados descarga** | ✅ CONSTRUIDO | `downloadingReports` array (línea 31) con status: 'downloading'\|'completed'\|'error' | Cada reporte muestra icono ✓ (completado), ❌ (error), o % (descargando) |
| **Historial 7 días** | ✅ CONSTRUIDO | `downloadHistory` state (línea 32), función `getRecentDownloadHistory()` (línea 133-137) | Filtra automáticamente por fecha, mostrado en sección inferior del tab "Descargas" |
| **Error notification** | ✅ CONSTRUIDO | `errorNotification` state (línea 34-39), useEffect auto-dismiss 4s (línea 65-72) | Toast roja con título + mensaje + "Intentar de nuevo", desaparece en 4s |
| **Demo error mode** | ✅ CONSTRUIDO | `isErrorDemoMode` lógica (línea 93: `selectedAnalysisId === 2`), fallo individual (línea 239-242) | Si ID análisis = 2 → generación falla con 50% probabilidad (individual), 25% a 85%+ (masivo) |
| **Reintento descarga** | ✅ CONSTRUIDO | `handleRetryReport()` (línea 355), reset progress 0% + +2% cada 300ms | Status 'error' → click "Reintentar" → reinicia a 0% y progresa más rápido (+2% vs +1%) |
| **Panel descarga flotante** | ✅ CONSTRUIDO | `showDownloadPanel`, `isDownloadMinimized` states (líneas 26, 25) | Minimizable a icono, expandible, muestra lista reportes en progreso |
| **PDF preview modo** | ✅ CONSTRUIDO | URL param `?pdf-preview=true` (línea 47), renderiza `VistaPreviaPdfReporteEjecutivoFinalNuevoAzul0C5Bef` | Nueva pestaña, fullscreen PDF estático, cierra con escape o click fondo |
| **Resetear campos al cerrar** | ✅ CONSTRUIDO | `handleCloseDrawer()` (línea 150), timeout 300ms + resetea todos los estados | Colaborador, alcance, pesos → valores por defecto |

### 2.2 MOCKEADO 🟡 (Funcional pero sin backend)

| Característica | Estado | Qué está mockeado | Impacto |
|---|---|---|---|
| **Colaboradores** | 🟡 MOCKEADO | Lista fija de 10 colaboradores hardcodeados en código (líneas 95-106) | Búsqueda funciona, pero NO conecta a API de usuarios reales |
| **Análisis disponibles** | 🟡 MOCKEADO | 10 análisis hardcodeados (líneas 423-434) | Dropdown funciona, pero NO conecta a backend de análisis |
| **Generación PDF individual** | 🟡 MOCKEADO | Simulación 1.5s, abre siempre el mismo PDF (Valentina Mendoza) | Window.open('?pdf-preview=true') abre modo preview, NO genera PDF personalizado |
| **Descarga ZIP masiva** | 🟡 MOCKEADO | Simulación de progreso (+1% cada 300ms), no descarga archivo real | Progress visual completo, pero NO genera ni descarga ZIP actual |
| **Persistencia historial** | 🟡 MOCKEADO | Solo en memoria de sesión, se pierde al cerrar navegador | NO usa localStorage ni backend, historial resetea en cada refresh |
| **Contar colaboradores por alcance** | 🟡 MOCKEADO | Función `getColaboradoresCount()` (línea 109-130) cuenta sobre lista hardcodeada | Lógica correcta (Todos/Área/Líder/País/Ciudad), pero siempre sobre mismos 10 colaboradores |

### 2.3 PENDIENTE 🔴 (No implementado)

| Característica | Razón | Prioridad | Fase sugerida |
|---|---|---|---|
| **API generación PDF** | Requiere backend Python/Node | 🔴 CRÍTICA | Fase 2 |
| **API descarga masiva** | Requiere backend + file storage | 🔴 CRÍTICA | Fase 2 |
| **Persistencia BD historial** | Requiere schema + backend | 🟡 ALTA | Fase 2 |
| **Permisos RBAC** | Sin diferenciación de roles actualmente | 🟡 ALTA | Fase 2 |
| **Análisis con IA** | Botón existe en VistaResultadosMatriz (línea 33-50) pero sin handler | 🟡 ALTA | Fase 3 |
| **Integración VistaResultadosMatriz** | Componente existe pero flujo `reportType === 'AnalisisMatriz'` no integrado | 🟡 ALTA | Fase 2 |
| **Validación backend** | Todas las validaciones son client-side | 🟡 ALTA | Fase 2 |
| **Notificaciones real-time** | Sin WebSocket ni Server-Sent Events | 🟢 MEDIA | Fase 3 |

---

## 3. Flujos funcionales verificados

### 3.1 Flujo Individual (Happy Path)

```
1. Usuario hace click en análisis (tabla principal)
   → setSelectedAnalysisId = analysis.id
   → setShowAnalysisList = false (oculta tabla)

2. Drawer abre automáticamente
   → isDrawerOpen = true
   → activeDrawerTab = 'generar'
   → reportType = 'Individual' (default)

3. Usuario escribe en search
   → setSearchTerm (triggerea filtrado)
   → filteredColaboradores retorna coincidencias
   → Dropdown muestra sugerencias

4. Usuario click en colaborador
   → setSelectedColaborador = 'Elkin Garcia Salazar'
   → setShowSuggestions = false

5. Verifica pesos: 50% + 50% = 100% ✓
   → hasPesoError = false
   → botón "Generar" ENABLED

6. Click "Generar"
   → handleGenerateReport()
   → Valida selectedColaborador (línea 215)
   → Simula 1.5s (línea 234)
   → Verifica isErrorDemoMode (selectedAnalysisId === 2)
   → Si exitoso:
      ├─ window.open('?pdf-preview=true', '_blank') abre PDF nueva pestaña
      ├─ Automáticamente salta a tab "Descargas"
      ├─ Agrega a downloadingReports con status 'completed' (línea 269-279)
      └─ Historial auto-agregado (línea 75-91)

7. Usuario puede ver en panel flotante o tab "Descargas"
   → Nombre: "Elkin Garcia Salazar"
   → Status: ✓ completed (100%)
   → Botón "Ver" disponible
```

### 3.2 Flujo Masivo (Happy Path)

```
1-2. Análisis seleccionado, drawer abierto (igual que individual)

3. reportType = 'Masivo'
   → alcance dropdown aparece
   → Default: "Todos los colaboradores en el análisis"

4. Usuario puede cambiar alcance a:
   - "Todos los colaboradores" → 10 colaboradores
   - "Área" → multi-select (Tecnología, Ventas, Marketing, etc.)
   - "Líder" → multi-select (Juan Pérez, María González, etc.)
   - "País" → multi-select (México, Colombia, etc.)
   - "Ciudad" → multi-select (Bogotá, Medellín, etc.)

5. Click "Generar"
   → handleGenerateReport()
   → Valida alcance: si !== 'Todos' AND alcanceFieldValue.length === 0 → error (línea 221)
   → Simula 1.5s (línea 234)
   → startMassiveDownload() llamado (línea 258)

6. startMassiveDownload() (línea 283-334)
   → Crea reportId = Date.now()
   → Obtiene collaboratorCount = getColaboradoresCount(alcance, alcanceFieldValue)
   → Agrega a downloadingReports con status 'downloading'
   → Inicia setInterval (+1% cada 300ms)
   → Si isErrorDemoMode Y progress >= 85: 25% chance fallar (línea 305)
   → Si progress >= 100: completa (status = 'completed')

7. Tab "Descargas" muestra:
   ├─ Sección "Descargas en progreso":
   │  └─ Reporte_Masivo_[timestamp].zip → 50% → descargando
   ├─ Sección "Historial últimos 7 días":
   │  └─ Reportes previos completados
   └─ Contador: "1 reportes en cola"

8. Al completar 100%:
   → Status cambia a 'completed'
   → Auto-agregado a historial (línea 75-91)
   → Puede click "Descargar" o "Abrir carpeta" (mockeado)
```

### 3.3 Flujo Error Demo (Analysis ID 2)

```
1-6. Igual que flujo individual, pero selectedAnalysisId = 2

7. handleGenerateReport() línea 239-251:
   → isErrorDemoMode = true
   → Si reportType === 'Individual': generación FALLA siempre (50% prob línea 239)
   → Si reportType === 'Masivo' Y alcance !== 'Todos': generación FALLA (50% prob)

8. Error generación:
   → setErrorNotification() con título + mensaje
   → "No pudimos generar tu reporte"
   → Botón "Intentar de nuevo" → llama handleGenerateReport() recursivamente
   → Auto-dismiss en 4s (línea 65-72)

9. Error descarga (a 85%+ en masivo):
   → Intervalo línea 305: `Math.random() < 0.25` (25% chance)
   → Status = 'error'
   → Mostrado con ❌ icono en lista
   → Botón "Reintentar" disponible

10. handleRetryReport() (línea 355):
    → Reset progress a 0%, status = 'downloading'
    → Nuevo intervalo con +2% cada 300ms (línea 369)
    → Sin error mode en reintento (no verifica isErrorDemoMode)
    → Completa exitosamente a 100%
```

---

## 4. Validaciones implementadas

| Campo | Validación | Cuándo ejecuta | Bloquea UI |
|---|---|---|---|
| **Colaborador (Individual)** | Requerido si reportType === 'Individual' | Click "Generar" (línea 215) | SÍ - botón disabled si vacío |
| **Alcance (Masivo)** | Si alcance !== 'Todos' → alcanceFieldValue.length > 0 requerido | Click "Generar" (línea 221) | SÍ - botón disabled si vacío |
| **Pesos 360°/Objetivos** | suma DEBE = 100% | Real-time (línea 145-148) | SÍ - botón disabled + error visual |
| **Búsqueda colaborador** | Input text, autocomplete sobre 10 items hardcodeados | On-change (línea 139-143) | NO - solo UI |
| **Selección alcance** | Dropdown o multi-select según tipo | On-change | NO - solo UI |

---

## 5. Aceptación verificable

### CA-1: Generar reporte individual exitoso
**Cómo validar:**
1. Abrir análisis (ID 1 ó 4, NO 2)
2. Tipo = Individual
3. Buscar + seleccionar "Elkin Garcia Salazar"
4. Pesos = 50/50 ✓
5. Click "Generar"
6. **Verificar:** Nueva pestaña abre con PDF, tab "Descargas" muestra reporte con ✓ 100%

**Test case ID:** QA-001

### CA-2: Validación colaborador requerido
**Cómo validar:**
1. Tipo = Individual
2. NO seleccionar colaborador (campo vacío)
3. Click "Generar"
4. **Verificar:** Error rojo debajo del search field: "Por favor selecciona un colaborador"
5. **Verificar:** Botón "Generar" sigue disabled

**Test case ID:** QA-002

### CA-3: Generar masivo exitoso
**Cómo validar:**
1. Abrir análisis (ID 1 ó 4)
2. Tipo = Masivo
3. Alcance = "Todos los colaboradores en el análisis" (default)
4. Click "Generar"
5. **Verificar:** Tab "Descargas" abierto, reporte_masivo_[timestamp].zip muestra progreso 0→100%
6. **Verificar:** Status pasa 'downloading' → 'completed' en ~30s (100 incrementos × 300ms)

**Test case ID:** QA-003

### CA-4: Alcance "Todos" cuenta correcto
**Cómo validar:**
1. Tipo = Masivo, Alcance = "Todos"
2. Click "Generar"
3. **Verificar:** Lado derecho del alcance muestra "(10 colaboradores)"
4. **Verificar:** Lista descargando muestra "Colaborator Count: 10"

**Test case ID:** QA-004

### CA-5: Alcance "Área" filtra correcto
**Cómo validar:**
1. Tipo = Masivo
2. Alcance = "Área"
3. Check "Tecnología" (5 colaboradores: Adam, Bayron, Elkin, Sofia, Juan)
4. **Verificar:** Muestra "(5 colaboradores)"
5. Click "Generar"
6. **Verify:** downloadingReports.collaboratorCount = 5

**Test case ID:** QA-005

### CA-6: Error pesos !== 100%
**Cómo validar:**
1. Cambiar 360° a 60% (Objetivos sigue 50%)
2. **Verificar:** Error inline "Los pesos deben sumar 100%. Actual: 110%"
3. **Verificar:** Botón "Generar" DISABLED
4. Cambiar Objetivos a 40%
5. **Verificar:** Error desaparece, botón ENABLED

**Test case ID:** QA-006

### CA-7: Notificación error auto-dismiss
**Cómo validar:**
1. Abrir análisis ID 2 (demo error mode)
2. Generar individual
3. **Verificar:** Notificación roja aparece con "No pudimos generar"
4. **Esperar:** 4 segundos
5. **Verify:** Notificación desaparece automáticamente

**Test case ID:** QA-007

### CA-8: Reintento descarga fallida
**Cómo validar:**
1. Generar masivo análisis ID 2
2. Esperar a error (25% chance a 85%+, puede tomar varios intentos)
3. **Verificar:** Status = error, ❌ icono visible
4. Click "Reintentar"
5. **Verificar:** Progress vuelve a 0%, status = 'downloading'
6. **Verificar:** Progresa +2% cada 300ms (más rápido que +1%)
7. **Verificar:** Completa sin error adicional a 100%

**Test case ID:** QA-008

### CA-9: Historial últimos 7 días
**Cómo validar:**
1. Generar reporte individual
2. Generar reporte masivo (2 reportes)
3. Ir a tab "Descargas" → sección inferior "Historial"
4. **Verificar:** Muestra 2 reportes con fechas de hoy
5. Cerrar drawer, reabrirlo
6. **Verificar:** Historial persiste (en sesión, no en BD)
7. Refresh página
8. **Verificar:** Historial desaparece (no persistido a BD)

**Test case ID:** QA-009

### CA-10: Resetear campos al cerrar
**Cómo validar:**
1. Abrir drawer, tipo = Individual
2. Seleccionar "Elkin Garcia Salazar"
3. Cambiar 360° a 70%, Objetivos a 30%
4. Cerrar drawer
5. Reabrir drawer
6. **Verify:** 
   - searchTerm = ''
   - selectedColaborador = ''
   - peso360 = '50'
   - pesoObjetivos = '50'
   - reportType = 'Individual'

**Test case ID:** QA-010

### CA-11: Panel flotante minimizable
**Cómo validar:**
1. Generar masivo (descargando)
2. Panel flotante visible en bottom-right
3. Click botón minimizar
4. **Verify:** Panel colapsa a icono pequeño flotante
5. Click icono
6. **Verify:** Panel expande nuevamente
7. **Verify:** Estado de descarga persiste (progreso actualizado)

**Test case ID:** QA-011

### CA-12: PDF preview modo
**Cómo validar:**
1. Navegar a `http://localhost:5173/?pdf-preview=true`
2. **Verify:** Componente VistaPreviaPdfReporteEjecutivoFinalNuevoAzul0C5Bef renderiza fullscreen
3. **Verify:** No hay drawer ni tabla de análisis visible
4. Cerrar pestaña y volver a localhost:5173
5. **Verify:** Vuelve a la pantalla normal (lista análisis)

**Test case ID:** QA-012

### CA-13: Tab switching
**Cómo validar:**
1. Abrir drawer
2. Click tab "Generar reporte"
3. **Verify:** Formulario visible (search, alcance, pesos)
4. Click tab "Descargas"
5. **Verify:** Lista descargas visible (progreso + historial)
6. Click "Generar"
7. **Verify:** Auto-salta a tab "Descargas"

**Test case ID:** QA-013

---

## 6. Casos QA exhaustivos

### Tabla de cobertura

| ID | Descripción | Tipo | Precondición | Pasos | Resultado esperado | 
|---|---|---|---|---|---|
| QA-001 | Generar individual exitoso | Happy Path | Análisis 1 ó 4 | Ver CA-1 | PDF abre + historial actualizado |
| QA-002 | Validar colaborador requerido | Error | Individual seleccionado | Ver CA-2 | Error "Por favor selecciona" |
| QA-003 | Generar masivo exitoso | Happy Path | Análisis 1 ó 4 | Ver CA-3 | ZIP simulado 0→100% |
| QA-004 | Contar colaboradores "Todos" | Validation | Masivo seleccionado | Ver CA-4 | "(10 colaboradores)" |
| QA-005 | Contar colaboradores "Área" | Validation | Masivo + Área | Ver CA-5 | "(5 colaboradores)" |
| QA-006 | Validar pesos !== 100% | Error | Individual seleccionado | Ver CA-6 | Botón disabled + error |
| QA-007 | Error auto-dismiss 4s | Behavior | Demo error (ID 2) | Ver CA-7 | Notificación desaparece |
| QA-008 | Reintento descarga fallida | Recovery | Masivo con error | Ver CA-8 | Reinicia progreso, +2% |
| QA-009 | Historial últimos 7 días | Persistence | Reportes generados | Ver CA-9 | Muestra, persiste sesión, NO persiste reload |
| QA-010 | Resetear campos al cerrar | State | Drawer abierto con datos | Ver CA-10 | Todos los campos = default |
| QA-011 | Panel minimizable | UI | Descarga en progreso | Ver CA-11 | Minimiza/expande, estado persiste |
| QA-012 | PDF preview modo | Navigation | URL `?pdf-preview=true` | Ver CA-12 | Fullscreen PDF, sin drawer |
| QA-013 | Tab switching | Navigation | Drawer abierto | Ver CA-13 | Tabs funcionales, auto-jump |
| QA-014 | Error alcance requerido | Validation | Masivo + Área seleccionada | Click Generar sin multi-select | Error "Por favor selecciona" |
| QA-015 | Multi-análisis simultáneos | Load | 2 reportes masivos | Generar masivo 2 veces | Ambos descargando simultáneamente, contador = "2" |
| QA-016 | Error generación Analysis 2 | Demo | Analysis ID 2, Individual | Generar individual | Falla, error notification |
| QA-017 | Error descarga masivo 85% | Demo | Analysis ID 2, Masivo | Generar masivo, esperar 85%+ | 25% chance error |
| QA-018 | Búsqueda colaborador case-insensitive | Validation | Individual seleccionado | Type "ELKIN" | Muestra "Elkin Garcia Salazar" |
| QA-019 | Búsqueda colaborador filtrado | Validation | Individual seleccionado | Type "Garcia" | Muestra "Elkin Garcia Salazar", "Bayron Jesid Garcia" |
| QA-020 | Empty dropdown si no hay búsqueda | Validation | Drawer abierto | Hacer click en search sin text | Dropdown vacío (NO muestra todos) |

---

## 7. Preguntas abiertas explícitas

### 🔴 CRÍTICA - Resolver antes de Fase 2

| ID | Pregunta | Impacto | Dueño | Status |
|---|---|---|---|---|
| **Q1** | ¿Personalizar PDF por colaborador o siempre Valentina Mendoza? | UI/Backend | Product | ABIERTO |
| **Q2** | ¿Guardar historial en localStorage (sesión) o en BD? | Architecture | Backend | ABIERTO |
| **Q3** | ¿Generar ZIP real en backend o mockear siempre? | Backend | Backend | ABIERTO |
| **Q4** | ¿Qué pesos por defecto después de Fase 1? ¿Siempre 50/50? | UX/PM | Product | ABIERTO |

### 🟡 ALTA - Resolver antes de producción

| ID | Pregunta | Impacto | Dueño | Status |
|---|---|---|---|---|
| **Q5** | ¿Integrar VistaResultadosMatriz en flujo principal? (reportType='AnalisisMatriz') | Architecture | Product | ABIERTO |
| **Q6** | ¿Cuándo habilitar permisos RBAC por rol (Manager vs Head vs Analista)? | Security | Product + Backend | ABIERTO |
| **Q7** | ¿Error demo mode (ID 2) debe quedar en producción o remover? | Testing/Dev | QA + Dev | ABIERTO |
| **Q8** | ¿Validaciones se replican en backend o solo frontend? | Security | Backend | ABIERTO |

### 🟢 MEDIA - Roadmap futuro

| ID | Pregunta | Impacto | Dueño | Status |
|---|---|---|---|---|
| **Q9** | ¿Implementar "Analizar con IA" usando LLM? | UX/Backend | Product + AI | BACKLOG |
| **Q10** | ¿Exportar a múltiples formatos (XLSX, CSV) además de PDF/ZIP? | UX | Product | BACKLOG |

---

## 8. Estructura de ficheros

```
src/
├── app/
│   ├── App.tsx (2470 líneas)
│   │   ├── Estado principal (7-44)
│   │   ├── Colaboradores hardcodeados (95-106)
│   │   ├── Análisis list hardcodeados (423-434)
│   │   ├── handleGenerateReport() (209-281)
│   │   ├── startMassiveDownload() (283-334)
│   │   └── handleRetryReport() (355-378)
│   └── components/
│       └── ui/ (50+ componentes Radix - NO usados extensivamente)
│
└── imports/
    ├── VistaPreviaPdfReporteEjecutivoFinalNuevoAzul0C5Bef/ (2470 líneas)
    │   └── Componente PDF estático (Valentina Mendoza)
    └── VistaResultadosMatriz/ (Importado, NO integrado)
```

---

## 9. Dependencias críticas

| Librería | Versión | Usada para | Crítica |
|---|---|---|---|
| React | 18.3.1 | UI/Hooks | SÍ |
| Vite | 6.3.5 | Build | SÍ |
| Tailwind CSS | 4.1.12 | Styling | SÍ |
| html2canvas | 1.4.1 | PDF snapshot (posible) | Instalada |
| jsPDF | 2.5.2 | PDF generation (posible) | Instalada |
| Recharts | 2.15.2 | Charts (NO usada) | Instalada |
| Radix UI | Múltiples | Componentes (50+, parcialmente usados) | Parcial |

---

## 10. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| **Demo error mode (ID 2) en producción** | MEDIA | Usuarios no pueden generar reportes | Remover selectedAnalysisId === 2 antes de deploy |
| **PDF estático siempre Valentina** | MEDIA | Confusión usuarios sobre personalización | Confirmar con Product si es intencional o cambiar |
| **Historial pierde en refresh** | BAJA | Mala UX si usuarios esperan persistencia | Documentar que NO persiste, agregar localStorage si crítico |
| **+1% cada 300ms muy rápido/lento** | BAJA | Progreso irreal para usuarios | Ajustar intervalo según feedback real |
| **Alcance "Todos" siempre = 10** | MEDIA | Números falsos si dataset crece | Backend debe calcular reales |

---

## 11. Checklist pre-Fase 2

- [ ] Q1-Q4 resueltas con PM
- [ ] Decision: ¿remover demo error mode o mantener?
- [ ] Decision: ¿personalizar PDF o mantener estático?
- [ ] Backend: API generación PDF especificada
- [ ] Backend: API descarga masiva especificada  
- [ ] Backend: Schema historial definido
- [ ] QA: Todos los casos QA-001 a QA-020 ejecutados exitosamente
- [ ] Security: Validaciones replicated en backend confirmadas
- [ ] Permisos: RBAC especificado si requerido para Fase 2

---

**Generado:** 2026-04-28
**Verificado contra:** App.tsx línea por línea
**Estado:** LISTO PARA QA / FASE 2
