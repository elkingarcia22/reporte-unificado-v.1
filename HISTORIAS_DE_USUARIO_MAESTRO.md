# Plantilla Maestra de Handoff a Desarrollo: Reporte Unificado

## 1. Resumen ejecutivo

**Nombre de la funcionalidad:**
Generación de reportes unificados.

**Módulo:**
Talent Analysis / Reporting.

**Responsable de diseño:**
Antigravity (AI Product Designer).

**PM responsable:**
[USER] (Por confirmar).

**Estado del handoff:**
Listo para desarrollo (Prototipo funcional v1.0).

**Fecha:**
28/04/2026

**Versión:**
v2.0

**Objetivo de la funcionalidad:**
Centralizar la generación de reportes individuales (PDF) y masivos (ZIP) en una sola interfaz dinámica, permitiendo el seguimiento del progreso en tiempo real y la gestión de fallos.

**Resultado esperado para el usuario:**
El usuario puede iniciar una generación, minimizar el panel para seguir trabajando y descargar sus archivos desde un historial centralizado cuando el proceso termine.

---

## 2. Contexto del problema

### 2.1 Problema actual
La fragmentación en la generación de reportes generaba confusión sobre el estado de las descargas y obligaba al usuario a esperar a que terminara un proceso para iniciar otro, sin visibilidad del progreso.

### 2.2 Usuario impactado
| Usuario / Rol | Necesidad | Dolor actual |
| :--- | :--- | :--- |
| **Administrador** | Generar reportes masivos por área/líder | No tiene trazabilidad del tiempo restante ni historial de fallos. |
| **HRBP / Líder** | Descargar reportes individuales de colaboradores | Debe buscar individualmente sin una cola de descargas centralizada. |
| **Analista** | Exportar datos rápidos (JPG/CSV) | Interrupción de flujos de trabajo al esperar generaciones. |

### 2.3 Valor esperado
- Reducción del tiempo de espera percibido mediante procesamiento asíncrono.
- Mejora en la trazabilidad del estado de las descargas (Éxito/Error).
- Estandarización de la interfaz de reportes en múltiples tipos de análisis.

---

## 3. Alcance de la entrega

### 3.1 Dentro del alcance
| Elemento | Descripción |
| :--- | :--- |
| **Header de Análisis** | Acciones primarias y secundarias estandarizadas. |
| **Drawer de Reportes** | Tabs de "Generar" y "Descargas" con persistencia de estado. |
| **Generación Individual** | Formato **PDF** con búsqueda predictiva de colaboradores. |
| **Generación Masiva** | Formato **ZIP** con configuración de alcance dinámico. |
| **Gestión de Errores** | Lógica de reintento y banners de error persistentes para ID 2. |
| **Panel Flotante** | Resumen de progreso visible fuera del drawer. |

### 3.2 Fuera del alcance
| Elemento | Motivo |
| :--- | :--- |
| **Envío por Email** | Fase posterior de automatización. |
| **Edición de Reporte** | El reporte es un entregable final, no un documento editable. |
| **Filtros Avanzados** | Se limita a los filtros definidos en la configuración de alcance actual. |

### 3.3 Supuestos
- El backend procesará las solicitudes de forma asíncrona y devolverá un `job_id`.
- Los archivos generados se almacenarán temporalmente en un bucket accesible vía URL.
- El almacenamiento local (`localStorage`) se usa para persistencia del historial en el cliente.

---

## 4. Artefactos relacionados
| Tipo de artefacto | Ubicación | Observaciones |
| :--- | :--- | :--- |
| **Código Fuente** | `src/app/App.tsx` | Contiene toda la lógica de UI y simulación. |
| **Estilos Globales** | `src/styles/index.css` | Define los tokens base. |
| **Estado Local** | `localStorage: 'talent_downloads_history'` | Almacén de persistencia del historial. |

---

## 5. Historia de usuario

