# Reporte Maestro de Historias de Usuario
## Sistema de Generación de Reportes de Análisis de Talento

**Versión:** 1.1  
**Fecha:** Abril 27, 2026  
**Propósito:** Guía completa para desarrolladores sobre casos de uso, validaciones y manejo de errores
**Actualización v1.1:** Multiselect con checkboxes, eliminación de funciones de detención/cancelación, y refinamiento de mensajes dinámicos.

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

> [!IMPORTANT]
> **Fuente de Datos:** Toda la información mostrada en los filtros (País, Área, Líder, Ciudad) es dinámica y se extrae en tiempo real de la base de colaboradores vinculada al análisis seleccionado.
> **Formato Masivo:** Las descargas masivas se agrupan siempre en un archivo **.ZIP** que contiene los PDFs individuales de cada colaborador.
> **Minimalismo UI:** Se han eliminado todas las opciones de "Detener" o "Cancelar" descarga para ofrecer una interfaz más limpia y directa. Una vez iniciada, la descarga progresa hasta completarse o fallar.
> **Acción de Cierre:** El botón "Cerrar" (X) del panel flotante únicamente **oculta la interfaz visual**, permitiendo que las descargas continúen en segundo plano hasta finalizar. El usuario puede volver a ver el progreso abriendo el Drawer o iniciando un nuevo reporte.

### Pantallas Principales

#### 1. **Pantalla de Análisis (Home)**
- Lista de análisis disponibles:
  - **Análisis Q2 2025** (Happy Path - Sin errores)
  - **Análisis de Talento Semestre 2 2024** (Demo de Errores)

#### 2. **Vista de la Matriz de Talento**
- Visualización de la matriz 9-box.
- **Acciones en Cabecera:**
  1. **Descargar reportes** (Botón primario, azul, con icono de descarga y menú dropdown):
     - **Resultados del análisis** (PDF)
     - **Reporte unificado** (ZIP)
  2. **Editar** (Icono de edición)
  3. **Eliminar** (Icono de eliminación)

#### 3. **Pantalla de Generación de Reportes (Drawer)**
- **Tab: Generar reporte**: Formulario de configuración (Individual o Masivo).
- **Tab: Descargas**: 
  - Gestión de reportes en progreso y completados.
  - **Sin botones de cancelación:** La interfaz solo permite monitorear el progreso o reintentar en caso de error.

#### 4. **Panel Flotante de Descargas (Mini Modal)**
- **Ubicación:** Esquina inferior derecha (visible cuando el drawer está cerrado y hay descargas activas).
- **Acciones en Cabecera (Iconos únicamente):**
  - **Ver en Drawer** (↗): Abre el drawer en la pestaña de "Descargas".
  - **Expandir/Contraer** (↕): Cambia entre vista de lista y vista compacta.
  - **Cerrar** (X): Oculta visualmente el panel de resumen (no cancela los procesos activos).
- **Estados visuales:** Cargando (spinner), Completado (check verde), Error (X roja).

---

## Flujos Happy Path

### Flujo 1: Reporte Individual (Análisis Q2 2025)

1. **Configuración:** Usuario selecciona "Individual", elige a un colaborador (ej: "Elkin Garcia") y ajusta los pesos.
2. **Generación:** Click en "Generar reporte".
3. **Proceso:** Aparece el panel de progreso. Se abre una nueva pestaña con la previsualización del PDF.
4. **Finalización:** El reporte llega al 100%. El panel muestra "Descarga completada".

### Flujo 2: Reporte Masivo (Análisis Q2 2025)

1. **Configuración:** Usuario selecciona "Masivo", elige el alcance (ej: "Todos los colaboradores en el análisis").
2. **Generación:** Click en "Generar más reportes".
3. **Proceso:** Se crea una cola de descargas. El panel flotante muestra el progreso de cada reporte.
4. **Finalización:** Todos los reportes se completan. Se habilita la opción de "Abrir carpeta de descargas" en el drawer.

---

## Validaciones de Campos

### Multiselect con Checkboxes (v1.1)
- **Área, Líder, País, Ciudad:** Los dropdowns permiten múltiples selecciones mediante checkboxes.
- **Comportamiento:** El dropdown permanece abierto tras cada click para facilitar la selección múltiple.
- **Mensajes Dinámicos:** El texto de confirmación cambia automáticamente:
  - *Singular:* "Se generarán reportes para los 4 colaboradores del **área** seleccionado..."
  - *Plural:* "Se generarán reportes para los 12 colaboradores de las **áreas** seleccionados..."
- **Validación:** Se requiere al menos una opción seleccionada para habilitar la generación.

---

## Casos de Error (Modo Demo)

### Error 1: Fallo en Generación (Análisis ID 2)
- **Comportamiento:** El reporte inicia, pero tras 2-3 segundos cambia a estado "error".
- **Interfaz:** Aparece una X roja y un botón de **"Reintentar"**.
- **Notificación:** Se muestra un Toast con el mensaje: "Algo salió mal al procesar la información."

### Error 2: Fallo al Abrir Carpeta
- **Trigger:** Click en "Abrir carpeta de descargas".
- **Notificación (v1.1):** 
  - Título: **Error al abrir carpeta**
  - Mensaje: **Error al abrir la carpeta. Inténtalo más tarde.**
  - Tasa de fallo: 35% (Simulado).

---

## Flujos de Descarga

### Estados de Fila
- **Downloading:** Spinner azul animado + Porcentaje en tiempo real.
- **Completed:** Checkmark verde + 100%. Sin botones de acción adicionales (el archivo se descarga automáticamente).
- **Error:** X roja + Botón **Reintentar**.

### Transiciones
1. **Inicio:** `downloading` (0%).
2. **Progreso:** Incremento gradual del porcentaje.
3. **Fin:** 
   - `completed` (100%): El reporte se guarda en el historial.
   - `error`: Permite volver a `downloading` mediante "Reintentar".

---

## Notas de Diseño v1.1

1. **Eliminación de Botones Obsoletos:** Se han removido los botones de "Detener descarga", "Cancelar descarga" y "Ver descarga" para simplificar el flujo de usuario. No existen acciones destructivas una vez iniciada la generación.
2. **Estética Minimalista:** El panel flotante ahora utiliza únicamente iconos en la cabecera para las acciones de control.
3. **Persistencia de Procesos:** Al cerrar el panel flotante con la "X", los reportes siguen generándose en segundo plano. Los datos persisten en la pestaña de "Descargas" del Drawer.
4. **Contexto Dinámico:** Los mensajes informativos ahora incluyen siempre la coletilla "dentro del análisis actual" para mayor claridad contextual.
4. **Normalización:** Este documento ha sido normalizado para asegurar la consistencia en terminología y codificación de caracteres.

---
**Fin del Documento**
