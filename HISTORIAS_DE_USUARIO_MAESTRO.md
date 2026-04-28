# Documento Maestro: Historias de Usuario y Flujos Lógicos
## Sistema de Generación de Reportes (Experiencia Unificada)

**Versión:** 2.0  
**Enfoque:** Estandarización funcional para Análisis de Talento (IDs 1, 2 y 4).

---

## 1. Arquitectura de Navegación y Entradas

### 1.1 Cabecera de Análisis
El acceso a la generación de reportes se centraliza en dos componentes principales:
- **Acción Primaria ("Generar reporte unificado"):** Disparador directo que abre el Drawer en la pestaña de generación (`activeDrawerTab: 'generar'`).
- **Acción Secundaria (Dropdown de Descarga):** Acceso rápido para exportaciones inmediatas de la vista actual (JPG/CSV).
- **Control de Navegación:** Botón de retorno que resetea el estado de visualización y vuelve al listado maestro de análisis.

---

## 2. Lógica de Generación (Drawer)

El proceso de generación se divide en dos modalidades excluyentes dentro de la pestaña "Generar".

### 2.1 Modalidad: Reporte Individual
- **Objetivo:** Generar un reporte detallado de un único colaborador en formato **PDF**.
- **Flujo Happy Path:**
  1. El usuario selecciona "Individual" en el selector de tipo.
  2. El usuario busca un colaborador mediante el campo de búsqueda predictiva.
  3. Al seleccionar un colaborador, se habilita el botón de generación.
  4. La generación inicia y el usuario es redirigido automáticamente a la pestaña "Descargas".
- **Condicionales y Validaciones:**
  - **Campo Obligatorio:** El buscador de colaborador no puede estar vacío al procesar.
  - **Búsqueda Predictiva:** Debe mostrar sugerencias basadas en el término ingresado. Si no hay coincidencias, se muestra un estado de "No resultados".

### 2.2 Modalidad: Reporte Masivo
- **Objetivo:** Generar un consolidado de múltiples colaboradores comprimido en un archivo **ZIP**.
- **Flujo Happy Path:**
  1. El usuario selecciona "Masivo" en el selector de tipo.
  2. El usuario elige la **Configuración de Alcance** (Todos, Área, Líder, País, Ciudad).
  3. Si el alcance requiere selección específica (ej. Área), el usuario debe elegir al menos un valor del listado.
  4. El sistema muestra dinámicamente el conteo de colaboradores afectados.
  5. La generación inicia y se traslada el flujo a la pestaña "Descargas".
- **Condicionales y Validaciones:**
  - **Campo Obligatorio:** Si el alcance es distinto a "Todos", el campo de selección específica es obligatorio.
  - **Retroalimentación Dinámica:** El mensaje de confirmación del ZIP debe actualizarse según el número de colaboradores filtrados.

---

## 3. Gestión de Descargas y Procesamiento

### 3.1 Procesamiento en Segundo Plano
- **Persistencia:** Una vez iniciada la generación, el proceso debe continuar de forma asíncrona. Cerrar el drawer o minimizar el panel no debe interrumpir la descarga.
- **Estado de UI:** El sistema debe mantener un estado global de `isDownloading` para mostrar indicadores en la cabecera y el panel flotante.

### 3.2 Visualización en Historial
El listado de descargas debe aplicar las siguientes reglas lógicas:
- **Etiquetado Dinámico:** En lugar del tipo de reporte, se muestra el estado del lote (ej: *"15 reportes descargados"* o *"Descargando 15 reportes"*).
- **Ordenamiento:** Los elementos más recientes deben aparecer en la parte superior.
- **Acciones Disponibles:**
  - **En progreso:** Muestra porcentaje de avance y animación de carga. No permite descarga.
  - **Completado:** Habilita el botón "Descargar" para obtener el archivo (PDF o ZIP).
  - **Error:** Habilita el botón "Reintentar".

---

## 4. Matriz de Casos de Error y Manejo de Fallos

### 4.1 Casos Específicos para ID 2 (Entorno Demo)
Para el **Análisis Semestre 2 2024**, se aplican condicionales de error forzados para pruebas de robustez:

| Caso de Error | Disparador (Trigger) | Comportamiento Esperado | Acción de Recuperación |
| :--- | :--- | :--- | :--- |
| **Fallo de Carga Histórica** | Carga inicial del drawer en ID 2 | Se muestra un banner rojo persistente: "No pudimos cargar tus descargas anteriores". | Ninguna (Informativo de fallo de persistencia). |
| **Fallo de Generación** | Generación de reporte en ID 2 | El progreso se detiene aleatoriamente y cambia a estado "Error". | Botón "Reintentar" que reinicia el progreso al 0%. |
| **Fallo de API (Fetch)** | Abrir dropdown de filtros en alcance | Se muestra estado de error dentro del dropdown: "No pudimos cargar las opciones". | Botón "Reintentar" interno que dispara de nuevo la petición. |

### 4.2 Validaciones de Formulario (General)
- **Error de Selección:** Si se intenta generar sin campos obligatorios, el campo afectado cambia a estado de error visual y se muestra un mensaje descriptivo debajo del input.

---

## 5. Comportamiento del Panel Flotante

- **Activación:** Se expande automáticamente al iniciar cualquier descarga desde la cabecera o drawer.
- **Navegación:**
  - Botón "Ver detalle": Cierra el panel y abre el Drawer en la pestaña "Descargas".
  - Botón "Minimizar" (Cerrar): Oculta el panel pero mantiene el proceso en segundo plano.
- **Sincronización:** El progreso mostrado en el panel flotante debe estar sincronizado en tiempo real con el estado del proceso en el drawer.

---
**Fin del Documento Maestro**