**Como** usuario administrador de análisis de talento,  
**quiero** generar reportes individuales y masivos desde una experiencia unificada,  
**para** ahorrar tiempo, tener trazabilidad del proceso y descargar los archivos cuando estén listos.

### Criterios de aceptación generales
| ID | Criterio | Prioridad |
| :--- | :--- | :--- |
| **CA-01** | El usuario puede abrir el drawer desde "Generar reporte unificado". | Must |
| **CA-02** | El sistema permite alternar entre Individual (PDF) y Masivo (ZIP) dentro del drawer. | Must |
| **CA-03** | El botón "Generar" se habilita solo si los campos obligatorios están completos. | Must |
| **CA-04** | El sistema debe mostrar el progreso porcentual real/simulado de cada descarga. | Must |
| **CA-05** | El historial debe persistir aunque se refresque la página (vía `localStorage`). | Must |
| **CA-06** | El panel flotante debe activarse automáticamente al iniciar una descarga. | Should |

---

## 6. Descripción de la solución diseñada

### 6.1 Resumen de experiencia
La solución utiliza un **Drawer lateral** dividido en dos pestañas. La pestaña **"Generar"** actúa como el configurador, donde el usuario define el tipo y alcance. Al ejecutar, la lógica mueve al usuario a **"Descargas"**, donde se gestiona la cola de procesamiento. Un **Panel Flotante** en la esquina inferior derecha permite al usuario monitorear el progreso mientras navega por la matriz de talento.

### 6.2 Pantallas / componentes involucrados
| Pantalla / componente | Función | Estado |
| :--- | :--- | :--- |
| **Header (App.tsx)** | Punto de entrada y botones de exportación rápida. | **Construido** |
| **Drawer Tabs** | Alternancia entre Generar y Descargas. | **Construido** |
| **Buscador Colaborador** | Input con lógica de filtrado y sugerencias. | **Construido (Mock data)** |
| **Toggle Tipo Reporte** | Selector Individual vs Masivo. | **Construido** |
| **Lista de Historial** | Renderizado dinámico de estados. | **Construido** |
| **Panel Flotante** | Componente de seguimiento persistente. | **Construido** |

---

## 7. Flujo funcional principal

### 7.1 Happy path (Generación Masiva)
1. Usuario entra a un análisis (ID 1, 2 o 4).
2. Clic en **"Generar reporte unificado"**.
3. Drawer se abre en pestaña **"Generar"**.
4. Selecciona **"Masivo"**.
5. Selecciona alcance **"Área"** y elige un valor.
6. Clic en **"Generar reporte unificado"**.
7. La función `handleGenerateReport` (línea ~815) inicia la descarga y cambia a la pestaña de descargas.
8. El sistema muestra el progreso de 0 a 100%.
9. Al llegar a 100%, aparece el botón **"Descargar"**.

### 7.2 Flujo alternativo (Error de Generación)
1. En ID 2, el proceso inicia.
2. La función de simulación lanza un estado de error (`status: 'error'`).
3. La UI reemplaza el progreso por un icono de error y el botón **"Reintentar"**.
4. El usuario hace clic en reintentar y el proceso vuelve al 0%.

---

## 8. Reglas de negocio
| ID | Regla | Archivo/Función | Prioridad |
| :--- | :--- | :--- | :--- |
| **RN-01** | Reporte Individual requiere `selectedColaborador` no vacío. | `App.tsx` / `handleGenerateReport` | Must |
| **RN-02** | Reporte Masivo requiere `alcanceFieldValue` si no es "Todos". | `App.tsx` / `handleGenerateReport` | Must |
| **RN-03** | El historial debe mostrar el conteo de reportes (ej: "15 reportes"). | `App.tsx` / Línea ~1226 | Must |
| **RN-04** | ID 2 debe simular fallos de carga inicial. | `App.tsx` / Línea ~1158 | Must |
| **RN-05** | Los archivos se consideran "completados" después de la simulación. | `App.tsx` / `startMassiveDownload` | Must |

