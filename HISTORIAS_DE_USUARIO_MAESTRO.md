# Reporte Maestro de Historias de Usuario
## Sistema de Generación de Reportes de Análisis de Talento

**Versión:** 1.2  
**Fecha:** Abril 28, 2026  
**Propósito:** Guía técnica y funcional sobre la experiencia de "Reporte Unificado" y manejo de errores.
**Enfoque:** Análisis de talento semestre 1 2025 (ID 1) y Análisis de talento semestre 2 2024 (ID 2).

---

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Flujos de Usuario (Reporte Unificado)](#flujos-de-usuario-reporte-unificado)
3. [Manejo de Errores (ID 2)](#manejo-de-errores-id-2)
4. [Estándares de Diseño y UI](#estándares-de-diseño-y-ui)
5. [Historial de Descargas](#historial-de-descargas)

---

## Descripción General

La plataforma ha evolucionado hacia una experiencia de **"Reporte Unificado"**, simplificando el flujo de generación masiva y estandarizando la interfaz de control.

> [!IMPORTANT]
> **Experiencia Unificada:** Se elimina el selector de tipo de reporte inicial. El flujo principal se centra en generar un reporte masivo (ZIP) por defecto para el alcance seleccionado.
> **Descarga Directa:** Los botones secundarios permiten exportar la vista actual en formatos complementarios (JPG/CSV) sin pasar por el drawer.
> **Persistencia:** Las descargas en curso continúan activas aunque se cierre el panel visual o el drawer.

---

## Flujos de Usuario (Reporte Unificado)

### 1. Cabecera de Análisis (ID 1 y ID 2)
- **Botón Primario ("Generar reporte unificado"):** Abre el drawer directamente en la pestaña "Generar" con el título **"Reporte unificado"**.
- **Botón Secundario ("Descargar" con Dropdown):**
  - **Descargar JPG:** Exportación inmediata de la matriz actual.
  - **Descargar CSV:** Exportación de los datos tabulares.
- **Acciones de Gestión:** Botones de "Editar" y "Eliminar" estandarizados como iconos cuadrados de alta visibilidad.

### 2. Configuración en Drawer
- **Sin selector de tipo:** El usuario pasa directamente a configurar el alcance (Masivo por defecto).
- **Alcance Dinámico:** Al seleccionar un área o líder, el sistema indica cuántos colaboradores se incluirán en el reporte ZIP unificado.
- **Botón de Acción:** "Generar reporte unificado".

---

## Manejo de Errores (ID 2)

El **Análisis de talento semestre 2 2024 (ID 2)** actúa como el entorno de validación para estados de fallo.

### Caso 1: Panel de Error Persistente
- **Ubicación:** Pestaña "Descargas" del drawer.
- **Interfaz:** Panel rojo (`#FFF4F2`) con icono de alerta que informa: *"No pudimos cargar tus descargas anteriores"*.
- **Propósito:** Simular fallos en la persistencia de datos o conectividad con el histórico.

### Caso 2: Fallo en Generación
- **Proceso:** El reporte inicia normalmente pero cambia a estado "error" aleatoriamente.
- **Recuperación:** Se muestra el botón **"Reintentar"** que reinicia el proceso desde el 0%.

---

## Estándares de Diseño y UI

Se ha implementado una normalización de componentes en la cabecera para garantizar una estética premium:

1. **Dimensiones de Botones:**
   - **Altura:** Todos los botones (con o sin label) tienen una altura fija de **44px**.
   - **Botones de Icono:** Los botones de "Editar" y "Eliminar" son cuadrados de **44x44px**.
   - **Iconos:** Se aumentó el tamaño a **20px** (`w-5 h-5`) para los botones de solo icono.
2. **Geometría:** Radio de borde estandarizado a **8px** (`rounded-[8px]`) en todos los elementos de acción.
3. **Pestaña de Descargas:**
   - **Eliminación de Redundancia:** Se ha removido el botón "Descargar más reportes" dentro del drawer para evitar bucles confusos.
   - **Estado Vacío:** Limpieza total del "Empty State", eliminando instrucciones redundantes y botones de ayuda innecesarios.

---

## Historial de Descargas

### Visualización Dinámica
En lugar de mostrar el nombre del reporte (ej: "Resultados Individuales"), la lista muestra el resultado de la operación:
- **Estado Completado:** *"15 reportes descargados"* (o el conteo correspondiente).
- **Estado en Progreso:** *"Descargando 15 reportes"*.

### Panel Flotante (Resumen)
- Aparece automáticamente al iniciar una descarga desde la cabecera.
- Permite minimizar o ver el detalle en el drawer principal.
- No incluye opciones de cancelación, priorizando la integridad del proceso de generación masiva.

---
**Fin del Documento**
