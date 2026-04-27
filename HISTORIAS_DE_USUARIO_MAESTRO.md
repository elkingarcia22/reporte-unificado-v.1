# Reporte Maestro de Historias de Usuario
## Sistema de Generación de Reportes de Análisis de Talento

**Versión:** 1.0  
**Fecha:** Abril 2026  
**Propósito:** Guía completa para desarrolladores sobre casos de uso, validaciones y manejo de errores

---

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Flujos Happy Path](#flujos-happy-path)
3. [Validaciones de Campos](#validaciones-de-campos)
4. [Casos de Error](#casos-de-error)
5. [Flujos de Descarga](#flujos-de-descarga)
6. [Estados y Transiciones](#estados-y-transiciones)

---

## Descripción General

### Pantallas Principales

#### 1. **Pantalla de Análisis (Home)**
- Lista de análisis disponibles
- Dos opciones principales:
  - **Análisis Q2 2025** (Happy Path - Sin errores)
  - **Análisis de Talento Semestre 2 2024** (Demo de Errores)

#### 2. **Vista de la Matriz de Talento**
- Visualización de la matriz 9-box
- Acciones principales en la cabecera (orden de izquierda a derecha):
  1. **Generar reporte unificado** (Botón primario, azul)
  2. **Descargar** (Botón secundario, blanco, con etiqueta y menú dropdown)
  3. **Editar** (Icono de edición)
  4. **Eliminar** (Icono de eliminación)

#### 3. **Pantalla de Generación de Reportes (Drawer)**
- Formulario de entrada para reportes
- Vista de descarga en progreso
- Gestión de reportes descargados

---

## Flujos Happy Path

### Flujo 1: Reporte Individual (Análisis Q2 2025)

**Usuario:** Analista RH  
**Objetivo:** Generar un reporte individual para un colaborador específico

#### Pasos:

1. **Seleccionar Análisis Q2 2025**
   - Usuario hace clic en "Ver análisis"
   - Sistema carga la vista de formulario

2. **Configuración del Reporte**
   - Tipo de Reporte: "Individual"
   - Seleccionar Colaborador: "Elkin Garcia Salazar"
   - Peso 360: 50
   - Peso Objetivos: 50

3. **Generación**
   - Click en "Generar reporte"
   - Sistema inicia descarga automática
   - Panel de progreso aparece en esquina inferior derecha

4. **Monitoreo de Descarga**
   - Barra de progreso visible
   - Estado: "Descargando reportes"
   - Botón para minimizar panel

5. **Finalización**
   - Reporte se completa al 100%
   - Mensaje: "Reportes generados y descargados. Listos para visualizar."
   - Botón "Abrir carpeta de descargas" disponible
   - Opción: "Generar más reportes" o "Cerrar"

**Resultado Esperado:**
- ✅ Archivo PDF descargado exitosamente
- ✅ Notificación visual de completitud
- ✅ Carpeta de descargas accesible

---

### Flujo 2: Reporte Masivo por Empresa (Análisis Q2 2025)

**Usuario:** Gestor RH  
**Objetivo:** Generar reportes para toda la empresa

#### Pasos:

1. **Configuración**
   - Tipo de Reporte: "Masivo"
   - Alcance: "Toda la empresa"
   - Peso 360: 50
   - Peso Objetivos: 50

2. **Validación**
   - Sistema valida que no hay campos adicionales requeridos
   - Habilita botón "Generar más reportes"

3. **Generación en Cola**
   - Click en "Generar más reportes"
   - Se agregan reportes a la cola de descarga
   - Panel muestra "X reportes en cola"
   - Descarga inicia automáticamente

4. **Monitoreo**
   - Panel minimizado muestra progreso
   - Usuario puede continuar generando más reportes
   - Texto: "X reportes en cola"

5. **Completitud**
   - Todos los reportes se descargan sin errores
   - Mensaje: "Descargas completadas"
   - Icono: Checkmark verde

**Resultado Esperado:**
- ✅ Múltiples archivos PDF descargados
- ✅ Cola procesada completamente
- ✅ Interfaz responsiva durante descarga

---

### Flujo 3: Reporte Masivo por Área (Análisis Q2 2025)

**Usuario:** Analista RH  
**Objetivo:** Generar reportes para un área específica

#### Pasos:

1. **Configuración**
   - Tipo de Reporte: "Masivo"
   - Alcance: "Área"
   - Campo Área: "Tecnología"
   - Peso 360: 60
   - Peso Objetivos: 40

2. **Validación de Campo**
   - Sistema valida que "Tecnología" existe en BD
   - Cuenta 3 colaboradores en área Tecnología
   - Campo válido, botón habilitado

3. **Generación**
   - Click en "Generar más reportes"
   - Sistema crea 3 reportes (uno por colaborador)
   - Inicia descarga en paralelo

4. **Monitoreo**
   - Panel muestra: "3 reportes en cola"
   - Progreso individual visible para cada reporte
   - Usuarios pueden minimizar sin interrumpir

5. **Completitud**
   - 3 reportes descargados: 100%
   - Carpeta contiene archivos nombrados por colaborador
   - Opción para abrir carpeta

**Resultado Esperado:**
- ✅ 3 archivos generados y descargados
- ✅ Nombrado apropiadamente
- ✅ Sin errores en validación o descarga

---

### Flujo 4: Reporte Masivo por Líder (Análisis Q2 2025)

**Usuario:** Gerente de Operaciones  
**Objetivo:** Obtener reportes de su equipo directo

#### Configuración Similar:
- Tipo de Reporte: "Masivo"
- Alcance: "Líder"
- Campo Líder: "Juan Pérez"
- Resultado: 3 reportes (colaboradores bajo Juan Pérez)

**Casos Válidos:**
- Juan Pérez: 3 colaboradores
- María González: 2 colaboradores
- Carlos Rodríguez: 2 colaboradores
- Ana Martínez: 1 colaborador

---

### Flujo 5: Reporte Masivo por País (Análisis Q2 2025)

**Usuario:** Coordinador Regional  
**Objetivo:** Análisis de talento por región

#### Configuración:
- Tipo de Reporte: "Masivo"
- Alcance: "País"
- Campo País: "Colombia"
- Resultado: 4 reportes

**Países Válidos:**
- Colombia: 4 colaboradores
- México: 2 colaboradores
- Argentina: 2 colaboradores
- Chile: 2 colaboradores
- Perú: 1 colaborador

---

### Flujo 6: Reporte Masivo por Ciudad (Análisis Q2 2025)

**Usuario:** Gestor Local  
**Objetivo:** Análisis por ubicación física

#### Configuración:
- Tipo de Reporte: "Masivo"
- Alcance: "Ciudad"
- Campo Ciudad: "Bogotá"
- Resultado: 3 reportes

**Ciudades Válidas:**
- Bogotá: 3 colaboradores
- Ciudad de México: 1 colaborador
- Guadalajara: 1 colaborador
- Buenos Aires: 1 colaborador
- Córdoba: 1 colaborador
- Santiago: 1 colaborador
- Valparaíso: 1 colaborador
- Medellín: 1 colaborador
- Lima: 1 colaborador

---

## Validaciones de Campos

### Campo: Colaborador (Reporte Individual)

**Validación:** Requerido si tipo = "Individual"

```
Condición: showColaboradorError === true
Mensaje: "Por favor selecciona un colaborador antes de generar el reporte."
Color: Rojo (#D92D20)
Ubicación: Debajo del campo de entrada
Trigger: Click en "Generar reporte" sin seleccionar colaborador
```

**Colaboradores Válidos:**
1. Adam Andres Abril Acebes - Área: Tecnología
2. Andres Camilo Torres - Área: Ventas
3. Bayron Jesid Garcia - Área: Tecnología
4. Estefanía Rojas Acosta - Área: Marketing
5. Elkin Garcia Salazar - Área: Tecnología
6. María González López - Área: RH
7. Carlos Martínez Ruiz - Área: Operaciones
8. Ana Fernández Castro - Área: Ventas
9. Luis Ramírez Pérez - Área: Marketing
10. Sofia Hernández Vega - Área: Tecnología

---

### Campo: Alcance (Reporte Masivo)

**Validación:** Requerido si tipo = "Masivo"

```
Tipo: Dropdown
Opciones: Toda la empresa, Área, Líder, País, Ciudad
Comportamiento: Expandible con búsqueda
```

**Comportamiento por Selección:**

#### Selección: "Toda la empresa"
```
Validación: NINGUNA
Campo Adicional: NO
Acción: Genera reportes para los 10 colaboradores
Mensaje: "Toda la empresa seleccionada"
```

#### Selección: "Área"
```
Validación: REQUERIDA
Campo Adicional: Sí (Dropdown "Seleccionar Área")
Opciones del Dropdown:
  - Tecnología (4 colaboradores)
  - Ventas (2 colaboradores)
  - Marketing (2 colaboradores)
  - Operaciones (1 colaborador)
  - Recursos Humanos (1 colaborador)

Mensaje Error (si no selecciona):
"Debes seleccionar un área para generar los reportes masivos."

Comportamiento del Dropdown de Área:
- Muestra lista de áreas disponibles
- Búsqueda activa
- Si fetchDataError === true: Mensaje "Error al cargar datos"
```

#### Selección: "Líder"
```
Validación: REQUERIDA
Campo Adicional: Sí (Dropdown "Seleccionar Líder")
Opciones del Dropdown:
  - Juan Pérez (3 colaboradores)
  - María González (2 colaboradores)
  - Carlos Rodríguez (2 colaboradores)
  - Ana Martínez (1 colaborador)

Mensaje Error:
"Debes seleccionar un líder para generar los reportes masivos."

Comportamiento:
- Dropdown expandible
- Búsqueda funcional
- Manejo de errores de datos
```

#### Selección: "País"
```
Validación: REQUERIDA
Campo Adicional: Sí (Dropdown "Seleccionar País")
Opciones del Dropdown:
  - Colombia (4 colaboradores)
  - México (2 colaboradores)
  - Argentina (2 colaboradores)
  - Chile (2 colaboradores)
  - Perú (1 colaborador)

Mensaje Error:
"Debes seleccionar un país para generar los reportes masivos."
```

#### Selección: "Ciudad"
```
Validación: REQUERIDA
Campo Adicional: Sí (Dropdown "Seleccionar Ciudad")
Usa lista completa de ciudades
Mensaje Error:
"Debes seleccionar una ciudad para generar los reportes masivos."
```

---

### Campos: Peso 360 y Peso Objetivos

**Validación:** Formato numérico

```
Tipo: Input numérico
Rango: 0-100
Comportamiento: Suma = 100
Validación en Tiempo Real: SÍ
Default: 50, 50

Nota Importante:
- Actualmente NO hay validación de suma = 100
- Implementar si es requerido en futuro
- Valores aceptados: cualquier número 0-100
```

---

### Validación de Dropdown (Área, Líder, País, Ciudad)

**Error de Carga de Datos:**

```
Estado: fetchDataError === true
Trigger: Fallo al cargar opciones del dropdown

Interfaz Error:
├── Ícono: Error rojo (#D92D20)
├── Mensaje: "Error al cargar datos"
└── Ubicación: Centro del dropdown

Comportamiento:
- Impide selección de opciones
- Usuario puede cerrar dropdown y reintentar
- Toast notifica el error al usuario
```

---

### Validación: Campo de Entrada de Búsqueda

**Campo: "Seleccionar/Ingresar [Área/Líder/País/Ciudad]"**

```
Tipo: Input text + Dropdown
Validación: Campo obligatorio si alcance ≠ "Toda la empresa"

Error Vacío:
Mensaje: "Debes ingresar un valor para Columna A." (varía según campo)
Condición: showAlcanceFieldError === true
Color: Rojo (#D92D20)

Comportamiento:
- Rojo en borde cuando vacío + botón presionado
- Limpia error cuando usuario empieza a escribir
- onChange: setShowAlcanceFieldError(false)
```

---

## Casos de Error

### Análisis de Talento Semestre 2 2024 - Modo Demo de Errores

**Importante:** Los siguientes errores SOLO ocurren en "Análisis de Talento Semestre 2 2024"  
Condición: `selectedAnalysisId === 2` (isErrorDemoMode = true)

---

### Error 1: Fallo en Generación de Reporte Individual

**Trigger:** Generar reporte tipo "Individual"  
**Tasa:** 100% (siempre falla)

```
Acción: Click en "Generar reporte" con colaborador seleccionado

Flujo:
1. Panel de descarga aparece
2. Reporte comienza con estado "downloading"
3. Después de 2-3 segundos, estado cambia a "error"
4. Icono: Círculo rojo con X
5. Sin barra de progreso
6. Botón: "Reintentar"

Toast Notification:
├── Título: "Error al generar reporte"
├── Mensaje: "No se pudo generar el reporte individual"
├── Duración: 4 segundos (auto-dismiss)
├── Ubicación: Centro-abajo
├── Color: Rojo/Naranja
└── Cierre: Botón X

Comportamiento Usuario:
- Puede hacer click en "Reintentar" (fallará nuevamente)
- Puede cerrar el panel
- Puede intentar con otro colaborador (también fallará)

Estado del Drawer:
- No muestra "Descargas completadas"
- No muestra botón "Abrir carpeta"
- Mantiene contador de reportes
```

---

### Error 2: Fallo en Generación Masiva por Filtro (Área, Líder, País, Ciudad)

**Trigger:** Generar reporte masivo con filtro (no "Toda la empresa")  
**Tasa:** 100% (siempre falla)

```
Ejemplo: 
- Tipo: Masivo
- Alcance: Área
- Área: Tecnología

Resultado: 4 reportes generados, todos fallan

Flujo por Reporte:
1. Inicia descarga (estado: downloading)
2. Icono: Spinner azul
3. Barra de progreso visible
4. Después de 2-3 segundos: error
5. Icono: Círculo rojo con X
6. Botón: "Reintentar"

Toast para cada error:
├── Título: "Error al generar reporte"
├── Mensaje: Varía según el reporte
├── Auto-cierre: 4 segundos
└── Apilables: Sí (múltiples toasts)

UI del Drawer:
- Título: "Descargando reportes" (NO "Descargas completadas")
- Botón "Abrir carpeta": OCULTO
- Mensajes de completitud: OCULTOS
```

---

### Error 3: Fallo en Generación Masiva "Toda la Empresa"

**Trigger:** Generar reporte masivo con alcance "Toda la empresa"  
**Tata:** 0% (ÉXITO - No falla)

```
Comportamiento: Happy path normal
- Genera 10 reportes (todos los colaboradores)
- Todos se descargan exitosamente
- Mensaje: "Reportes generados y descargados"
- Botón: "Abrir carpeta" visible
```

---

### Error 4: Fallo al Detener Descarga Individual

**Trigger:** Click en botón detener (X) en un reporte  
**Acción:** Confirmar "Sí, detener"  
**Tata:** 100% (siempre falla la cancelación)

```
Flujo:
1. Usuario hace click en botón detener
2. Aparece modal de confirmación:
   "¿Detener la descarga de [Nombre Reporte]?"
   - Botón: "Sí, detener" (rojo)
   - Botón: "No, continuar" (blanco)

3. Si hace click "Sí, detener":
   Toast Error:
   ├── Título: "Error al detener descarga"
   ├── Mensaje: "No se pudo detener la descarga"
   ├── Ícono: X en círculo rojo
   └── Auto-cierre: 4 segundos

4. Reporte continúa descargando
5. Modal desaparece
6. Usuario puede reintentar

Casos:
- Modal pequeño (floating panel): Confirmación inline
- Drawer: Confirmación inline
- Mismo comportamiento en ambos
```

---

### Error 5: Fallo al Cancelar Todas las Descargas

**Trigger:** Click en "Cancelar descarga" (drawer) o botón X (floating panel)  
**Acción:** Confirmar cancelación de todas las descargas  
**Tata:** 100% (siempre falla)

```
Flujo:
1. Usuario hace click en "Cancelar descarga"
2. Modal de confirmación:
   "¿Cancelar todas las descargas en progreso?"
   Texto: "Se perderá todo el progreso de los reportes que se están descargando"
   - Botón: "Sí, cancelar" (rojo)
   - Botón: "No, continuar" (blanco)

3. Si hace click "Sí, cancelar":
   Toast Error:
   ├── Título: "Error al cancelar descargas"
   ├── Mensaje: "No se pudieron cancelar las descargas"
   ├── Color: Rojo
   └── Auto-cierre: 4 segundos

4. Todas las descargas continúan
5. Panel permanece visible
6. Usuario ve actualización de progreso

Ubicación Modal:
- En Drawer: Botón grande rojo al pie
- En Floating Panel: No aplica (miniaturizado)
```

---

### Error 6: Fallo al Abrir Carpeta

**Trigger:** Click en "Abrir carpeta de descargas"  
**Tata:** 35% (aleatorio)

```
Comportamiento Actual:
- Intento de abrir carpeta del sistema
- Si falla: Toast error simple

Toast Error:
├── Mensaje: (actualmente genérico)
├── Ubicación: Centro-abajo
└── Auto-cierre: 4 segundos

Nota: Este error ocurre en ambos análisis (Q2 2025 y Talento Semestre 2)
```

---

### Error 7: Fallo en Cargar Datos de Dropdown

**Trigger:** Click en dropdown (Área, Líder, País, Ciudad)  
**Tata:** Configurable (actualmente implementado con `fetchDataError`)

```
Interfaz Error:
├── Ícono: Error rojo (#D92D20)
├── Mensaje principal: "Error al cargar datos"
├── Ubicación: Centro del dropdown
└── Altura: Ocupa el espacio normalmente usado por opciones

Comportamiento:
- Dropdown no permite selección
- Usuario NO puede hacer click en opciones
- Debe cerrar dropdown y reintentar
- Botón de generar reportes DESHABILITADO hasta resolver

Toast Notificación:
├── Título: "Error de conexión"
├── Mensaje: "No se pudieron cargar las opciones"
└── Auto-cierre: 4 segundos
```

---

## Flujos de Descarga

### Panel de Descarga - Drawer (Lado Izquierdo)

**Activación:** Click en "Generar reporte" o "Generar más reportes"

```
Estructura:
┌─────────────────────────────────┐
│ Descargando reportes    [X]     │ (header)
│ 1 reporte en cola               │ (sub-header)
├─────────────────────────────────┤
│                                 │
│ [Reporte 1 Name]         0%    │
│ [Spinner] 0% [X]               │ (downloading)
│ ┌─────────────────────────┐    │
│ │████░░░░░░░░░░░░░░░░░░░│    │ (progress bar)
│ └─────────────────────────┘    │
│ 10 colaboradores                │
│                                 │
│ [Reporte 2 Name]         50%   │
│ [Spinner] 50% [X]              │
│ ┌─────────────────────────┐    │
│ │████████████░░░░░░░░░░░│    │
│ └─────────────────────────┘    │
│ 10 colaboradores                │
│                                 │
│ [Reporte 3 Name]        ERROR   │
│ [X-rojo] Reintentar             │ (error state)
│ (sin barra de progreso)         │
│                                 │
├─────────────────────────────────┤
│ [Generar más] [Minimizar] [X]  │ (footer)
└─────────────────────────────────┘
```

**Estados de Reporte:**

#### Downloading
```
Icono: Spinner azul animado (#0C5BEF)
Tamaño: 5x5 px
Botón Detener: X pequeño a la derecha
Barra Progreso: Visible y animada
Porcentaje: Actualiza en tiempo real
```

#### Completed
```
Icono: Checkmark en círculo verde (#17B26A)
Tamaño: 5x5 px
Botón Detener: OCULTO
Barra Progreso: 100%
Porcentaje: 100%
Descripción de alcance: Visible
```

#### Error
```
Icono: X en círculo rojo (#D92D20)
Tamaño: 5x5 px
Botón Detener: OCULTO
Botón Reintentar: Visible (azul)
Barra Progreso: OCULTA
Descripción de alcance: OCULTA
```

---

### Panel de Descarga - Floating Panel Minimizado

**Activación:** Usuario hace click en minimizar o cuando hay errores

```
Estados Posibles:

1. EN PROGRESO
   ┌──────────────────────┐
   │ [↓] Generando...     │
   │ X en cola    [↑][X]  │
   └──────────────────────┘
   
2. COMPLETADO (sin errores)
   ┌──────────────────────┐
   │ [✓] Descarga completada │
   │                      │
   │ [↑][X]               │
   └──────────────────────┘

3. CON ERRORES
   ┌──────────────────────┐
   │ [✗] La descarga falló │
   │                      │
   │ [↑][X]               │
   └──────────────────────┘
```

**Botones:**
- `[↑]` Expandir: Abre panel completo
- `[X]` Cerrar: Cierra descarga completamente

---

### Transiciones de Estado

```
NORMAL FLOW (Q2 2025):
downloading → completed → mensaje éxito → abrir carpeta

ERROR FLOW (Talento Semestre 2 2024):
downloading → error → toast error → opción reintentar o descartar

MINIMIZADO:
expanded state → click minimizar → minimized state → expansible
minimized + error → rojo X + título "La descarga falló"
minimized + success → verde ✓ + título "Descarga completada"
```

---

## Estados y Transiciones

### Estado Global: `isErrorDemoMode`

```typescript
isErrorDemoMode = selectedAnalysisId === 2

Comportamiento:
- true: Todos los errores activos (Talento Semestre 2 2024)
- false: Sin errores (Análisis Q2 2025)
```

### Estados Locales de Reporte

```typescript
type ReportStatus = 'downloading' | 'completed' | 'error'

Reporte {
  id: number
  name: string
  progress: number (0-100)
  status: ReportStatus
}
```

### Transiciones Permitidas

```
downloading
  ├─→ completed (exitoso)
  └─→ error (fallo)

completed
  └─→ completed (fin final)

error
  ├─→ downloading (usuario hace click "Reintentar")
  └─→ error (fin final si no reintenta)
```

### Toast Notifications

```
Estructura:
{
  title: string
  message: string
  actionLabel?: string (no se usa actualmente)
  onAction?: () => void (no se usa actualmente)
}

Ciclo de Vida:
1. Creado: setErrorNotification(...)
2. Mostrado: 4 segundos
3. Auto-dismiss: setTimeout(() => setErrorNotification(null), 4000)
4. Manual: Click en botón X

Ubicación: Centro-abajo de la pantalla
Tamaño: max-width: 448px (max-w-md)
```

---

## Matriz de Casos de Prueba

### Happy Path (Análisis Q2 2025)

| # | Tipo | Alcance | Input | Resultado Esperado |
|---|------|---------|-------|-------------------|
| 1 | Individual | - | Elkin Garcia | ✅ 1 reporte descargado |
| 2 | Masivo | Toda la empresa | - | ✅ 10 reportes descargados |
| 3 | Masivo | Área | Tecnología | ✅ 4 reportes descargados |
| 4 | Masivo | Área | Ventas | ✅ 2 reportes descargados |
| 5 | Masivo | Líder | Juan Pérez | ✅ 3 reportes descargados |
| 6 | Masivo | País | Colombia | ✅ 4 reportes descargados |
| 7 | Masivo | Ciudad | Bogotá | ✅ 3 reportes descargados |

---

### Error Cases (Análisis de Talento Semestre 2 2024)

| # | Tipo | Acción | Resultado Esperado |
|---|------|--------|-------------------|
| 1 | Individual | Generar | ❌ Falla al 100% |
| 2 | Masivo | Área: Tecnología | ❌ 4 reportes fallan |
| 3 | Masivo | País: Colombia | ❌ 4 reportes fallan |
| 4 | Individual | Detener + Confirmar | ❌ Falla cancelación |
| 5 | Masivo | Cancelar todo + Confirmar | ❌ Falla cancelación |
| 6 | Cualquiera | Abrir carpeta (35% casos) | ❌ Puede fallar |
| 7 | Cualquiera | Dropdown carga | ❌ Error datos |

---

## Mensajes de Error Detallados

### Toast de Generación Fallida

```
Título: "Error al generar reporte"
Mensaje: "No se pudo generar el reporte individual"
Duración: 4 segundos
Auto-cierre: Sí
Botón X: Visible (permite cerrar antes)
```

### Toast de Cancelación Fallida

```
Título: "Error al detener descarga"
Mensaje: "No se pudo detener la descarga"
Duración: 4 segundos
Auto-cierre: Sí
```

### Toast de Cancelación Masiva Fallida

```
Título: "Error al cancelar descargas"
Mensaje: "No se pudieron cancelar las descargas"
Duración: 4 segundos
Auto-cierre: Sí
```

### Toast de Apertura de Carpeta

```
Título: "Error al abrir carpeta"
Mensaje: (genérico)
Duración: 4 segundos
Auto-cierre: Sí
```

### Validación - Campo Colaborador Vacío

```
Ubicación: Debajo del campo de entrada
Color: Rojo (#D92D20)
Mensaje: "Por favor selecciona un colaborador antes de generar el reporte."
Tamaño: text-xs
Trigger: Click "Generar reporte" sin seleccionar
```

### Validación - Campo Alcance Vacío

```
Ubicación: Debajo del dropdown
Color: Rojo (#D92D20)
Mensaje: "Debes seleccionar [un área/un líder/un país/una ciudad] para generar los reportes masivos."
Tamaño: text-xs
Trigger: Click "Generar" sin seleccionar desde dropdown
```

### Validación - Campo Búsqueda Vacío (Input Text)

```
Ubicación: Debajo del campo
Color: Rojo (#D92D20)
Mensaje: "Debes ingresar un valor para Columna A."
Tamaño: text-xs
Trigger: Click "Generar" con input text vacío
```

### Error de Carga de Dropdown

```
Ubicación: Centro del dropdown abierto
Icono: Error rojo (#D92D20)
Mensaje: "Error al cargar datos"
Altura: Completa el espacio de opciones
Comportamiento: No permite selección
Cierre: Click fuera o botón cerrar
```

---

## Guía de Implementación para Desarrolladores

### Checklist de Funcionalidades

- [ ] **Análisis Q2 2025 - Happy Path**
  - [ ] Individual: Generar y descargar (exitoso)
  - [ ] Masivo Empresa: Generar 10 reportes (exitosos)
  - [ ] Masivo Área: Dropdown carga correctamente
  - [ ] Masivo Líder: Validar datos
  - [ ] Masivo País: Validar datos
  - [ ] Masivo Ciudad: Validar datos
  - [ ] Panel descarga: Progreso visible
  - [ ] Mensaje éxito: "Reportes generados..."
  - [ ] Botón "Abrir carpeta": Visible y funcional

- [ ] **Análisis Talento Semestre 2 2024 - Error Cases**
  - [ ] Individual: Falla 100%
  - [ ] Masivo Área: Falla 100%
  - [ ] Masivo Líder: Falla 100%
  - [ ] Masivo País: Falla 100%
  - [ ] Masivo Ciudad: Falla 100%
  - [ ] Masivo Empresa: ÉXITO (no falla)
  - [ ] Detener individual: Falla confirmación
  - [ ] Cancelar todos: Falla confirmación

- [ ] **Validaciones**
  - [ ] Colaborador vacío: Mensaje error
  - [ ] Alcance vacío: Mensaje error
  - [ ] Campo búsqueda vacío: Mensaje error
  - [ ] Dropdown sin datos: Mensaje error
  - [ ] Borde rojo en campo: Color correcto

- [ ] **Toast Notifications**
  - [ ] Auto-dismiss 4 segundos
  - [ ] Botón X funcional
  - [ ] Posición centro-abajo
  - [ ] Múltiples toasts apilables
  - [ ] Color y icono correctos

- [ ] **Panel Descarga - Estados**
  - [ ] Downloading: Spinner azul + barra progreso
  - [ ] Completed: Checkmark verde + 100%
  - [ ] Error: X rojo + botón reintentar
  - [ ] Minimizado: Icono + título
  - [ ] Expandido: Lista completa

- [ ] **Drawer (Lado Izquierdo)**
  - [ ] Abre al generar
  - [ ] Muestra título correcto (Descargando vs Completadas)
  - [ ] Botón "Abrir carpeta": Visible solo si éxito
  - [ ] Botón "Abrir carpeta": Oculto si hay errores
  - [ ] Mensaje éxito: Oculto si hay errores

---

## Notas Importantes

### Sobre los Análisis

1. **Análisis Q2 2025**: Propósito educativo para demostrar happy path
2. **Análisis de Talento Semestre 2 2024**: Propósito educativo para demostrar error handling
3. Ambos accesibles desde la pantalla de análisis
4. Completamente separados en UI y lógica

### Sobre los Errores

1. Los errores son SIMULADOS (modo demo)
2. En producción, usarían APIs reales
3. La tasa de error es 100% en modo demo (excepto "Toda la empresa")
4. Los errores ocurren después de 2-3 segundos (simular tiempo real)

### Sobre las Validaciones

1. Todas las validaciones ocurren ANTES de generar
2. Campo colaborador: Solo para Individual
3. Campo alcance: Requerido para Masivo
4. Campo búsqueda: Requerido para Masivo con filtro
5. Validación en tiempo real: Ocurre en `onChange`

### Sobre la UX

1. Panel flotante minimizable
2. Permite continuar trabajando durante descarga
3. Toast notificaciones para feedback inmediato
4. Modal de confirmación para acciones destructivas
5. Estados visuales claros (spinners, checkmarks, X)

---

## Glosario

| Término | Definición |
|---------|-----------|
| **Happy Path** | Flujo exitoso sin errores |
| **Error Path** | Flujo que resultó en error |
| **Drawer** | Panel lateral izquierdo con opciones |
| **Floating Panel** | Panel flotante en esquina inferior derecha |
| **Toast** | Notificación temporal en esquina inferior |
| **Modal** | Diálogo de confirmación superpuesto |
| **Scope** | Alcance del reporte (Empresa, Área, Líder, etc.) |
| **isErrorDemoMode** | Indica si estamos en análisis con errores |
| **Colaborador** | Persona para la cual se genera reporte |
| **Alcance** | Filtro de alcance del reporte masivo |

---

## Contacto y Soporte

**Para preguntas sobre esta especificación:**
- Revisar código en: `/src/app/App.tsx`
- Estado: Versión 1.0 (Abril 2026)
- Documentación: Este archivo
- Pruebas: Usar ambos análisis para validar casos

---

**Fin del Documento**