---

## 9. Estados de UI
| Estado | Descripción | UI esperada |
| :--- | :--- | :--- |
| **Default** | Formulario limpio. | Inputs vacíos, botón deshabilitado. |
| **Loading** | Simulando fetch de áreas/líderes. | Spinner dentro del dropdown. |
| **Empty** | Historial sin descargas. | Ilustración de nube con mensaje "Sin descargas recientes". |
| **Processing** | Descarga activa. | Barra de progreso azul + porcentaje. |
| **Error** | Fallo en ID 2. | Banner rojo o icono de error en lista. |
| **Success** | 100% completado. | Check verde y botón de descarga habilitado. |

---

## 10. Validaciones
| Campo / Acción | Validación | Mensaje sugerido |
| :--- | :--- | :--- |
| **Buscador** | Debe seleccionar un nombre de la lista. | "Por favor selecciona un colaborador..." |
| **Alcance** | Si es Área/Líder/País, el campo secundario es obligatorio. | "Selecciona al menos una opción" |
| **ID 2 Fetch** | Simula fallo aleatorio (25%) al abrir filtros. | "No pudimos cargar las opciones" |

---

## 11. Casos de error y recuperación
| Caso | Trigger | Comportamiento | Acción de recuperación |
| :--- | :--- | :--- | :--- |
| **Falla Historial** | `selectedAnalysisId === 2` | Banner rojo arriba de la lista. | Informativo (Por confirmar reintento). |
| **Falla Generación** | Random en ID 2 | Estado cambia a 'error'. | Botón **"Reintentar"**. |
| **Falla Dropdown** | `fetchDataError === true` | Estado de error en el buscador de áreas. | Botón **"Reintentar"** interno. |

---

## 12. Contrato de datos esperado

### 12. model Item de Descarga (Basado en `App.tsx`)
```typescript
type DownloadItem = {
  id: number;
  name: string; // Ej: "Reporte Unificado - Adam Andres..."
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  collaboratorCount: number;
  reportType: 'Individual' | 'Masivo';
  completedAt?: string;
  fileUrl?: string;
};
```

---

## 13. Permisos y restricciones (Por confirmar)
- **Administrador:** Acceso total.
- **Líder:** Solo reportes de su equipo directo (Por implementar lógica de filtrado backend).
- **Invitado:** Solo lectura, sin acceso a generación (Por implementar).

---

## 14. Consideraciones visuales y Microcopy
- **Botones:** Altura fija de **44px** (Estandarizado en `App.tsx`).
- **Iconos:** Tamaño **20px** para acciones de cabecera.
- **Copy en progreso:** "Descargando X reportes".
- **Copy completado:** "X reportes descargados".

---

## 15. QA Checklist

- [ ] ¿El drawer abre en la pestaña "Generar" al pulsar el botón principal?
- [ ] ¿El buscador predictivo filtra correctamente los nombres (Adam, etc.)?
- [ ] ¿El botón "Generar" se habilita solo tras completar los campos?
- [ ] ¿El ID 2 muestra el banner de error en el historial?
- [ ] ¿El progreso se mantiene visible en el Panel Flotante al cerrar el drawer?
- [ ] ¿El botón "Reintentar" aparece solo en estado de error?
- [ ] ¿Se genera un ZIP en masivo y un PDF en individual?

---

## 16. Notas para desarrollo (Diferenciación)
- **Construido:** Toda la UI, estados de React, simulación de progreso y persistencia en `localStorage`.
- **Mockeado:** La lista de colaboradores (`colaboradores` array) y los archivos de descarga (URLs falsas).
- **Falta implementar:** Integración real con endpoints de generación masiva (Backend).
- **Requiere decisión PM:** Definir el tiempo de expiración de los archivos en el historial (actualmente infinito en local).
- **Definición técnica:** Elegir entre Polling o WebSockets para actualizar el progreso desde el servidor.

---
**Fin del Documento de Handoff**
