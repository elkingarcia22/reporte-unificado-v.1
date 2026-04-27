import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import VistaPreviaPdfReporteEjecutivoFinalNuevoAzul0C5Bef from '../imports/VistaPreviaPdfReporteEjecutivoFinalNuevoAzul0C5Bef/VistaPreviaPdfReporteEjecutivoFinalNuevoAzul0C5Bef';

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [reportType, setReportType] = useState<'Individual' | 'Masivo'>('Individual');
  const [alcance, setAlcance] = useState('Toda la empresa');
  const [peso360, setPeso360] = useState('50');
  const [pesoObjetivos, setPesoObjetivos] = useState('50');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColaborador, setSelectedColaborador] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [showColaboradorError, setShowColaboradorError] = useState(false);
  const [showAlcanceFieldError, setShowAlcanceFieldError] = useState(false);
  const [alcanceFieldValue, setAlcanceFieldValue] = useState('');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadMinimized, setIsDownloadMinimized] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [reportsInQueue, setReportsInQueue] = useState(0);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [showAnalysisList, setShowAnalysisList] = useState(true);
  const [downloadingReports, setDownloadingReports] = useState<Array<{ id: number; name: string; progress: number; status: 'downloading' | 'completed' | 'error' }>>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showDrawerCancelAllConfirm, setShowDrawerCancelAllConfirm] = useState(false);
  const [cancelConfirmReportId, setCancelConfirmReportId] = useState<number | null>(null);
  const [pendingCancelReportId, setPendingCancelReportId] = useState<number | null>(null);
  const [errorNotification, setErrorNotification] = useState<{
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);
  const [fetchDataError, setFetchDataError] = useState(false);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<number | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  // Detectar si estamos en modo preview del PDF
  const isPdfPreviewMode = new URLSearchParams(window.location.search).get('pdf-preview') === 'true';

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-dismiss error notification después de 4 segundos
  useEffect(() => {
    if (errorNotification) {
      const timer = setTimeout(() => {
        setErrorNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorNotification]);

  const isErrorDemoMode = selectedAnalysisId === 2;

  const colaboradores = [
    { id: 1, name: 'Adam Andres Abril Acebes', initials: 'AA', area: 'Tecnología', lider: 'Juan Pérez', pais: 'México', ciudad: 'Ciudad de México' },
    { id: 2, name: 'Andres Camilo Torres', initials: 'AT', area: 'Ventas', lider: 'María González', pais: 'Colombia', ciudad: 'Bogotá' },
    { id: 3, name: 'Bayron Jesid Garcia', initials: 'BG', area: 'Tecnología', lider: 'Juan Pérez', pais: 'Colombia', ciudad: 'Medellín' },
    { id: 4, name: 'Estefanía Rojas Acosta', initials: 'ER', area: 'Marketing', lider: 'Carlos Rodríguez', pais: 'Argentina', ciudad: 'Buenos Aires' },
    { id: 5, name: 'Elkin Garcia Salazar', initials: 'EG', area: 'Tecnología', lider: 'Juan Pérez', pais: 'Colombia', ciudad: 'Bogotá' },
    { id: 6, name: 'María González López', initials: 'MG', area: 'Recursos Humanos', lider: 'Ana Martínez', pais: 'Chile', ciudad: 'Santiago' },
    { id: 7, name: 'Carlos Martínez Ruiz', initials: 'CM', area: 'Operaciones', lider: 'Juan Pérez', pais: 'Perú', ciudad: 'Lima' },
    { id: 8, name: 'Ana Fernández Castro', initials: 'AF', area: 'Ventas', lider: 'María González', pais: 'México', ciudad: 'Guadalajara' },
    { id: 9, name: 'Luis Ramírez Pérez', initials: 'LR', area: 'Marketing', lider: 'Carlos Rodríguez', pais: 'Argentina', ciudad: 'Córdoba' },
    { id: 10, name: 'Sofia Hernández Vega', initials: 'SH', area: 'Tecnología', lider: 'Juan Pérez', pais: 'Chile', ciudad: 'Valparaíso' },
  ];

  // Función para contar colaboradores según el alcance y valor seleccionado
  const getColaboradoresCount = (alcanceType: string, fieldValue: string): number => {
    if (alcanceType === 'Toda la empresa') {
      return colaboradores.length;
    }
    if (alcanceType === 'Área') {
      return colaboradores.filter(c => c.area === fieldValue).length;
    }
    if (alcanceType === 'Líder') {
      return colaboradores.filter(c => c.lider === fieldValue).length;
    }
    if (alcanceType === 'País') {
      return colaboradores.filter(c => c.pais === fieldValue).length;
    }
    if (alcanceType === 'Ciudad') {
      return colaboradores.filter(c => c.ciudad === fieldValue).length;
    }
    return 0;
  };

  const filteredColaboradores = searchTerm
    ? colaboradores.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPeso = parseInt(peso360 || '0') + parseInt(pesoObjetivos || '0');

  // Validación automática de pesos
  const hasPesoError = totalPeso !== 100;

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Resetear estados
    setTimeout(() => {
      setSearchTerm('');
      setSelectedColaborador('');
      setShowSuggestions(false);
      setReportType('Individual');
      setAlcance('Toda la empresa');
      setPeso360('50');
      setPesoObjetivos('50');
      setShowColaboradorError(false);
      setShowAlcanceFieldError(false);
      setAlcanceFieldValue('');
      setShowReportOptions(false);
      // No resetear reportsInQueue aquí para mantener el contador
    }, 300);
  };

  const handleContinueGenerating = () => {
    setShowReportOptions(false);
    // Solo resetear estado de descarga si ya completó (no mientras hay descargas en progreso)
    if (downloadComplete) {
      setDownloadComplete(false);
      setIsDownloading(false);
      setDownloadingReports([]);
      setIsDownloadMinimized(false);
    }
    // Resetear contador a 1 para nueva generación (no incrementar)
    setReportsInQueue(1);
    // Resetear solo los campos del formulario pero mantener el drawer abierto
    setSearchTerm('');
    setSelectedColaborador('');
    setShowSuggestions(false);
    setAlcanceFieldValue('');
    setShowColaboradorError(false);
    setShowAlcanceFieldError(false);
  };

  const handleExitAndDownload = () => {
    setIsDrawerOpen(false);
    setIsDownloadMinimized(false);
    // Resetear estados del drawer
    setTimeout(() => {
      setSearchTerm('');
      setSelectedColaborador('');
      setShowSuggestions(false);
      setReportType('Individual');
      setAlcance('Toda la empresa');
      setPeso360('50');
      setPesoObjetivos('50');
      setShowColaboradorError(false);
      setShowAlcanceFieldError(false);
      setAlcanceFieldValue('');
      setShowReportOptions(false);
    }, 300);
  };

  const handleGenerateReport = async () => {
    // Limpiar errores previos
    setShowColaboradorError(false);
    setShowAlcanceFieldError(false);

    // Validar solo cuando el usuario hace clic en generar
    if (reportType === 'Individual' && !selectedColaborador) {
      setShowColaboradorError(true);
      return;
    }

    // Validar alcance para reporte masivo
    if (reportType === 'Masivo' && alcance !== 'Toda la empresa' && !alcanceFieldValue) {
      setShowAlcanceFieldError(true);
      return;
    }

    if (totalPeso !== 100) {
      // El error ya se muestra automáticamente
      return;
    }

    setIsGeneratingPdf(true);

    // Simular generación de PDF
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsGeneratingPdf(false);

    // Simular fallo: individual siempre falla, masivo solo si no es "Toda la empresa"
    const generateFailed = isErrorDemoMode && (
      reportType === 'Individual' ||
      (reportType === 'Masivo' && alcance !== 'Toda la empresa')
    );
    if (generateFailed) {
      setErrorNotification({
        title: reportType === 'Individual' ? 'No pudimos generar tu reporte' : 'Error al iniciar la generación masiva',
        message: 'Algo salió mal al procesar la información. Esto suele ser temporal y se resuelve solo.',
        actionLabel: 'Intentar de nuevo',
        onAction: handleGenerateReport
      });
      return;
    }

    if (reportType === 'Masivo') {
      // Mostrar progreso dentro del drawer e iniciar descarga
      setShowReportOptions(true);
      startMassiveDownload();
    } else {
      // Para individual, abrir previsualizador en nueva pestaña y mostrar estado en drawer
      window.open('?pdf-preview=true', '_blank');

      // Mostrar estado de reporte en cola en el drawer
      setShowReportOptions(true);
      setIsDownloading(true);
      setDownloadComplete(true);
      setDownloadingReports([
        {
          id: Date.now(),
          name: 'Reporte_Ejecutivo_Individual.pdf',
          progress: 100,
          status: 'completed'
        }
      ]);
    }
  };

  const startMassiveDownload = () => {
    setIsDownloading(true);
    setIsDownloadMinimized(false);
    setIsCancelled(false);

    const reportId = Date.now();
    const reportName = `Reporte_Masivo_${reportId}.zip`;

    // Agregar nuevo reporte a la lista de descarga
    setDownloadingReports((prev) => [
      ...prev,
      { id: reportId, name: reportName, progress: 0, status: 'downloading' }
    ]);

    setReportsInQueue((prev) => prev + 1);

    // Simular progreso de descarga más lento
    const interval = setInterval(() => {
      setDownloadingReports((prevReports) => {
        const updated = prevReports.map((report) => {
          if (report.id === reportId && report.status === 'downloading') {
            if (isErrorDemoMode && report.progress >= 85 && Math.random() < 0.25) {
              clearInterval(interval);
              return { ...report, status: 'error' as const };
            }
            if (report.progress >= 100) {
              clearInterval(interval);
              return { ...report, progress: 100, status: 'completed' as const };
            }
            return { ...report, progress: report.progress + 1 };
          }
          return report;
        });

        // Verificar si hay descargas completadas
        const allDone = updated.every((r) => r.status === 'completed' || r.status === 'error');
        const hasErrors = updated.some((r) => r.status === 'error');
        if (allDone && updated.length > 0) {
          setDownloadComplete(true);
          if (isErrorDemoMode && hasErrors) {
            setErrorNotification({
              title: 'Algunas descargas tuvieron problemas',
              message: `${updated.filter(r => r.status === 'error').length} reporte(s) no se completaron. Puedes reintentarlos desde la lista.`,
            });
          }
        }

        return updated;
      });
    }, 300);
  };

  const handleCloseDownload = () => {
    // Si está descargando y no está completo, mostrar confirmación
    if (isDownloading && !downloadComplete && !isCancelled) {
      setShowCancelConfirmation(true);
    } else {
      // Si ya está completo o fue cancelado, cerrar directamente
      setIsDownloading(false);
      setDownloadProgress(0);
      setDownloadComplete(false);
      setIsDownloadMinimized(false);
      setReportsInQueue(0);
      setDownloadingReports([]);
      setIsCancelled(false);
      setShowCancelConfirmation(false);
    }
  };

  const handleConfirmCancel = () => {
    if (pendingCancelReportId !== null) {
      const stopFailed = isErrorDemoMode;
      if (stopFailed) {
        setPendingCancelReportId(null);
        setShowCancelConfirmation(false);
        setErrorNotification({
          title: 'No pudimos detener esta descarga',
          message: 'Algo impidió detener el proceso. Intenta de nuevo desde la lista de reportes.',
          actionLabel: 'Entendido',
          onAction: () => setErrorNotification(null)
        });
        return;
      }
      // Cancelar solo el reporte individual
      setDownloadingReports((prev) => {
        const updated = prev.filter((r) => r.id !== pendingCancelReportId);
        if (updated.length === 0) {
          setIsDownloading(false);
          setDownloadComplete(false);
          setReportsInQueue(0);
          setIsDownloadMinimized(false);
        } else {
          const allCompleted = updated.every((r) => r.status === 'completed');
          if (allCompleted) setDownloadComplete(true);
        }
        return updated;
      });
      setPendingCancelReportId(null);
    } else {
      const cancelAllFailed = isErrorDemoMode;
      if (cancelAllFailed) {
        setShowCancelConfirmation(false);
        setShowDrawerCancelAllConfirm(false);
        setErrorNotification({
          title: 'No pudimos cancelar todas las descargas',
          message: 'Hubo un problema al intentar detener los procesos. Algunas descargas pueden seguir en progreso.',
          actionLabel: 'Reintentar',
          onAction: () => {
            setPendingCancelReportId(null);
            handleConfirmCancel();
          }
        });
        return;
      }
      // Cancelar todas las descargas
      setIsCancelled(true);
      setIsDownloading(false);
      setDownloadProgress(0);
      setDownloadComplete(false);
      setIsDownloadMinimized(false);
      setReportsInQueue(0);
      setDownloadingReports([]);
    }
    setShowCancelConfirmation(false);
    setShowDrawerCancelAllConfirm(false);
  };

  const handleCancelSingleReport = (id: number) => {
    const stopFailed = isErrorDemoMode;
    if (stopFailed) {
      setCancelConfirmReportId(null);
      setErrorNotification({
        title: 'No pudimos detener esta descarga',
        message: 'El sistema no pudo interrumpirla en este momento. Intenta de nuevo en unos segundos.',
        actionLabel: 'Reintentar',
        onAction: () => handleCancelSingleReport(id)
      });
      return;
    }
    setDownloadingReports((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      if (updated.length === 0) {
        setIsDownloading(false);
        setDownloadComplete(false);
        setReportsInQueue(0);
        setShowReportOptions(false);
      } else {
        const allCompleted = updated.every((r) => r.status === 'completed');
        if (allCompleted) setDownloadComplete(true);
      }
      return updated;
    });
    setCancelConfirmReportId(null);
  };

  const handleKeepDownloading = () => {
    setShowCancelConfirmation(false);
  };

  const handleOpenFolder = () => {
    const failed = isErrorDemoMode && Math.random() < 0.35;
    if (failed) {
      setErrorNotification({
        title: 'No podemos abrir la carpeta',
        message: 'Es posible que los archivos hayan sido movidos o que tu sistema no permita abrirla en este momento.',
        actionLabel: 'Reintentar',
        onAction: handleOpenFolder
      });
    }
  };

  const handleRetryReport = (id: number) => {
    setDownloadingReports(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'downloading' as const, progress: 0 } : r
    ));
    setDownloadComplete(false);

    const interval = setInterval(() => {
      setDownloadingReports(prevReports => {
        const updated = prevReports.map(report => {
          if (report.id === id && report.status === 'downloading') {
            if (report.progress >= 100) {
              clearInterval(interval);
              return { ...report, progress: 100, status: 'completed' as const };
            }
            return { ...report, progress: report.progress + 2 };
          }
          return report;
        });
        const allDone = updated.every(r => r.status === 'completed' || r.status === 'error');
        if (allDone && updated.length > 0) setDownloadComplete(true);
        return updated;
      });
    }, 300);
  };

  const handleClosePdfViewer = () => {
    // Cerrar visualizador y mostrar estado de descarga completada
    setShowPdfViewer(false);
    setIsDrawerOpen(true);
    setIsDownloading(true);
    setDownloadComplete(true);
    setDownloadingReports([
      {
        id: Date.now(),
        name: 'Reporte_Ejecutivo_Individual.pdf',
        progress: 100,
        status: 'completed'
      }
    ]);
  };

  // Si estamos en modo preview del PDF
  if (isPdfPreviewMode) {
    return (
      <div className="h-screen w-screen overflow-hidden">
        <VistaPreviaPdfReporteEjecutivoFinalNuevoAzul0C5Bef />
      </div>
    );
  }

  // Si está mostrando el visualizador de PDF, mostrar solo eso
  if (showPdfViewer) {
    return (
      <div
        className="h-screen w-screen overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClosePdfViewer();
        }}
      >
        <VistaPreviaPdfReporteEjecutivoFinalNuevoAzul0C5Bef />
      </div>
    );
  }

  // Si está mostrando la lista de análisis
  if (showAnalysisList) {
    const analysisList = [
      { id: 1, name: 'Análisis de talento semestre 1 2025', date: '10 enero 2025', participants: 200 },
      { id: 2, name: 'Análisis de talento semestre 2 2024', date: '10 diciembre 2024', participants: 200 },
      { id: 3, name: 'Análisis de talento semestre 1 2024', date: '10 enero 2024', participants: 180 },
      { id: 4, name: 'Análisis de talento semestre 2 2023', date: '10 diciembre 2023', participants: 200 },
      { id: 5, name: 'Análisis de talento semestre 1 2023', date: '10 enero 2023', participants: 200 },
      { id: 6, name: 'Análisis de talento semestre 2 2022', date: '10 diciembre 2022', participants: 180 },
      { id: 7, name: 'Análisis de talento semestre 1 2022', date: '10 enero 2022', participants: 150 },
      { id: 8, name: 'Análisis de talento semestre 2 2021', date: '10 diciembre 2021', participants: 100 },
      { id: 9, name: 'Análisis de talento semestre 1 2021', date: '10 enero 2021', participants: 180 },
      { id: 10, name: 'Análisis de talento semestre 2 2020', date: '10 diciembre 2020', participants: 180 },
    ];

    return (
      <div className="bg-[#F3F3F4] flex flex-col h-screen w-screen overflow-hidden">
        {/* Header */}
        <div className="bg-white px-6 py-6 border-b border-[#D0D2D5]">
          <h1 className="font-['Helvetica_Now_Text_:Bold',sans-serif] text-2xl text-[#303A47] mb-2">Matriz de talento</h1>
          <p className="font-['Noto_Sans:Regular',sans-serif] text-sm text-[#5C646F]">
            Crea análisis de talento para evaluar, desarrollar y retener el talento en tu empresa, así podrás tomar decisiones basadas en datos.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="bg-white rounded-lg border border-[#D0D2D5] overflow-hidden">
            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#D0D2D5] bg-[#F9F9F9]">
                    <th className="px-4 py-3 text-left font-['Helvetica_Now_Text_:Bold',sans-serif] text-sm text-[#303A47]">Nombre del análisis de talento</th>
                    <th className="px-4 py-3 text-left font-['Helvetica_Now_Text_:Bold',sans-serif] text-sm text-[#303A47]">Fecha de creación</th>
                    <th className="px-4 py-3 text-left font-['Helvetica_Now_Text_:Bold',sans-serif] text-sm text-[#303A47]">Participantes</th>
                    <th className="px-4 py-3 text-left font-['Helvetica_Now_Text_:Bold',sans-serif] text-sm text-[#303A47]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisList.map((analysis) => (
                    <tr key={analysis.id} className="border-b border-[#E7E8EA] hover:bg-[#F9F9F9] transition-colors">
                      <td className="px-4 py-3 font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47]">{analysis.name}</td>
                      <td className="px-4 py-3 font-['Noto_Sans:Regular',sans-serif] text-sm text-[#5C646F]">{analysis.date}</td>
                      <td className="px-4 py-3 font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47]">{analysis.participants}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedAnalysisId(analysis.id);
                            setShowAnalysisList(false);
                          }}
                          className="text-[#0C5BEF] font-['Noto_Sans:Regular',sans-serif] text-sm hover:underline"
                        >
                          Ver análisis
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between px-4 py-4 border-t border-[#D0D2D5]">
              <p className="font-['Noto_Sans:Regular',sans-serif] text-xs text-[#5C646F]">Mostrando 1-10 de {analysisList.length} análisis</p>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 rounded border border-[#D0D2D5] text-[#303A47] font-['Noto_Sans:Regular',sans-serif] text-xs hover:bg-[#F3F3F4]">«</button>
                <button className="px-2 py-1 rounded border border-[#D0D2D5] text-[#303A47] font-['Noto_Sans:Regular',sans-serif] text-xs hover:bg-[#F3F3F4]">‹</button>
                <button className="px-2 py-1 rounded bg-[#0C5BEF] text-white font-['Noto_Sans:Regular',sans-serif] text-xs">1</button>
                <button className="px-2 py-1 rounded border border-[#D0D2D5] text-[#303A47] font-['Noto_Sans:Regular',sans-serif] text-xs hover:bg-[#F3F3F4]">2</button>
                <button className="px-2 py-1 rounded border border-[#D0D2D5] text-[#303A47] font-['Noto_Sans:Regular',sans-serif] text-xs hover:bg-[#F3F3F4]">›</button>
                <button className="px-2 py-1 rounded border border-[#D0D2D5] text-[#303A47] font-['Noto_Sans:Regular',sans-serif] text-xs hover:bg-[#F3F3F4]">»</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3F3F4] flex flex-col h-screen w-screen overflow-hidden relative">
      {/* Header */}
      <div className="flex flex-col gap-3 px-5 py-5 shrink-0 bg-white">
        <div className="flex gap-4 items-start w-full">
          <div className="flex gap-2.5 items-start flex-1 min-w-0">
            {/* Botón Regresar */}
            <button
              onClick={() => {
                setShowPdfViewer(false);
                setShowAnalysisList(true);
              }}
              className="flex items-center px-4 py-1 rounded-[5px] shrink-0 hover:bg-[#F3F3F4] transition-colors cursor-pointer"
            >
              <div className="flex gap-2.5 items-center text-[#0C5BEF]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
                <div className="font-['Helvetica_Now_Text_:Regular',sans-serif] text-sm whitespace-nowrap">
                  <p className="leading-[22px]">Regresar</p>
                </div>
              </div>
            </button>

            {/* Título */}
            <div className="flex gap-1 items-center min-h-8 flex-1 min-w-0">
              <p className="font-['Helvetica_Now_Text_:Extra_Bold',sans-serif] text-[#303A47] text-lg whitespace-nowrap">
                {selectedAnalysisId === 2 ? 'Análisis de talento semestre 2 2024' : 'Análisis Q2 2025'}
              </p>
              <div className="flex items-center justify-center px-3 py-2 rounded-full size-8 shrink-0">
                <svg className="w-4 h-4 text-[#0C5BEF]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Grupo de botones de acción */}
          <div className="flex gap-2 items-center">
            {/* Botón Descargar con dropdown */}
            <div className="relative" ref={downloadRef}>
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="bg-white flex items-center gap-1 px-3 py-2 rounded-[5px] border border-[#D0D2D5] border-solid shrink-0 hover:bg-[#F3F3F4] transition-colors cursor-pointer"
                title="Descargar"
              >
                <svg className="w-4 h-4 text-[#5C646F]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
                </svg>
                <svg className="w-3 h-3 text-[#5C646F]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>

              {/* Dropdown menu */}
              {showDownloadMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-[#D0D2D5] rounded-lg shadow-lg min-w-[200px] z-50 py-1">
                  <button
                    onClick={() => {
                      setShowDownloadMenu(false);
                      // Acción de descargar reporte individual
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F3F3F4] transition-colors text-left"
                  >
                    <svg className="w-4 h-4 text-[#5C646F]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                    <div className="flex-1">
                      <p className="font-['Helvetica_Now_Text_:Regular',sans-serif] text-sm text-[#303A47]">
                        Reporte individual
                      </p>
                      <p className="font-['Noto_Sans:Regular',sans-serif] text-xs text-[#5C646F]">
                        Descargar como PDF
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setShowDownloadMenu(false);
                      // Acción de descargar reporte masivo
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F3F3F4] transition-colors text-left"
                  >
                    <svg className="w-4 h-4 text-[#5C646F]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                    <div className="flex-1">
                      <p className="font-['Helvetica_Now_Text_:Regular',sans-serif] text-sm text-[#303A47]">
                        Reporte masivo
                      </p>
                      <p className="font-['Noto_Sans:Regular',sans-serif] text-xs text-[#5C646F]">
                        Descargar como ZIP
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Botón Editar */}
            <button
              className="bg-white flex items-center px-3 py-2 rounded-[5px] border border-[#D0D2D5] border-solid shrink-0 hover:bg-[#F3F3F4] transition-colors cursor-pointer"
              title="Editar"
            >
              <svg className="w-4 h-4 text-[#5C646F]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>

            {/* Botón Eliminar */}
            <button
              className="bg-white flex items-center px-3 py-2 rounded-[5px] border border-[#D0D2D5] border-solid shrink-0 hover:bg-[#FEF3F2] hover:border-[#D92D20] transition-colors cursor-pointer group"
              title="Eliminar"
            >
              <svg className="w-4 h-4 text-[#5C646F] group-hover:text-[#D92D20] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>

            {/* Botón Generar reporte unificado */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-[#0C5BEF] flex items-center px-4 py-2 rounded-[5px] shrink-0 hover:bg-[#0A4BC7] transition-colors cursor-pointer"
            >
              <div className="flex gap-2.5 items-center text-white text-base whitespace-nowrap">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                <div className="font-['Helvetica_Now_Text_:Bold',sans-serif]">
                  <p className="leading-6">Generar reporte unificado</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Info Participantes */}
        <div className="flex gap-2.5 h-6 items-end text-[#5C646F] text-xs">
          <div className="flex gap-1 items-center">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            <div className="font-['Helvetica_Now_Text_:Bold',sans-serif]">
              <p className="leading-[18px]">Participantes:</p>
            </div>
            <div className="font-['Helvetica_Now_Text_:Regular',sans-serif]">
              <p className="leading-[18px]">200 colaboradores</p>
            </div>
          </div>
          <div className="font-['Helvetica_Now_Text_:Bold',sans-serif] w-1">
            <p className="leading-[18px]">|</p>
          </div>
          <div className="flex gap-1 items-center">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            <div className="font-['Helvetica_Now_Text_:Bold',sans-serif]">
              <p className="leading-[18px]">Desempeño:</p>
            </div>
            <div className="font-['Helvetica_Now_Text_:Regular',sans-serif]">
              <p className="leading-[18px]">Ciclo de objetivos Q1 2025</p>
            </div>
          </div>
          <div className="font-['Helvetica_Now_Text_:Bold',sans-serif] w-1">
            <p className="leading-[18px]">|</p>
          </div>
          <div className="flex gap-1 items-center">
            <div className="font-['Helvetica_Now_Text_:Bold',sans-serif]">
              <p className="leading-[18px]">Potencial:</p>
            </div>
            <div className="font-['Helvetica_Now_Text_:Regular',sans-serif]">
              <p className="leading-[18px]">Evaluación potencial Q1 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#E7E8EA] flex items-center shrink-0">
        <div className="flex flex-col items-start">
          <div className="bg-[#0C5BEF] h-1 rounded-tl-[5px] rounded-tr-[5px] w-full" />
          <div className="bg-white flex items-center justify-center px-4 py-2.5">
            <p className="font-['Helvetica_Now_Text_:Regular',sans-serif] text-[#0C5BEF] text-base whitespace-nowrap">Matriz</p>
          </div>
        </div>
        <div className="bg-[#E7E8EA] h-5 w-0 border-l border-[#B9BBC1]" />
        <div className="flex flex-col items-start">
          <div className="bg-[#E7E8EA] h-1 rounded-tl-[5px] rounded-tr-[5px] w-full" />
          <div className="bg-[#E7E8EA] flex items-center justify-center px-4 py-2.5">
            <p className="font-['Helvetica_Now_Text_:Regular',sans-serif] text-[#5C646F] text-base whitespace-nowrap">Lista</p>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex gap-5 flex-1 min-h-0 p-5 overflow-hidden">
        {/* Panel Izquierdo - Matriz */}
        <div className="bg-white flex flex-col gap-5 flex-1 min-w-0 p-5 rounded-[10px] overflow-auto">
          <div className="flex flex-col gap-4">
            <div className="pl-10">
              <h2 className="font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-lg mb-4">Matriz de análisis de talento</h2>
              <p className="font-['Helvetica_Now_Text_:Regular',sans-serif] text-[#5C646F] text-base">Busca y selecciona un colaborador para ver su posición en la matriz, resultados e información.</p>
            </div>

            <div className="pl-10 flex items-end justify-between gap-4">
              {/* Input Colaborador */}
              <div className="flex flex-col gap-1 w-[309px] relative">
                <div className="rounded-[5px] border border-[#D0D2D5] border-solid">
                  <div className="flex gap-1 items-center px-2.5 py-3">
                    <svg className="w-4 h-4 text-[#5c646f]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <p className="flex-1 font-['Noto_Sans:Regular',sans-serif] font-normal text-[#5c646f] text-[13px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                      Adam Andres Abril Acebes
                    </p>
                    <svg className="w-4 h-4 text-[#0C5BEF]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bg-white px-1 left-2.5 top-0 -translate-y-1/2">
                  <p className="font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-xs whitespace-nowrap">Colaborador</p>
                </div>
              </div>

              {/* Botón Personalizar cuadrantes */}
              <div className="bg-white flex items-center px-4 py-2 rounded-[5px] border border-[#0C5BEF] border-solid">
                <div className="flex gap-2.5 items-center text-[#0C5BEF] text-base whitespace-nowrap">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  <div className="font-['Helvetica_Now_Text_:Regular',sans-serif]">
                    <p className="leading-6">Personalizar cuadrantes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Matriz */}
          <div className="relative">
            <div className="flex gap-4 items-center h-[481px]">
              {/* Eje Y */}
              <div className="flex items-center justify-center w-6 h-64">
                <div className="-rotate-90">
                  <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-[#5C646F] text-lg text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <span className="font-['Open_Sans:Regular',sans-serif] font-normal" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Eje Y
                    </span>
                    <span> - Desempeño </span>
                    <span className="font-['Open_Sans:Regular',sans-serif] font-normal" style={{ fontVariationSettings: "'wdth' 100" }}>
                      (Objetivos)
                    </span>
                  </p>
                </div>
              </div>

              {/* Matriz Grid */}
              <div className="flex-1 flex flex-col gap-4 min-w-0 h-full">
                <div className="flex flex-col gap-0 rounded-[10px] overflow-hidden flex-1">
                  {/* Fila 1 */}
                  <div className="flex flex-1">
                    <div className="bg-[#feda9e] flex-1 p-4 flex items-start">
                      <div className="flex gap-2.5 items-center">
                        <p className="flex-1 font-['Open_Sans:Bold',sans-serif] font-bold text-[#5C646F] text-xs" style={{ fontVariationSettings: "'wdth' 100" }}>Diamante en bruto</p>
                        <div className="flex gap-1 items-center text-[#5C646F]">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-sm" style={{ fontVariationSettings: "'wdth' 100" }}>5</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#c4d7ff] flex-1 p-4 flex items-start">
                      <div className="flex gap-2.5 items-center w-full">
                        <p className="flex-1 font-['Open_Sans:Bold',sans-serif] font-bold text-[#5C646F] text-xs" style={{ fontVariationSettings: "'wdth' 100" }}>Futuro líder</p>
                        <div className="flex gap-1 items-center text-[#5C646F]">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-sm" style={{ fontVariationSettings: "'wdth' 100" }}>0</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#7eecc6] flex-1 p-4 flex items-start">
                      <div className="flex gap-2.5 items-center w-full">
                        <p className="flex-1 font-['Open_Sans:Bold',sans-serif] font-bold text-[#5C646F] text-xs" style={{ fontVariationSettings: "'wdth' 100" }}>Estrella en crecimiento</p>
                        <div className="flex gap-1 items-center text-[#5C646F]">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-sm" style={{ fontVariationSettings: "'wdth' 100" }}>10</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fila 2 */}
                  <div className="flex flex-1">
                    <div className="bg-[#ffb4a7] flex-1 p-4 flex items-start">
                      <div className="flex gap-2.5 items-center w-full">
                        <p className="flex-1 font-['Open_Sans:Bold',sans-serif] font-bold text-[#5C646F] text-xs" style={{ fontVariationSettings: "'wdth' 100" }}>En desarrollo</p>
                        <div className="flex gap-1 items-center text-[#5C646F]">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-sm" style={{ fontVariationSettings: "'wdth' 100" }}>3</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#feda9e] flex-1 p-4 flex items-start">
                      <div className="flex gap-2.5 items-center w-full">
                        <p className="flex-1 font-['Open_Sans:Bold',sans-serif] font-bold text-[#5C646F] text-xs" style={{ fontVariationSettings: "'wdth' 100" }}>Buen contribuidor</p>
                        <div className="flex gap-1 items-center text-[#5C646F]">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-sm" style={{ fontVariationSettings: "'wdth' 100" }}>2</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#c4d7ff] flex-1 p-4 flex items-start border-2 border-[#0C5BEF]">
                      <div className="flex gap-2.5 items-center w-full">
                        <p className="flex-1 font-['Open_Sans:Bold',sans-serif] font-bold text-[#5C646F] text-xs" style={{ fontVariationSettings: "'wdth' 100" }}>Camino a la excelencia</p>
                        <div className="flex gap-1 items-center text-[#5C646F]">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-sm" style={{ fontVariationSettings: "'wdth' 100" }}>0</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fila 3 */}
                  <div className="flex flex-1">
                    <div className="bg-[#e78581] flex-1 p-4 flex items-start">
                      <div className="flex gap-2.5 items-center w-full">
                        <p className="flex-1 font-['Open_Sans:Bold',sans-serif] font-bold text-[#5C646F] text-xs" style={{ fontVariationSettings: "'wdth' 100" }}>Área de oportunidad</p>
                        <div className="flex gap-1 items-center text-[#5C646F]">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-sm" style={{ fontVariationSettings: "'wdth' 100" }}>3</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#ffb4a7] flex-1 p-4 flex items-start">
                      <div className="flex gap-2.5 items-center w-full">
                        <p className="flex-1 font-['Open_Sans:Bold',sans-serif] font-bold text-[#5C646F] text-xs" style={{ fontVariationSettings: "'wdth' 100" }}>Cumplidor estable</p>
                        <div className="flex gap-1 items-center text-[#5C646F]">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-sm" style={{ fontVariationSettings: "'wdth' 100" }}>4</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#feda9e] flex-1 p-4 flex items-start">
                      <div className="flex gap-2.5 items-center w-full">
                        <p className="flex-1 font-['Open_Sans:Bold',sans-serif] font-bold text-[#5C646F] text-xs" style={{ fontVariationSettings: "'wdth' 100" }}>Especialista respetado</p>
                        <div className="flex gap-1 items-center text-[#5C646F]">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-sm" style={{ fontVariationSettings: "'wdth' 100" }}>4</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eje X */}
                <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-[#5C646F] text-lg text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                  <span className="font-['Open_Sans:Regular',sans-serif] font-normal" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Eje X
                  </span>
                  <span> - Potencial </span>
                  <span className="font-['Open_Sans:Regular',sans-serif] font-normal" style={{ fontVariationSettings: "'wdth' 100" }}>
                    (Evaluación 360)
                  </span>
                </p>
              </div>
            </div>

            {/* Avatar posicionado */}
            <div className="absolute bg-white flex items-center justify-center px-4 py-3.5 rounded-[30px] shadow-[0px_5px_10px_0px_rgba(102,102,102,0.3)] size-[35px] top-[190px] left-[60%]">
              <div className="font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-base">
                <p className="leading-6">AA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Detalle */}
        <div className="bg-white flex flex-col gap-5 w-[309px] shrink-0 p-5 rounded-[10px] border border-[#D0D2D5] overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2.5">
              <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-[#303A47] text-sm text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                Información del cuadrante
              </p>

              <div className="bg-[#c4d7ff] rounded-[5px] px-2.5 py-1">
                <p className="font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-xs text-center">Camino a la excelencia 10%</p>
              </div>

              <p className="font-['Helvetica_Now_Text_:Regular',sans-serif] text-[#5C646F] text-xs leading-[1.5]">
                Talento prometedor con alto impacto en la organización.
              </p>
            </div>

            <div className="h-px bg-[#D0D2D5]" />

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-[#303A47] text-sm" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Colaboradores en el cuadrante
                </p>

                <div className="flex gap-1 items-center text-[#303A47] text-xs">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <p className="font-['Open_Sans:Regular',sans-serif]" style={{ fontVariationSettings: "'wdth' 100" }}>Total colaboradores:  </p>
                  <p className="font-['Open_Sans:Bold',sans-serif] font-bold" style={{ fontVariationSettings: "'wdth' 100" }}>5</p>
                </div>
              </div>

              {/* Search */}
              <div className="rounded-[5px] border border-[#D0D2D5]">
                <div className="flex gap-1 items-center px-2.5 py-1">
                  <p className="flex-1 font-['Noto_Sans:Regular',sans-serif] font-normal text-[#5C646F] text-[13px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                    Buscar por nombre
                  </p>
                  <svg className="w-4 h-4 text-[#0C5BEF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>
              </div>

              {/* Sort */}
              <div className="flex gap-1 items-center justify-end">
                <svg className="w-4 h-4 text-[#5C646F]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
                </svg>
                <div className="flex items-center px-4 py-1 rounded-[5px]">
                  <div className="flex gap-2.5 items-center text-[#0C5BEF] text-xs">
                    <p className="font-['Helvetica_Now_Text_:Regular',sans-serif]">Mayor resultado</p>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Lista Colaboradores */}
              <div className="flex flex-col gap-4">
                {[
                  { id: 1, initials: "AA", name: "Adam Andres Abril Acebes", desempeno: "4,1", potencial: "3,9" },
                  { id: 2, initials: "AT", name: "Andres Camilo Torres", desempeno: "4,1", potencial: "3,9" },
                  { id: 3, initials: "BG", name: "Bayron Jesid Garcia", desempeno: "4,1", potencial: "3,9" },
                  { id: 4, initials: "ER", name: "Estefanía Rojas Acosta", desempeno: "4,1", potencial: "3,9" },
                  { id: 5, initials: "ER", name: "Elkin Garcia Salazar", desempeno: "4,1", potencial: "3,9" }
                ].map((person) => (
                  <div key={person.id} className="flex gap-1 items-start">
                    <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-[#303A47] text-sm" style={{ fontVariationSettings: "'wdth' 100" }}>
                      {person.id}
                    </p>
                    <div className="bg-[#0C5BEF] rounded-full size-[23px] flex items-center justify-center">
                      <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-white text-xs" style={{ fontVariationSettings: "'wdth' 100" }}>
                        {person.initials}
                      </p>
                    </div>
                    <div className="flex-1 flex flex-col text-[#303A47] text-xs">
                      <p className="font-['Open_Sans:Bold',sans-serif] font-bold" style={{ fontVariationSettings: "'wdth' 100" }}>
                        {person.name}
                      </p>
                      <div className="font-['Open_Sans:Regular',sans-serif] font-normal text-[#5C646F]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="mb-0">Desempeño: {person.desempeno}</p>
                        <p>Potencial: {person.potencial}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer - Crear Reporte Unificado */}
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-[100] animate-[fadeIn_0.3s_ease-in-out]"
            onClick={() => handleCloseDrawer()}
          />

          {/* Drawer Panel */}
          <div
            className="fixed top-0 right-0 h-full w-[440px] bg-white shadow-2xl z-[101] flex flex-col animate-[slideInRight_0.3s_ease-in-out]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#D0D2D5]">
              <div className="flex items-center justify-between">
                <h2 className="font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-xl flex-1">
                  {showReportOptions ? 'Reporte en cola' : 'Crear Reporte Unificado'}
                </h2>
                <button
                  onClick={() => handleCloseDrawer()}
                  className="text-[#303A47] hover:text-[#0C5BEF] transition-colors ml-3"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>

              {/* Progreso de descarga en el header - solo cuando hay descargas activas y estamos en vista de formulario */}
              {isDownloading && !downloadComplete && !showReportOptions && downloadingReports.length > 0 && (() => {
                const avgProgress = Math.round(downloadingReports.reduce((sum, r) => sum + r.progress, 0) / downloadingReports.length);
                const inProgress = downloadingReports.filter(r => r.status !== 'completed').length;
                return (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[#0C5BEF] animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <span className="font-['Noto_Sans:Regular',sans-serif] text-xs text-[#5C646F]">
                          {inProgress > 0 ? `${inProgress} elemento${inProgress > 1 ? 's' : ''} en cola` : 'Finalizando...'}
                        </span>
                      </div>
                      <span className="font-['Noto_Sans:Bold',sans-serif] text-xs text-[#0C5BEF]">{avgProgress}%</span>
                    </div>
                    <div className="w-full bg-[#E7E8EA] rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-[#0C5BEF] h-full transition-all duration-300 rounded-full"
                        style={{ width: `${avgProgress}%` }}
                      />
                    </div>
                    <button
                      onClick={() => setShowReportOptions(true)}
                      className="text-xs text-[#0C5BEF] hover:underline mt-1.5"
                    >
                      Ver detalle →
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* Content */}
            {showReportOptions ? (
              // Vista de progreso de descarga - Lista de reportes
              <div className="flex-1 flex flex-col px-6 py-6 overflow-hidden">
                {/* Encabezado con info */}
                <div className="mb-4">
                  <h3 className="font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-base">
                    {downloadComplete ? 'Descargas completadas' : 'Descargando reportes'}
                  </h3>
                </div>

                {/* Lista de reportes descargando */}
                <div className="flex-1 overflow-y-auto mb-4">
                  {downloadingReports.length > 0 ? (
                    <div className="space-y-3">
                      {downloadingReports.map((report) => (
                        <div key={report.id} className="pb-3 border-b border-[#E7E8EA] last:border-b-0">
                          {cancelConfirmReportId === report.id ? (
                            /* Confirmación inline por reporte */
                            <div className="bg-[#FFF4F2] border border-[#FECDC9] rounded-lg p-3">
                              <p className="font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] mb-3">
                                ¿Detener la descarga de <span className="font-['Noto_Sans:Bold',sans-serif]">{report.name}</span>?
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleCancelSingleReport(report.id)}
                                  className="flex-1 bg-[#D92D20] text-white px-3 py-2 rounded-lg font-['Noto_Sans:Regular',sans-serif] text-xs hover:bg-[#B42318] transition-colors"
                                >
                                  Sí, detener
                                </button>
                                <button
                                  onClick={() => setCancelConfirmReportId(null)}
                                  className="flex-1 bg-white text-[#303A47] px-3 py-2 rounded-lg font-['Noto_Sans:Regular',sans-serif] text-xs border border-[#D0D2D5] hover:bg-[#F3F3F4] transition-colors"
                                >
                                  No, continuar
                                </button>
                              </div>
                            </div>
                          ) : report.status === 'error' ? (
                            // Error state: only name, icon, and retry button
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="w-5 h-5 rounded-full bg-[#D92D20] flex items-center justify-center flex-shrink-0">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                  </svg>
                                </div>
                                <p className="font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] truncate">
                                  {report.name}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRetryReport(report.id)}
                                className="text-xs text-[#0C5BEF] hover:underline font-['Noto_Sans:Regular',sans-serif] whitespace-nowrap ml-2 flex-shrink-0"
                              >
                                Reintentar
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  {report.status === 'completed' ? (
                                    <div className="w-5 h-5 rounded-full bg-[#17B26A] flex items-center justify-center flex-shrink-0">
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                      </svg>
                                    </div>
                                  ) : (
                                    <svg className="w-5 h-5 text-[#0C5BEF] animate-spin flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  )}
                                  <p className="font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] truncate">
                                    {report.name}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                                  <p className="font-['Noto_Sans:Bold',sans-serif] text-sm text-[#0C5BEF]">
                                    {report.progress}%
                                  </p>
                                  {report.status === 'downloading' && (
                                    <button
                                      onClick={() => setCancelConfirmReportId(report.id)}
                                      className="w-5 h-5 rounded-full bg-[#F3F3F4] hover:bg-[#FDEAEA] flex items-center justify-center transition-colors group"
                                      title="Detener descarga"
                                    >
                                      <svg className="w-3 h-3 text-[#5C646F] group-hover:text-[#D92D20]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 6h12v12H6z"/>
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              </div>
                              {/* Barra de progreso */}
                              <div className="w-full bg-[#E7E8EA] rounded-full h-1.5 overflow-hidden mb-2">
                                <div
                                  className="bg-[#0C5BEF] h-full transition-all duration-300 ease-out rounded-full"
                                  style={{ width: `${report.progress}%` }}
                                />
                              </div>
                              <p className="font-['Noto_Sans:Regular',sans-serif] text-xs text-[#5C646F]">
                                {alcance === 'Toda la empresa' ? '142 colaboradores' : `${alcance}: ${alcanceFieldValue || 'Seleccionado'}`}
                              </p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-['Noto_Sans:Regular',sans-serif] text-xs text-[#5C646F] text-center py-8">
                      No hay reportes en descarga
                    </p>
                  )}
                </div>

                {/* Mensaje de estado */}
                {downloadComplete && !downloadingReports.some(r => r.status === 'error') ? (
                  <div className="bg-[#F0F9F7] border border-[#10B981] rounded-lg p-3 flex gap-2 mb-4">
                    <svg className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <p className="font-['Noto_Sans:Regular',sans-serif] text-xs text-[#065F46]">
                      Reportes generados y descargados. Listos para visualizar.
                    </p>
                  </div>
                ) : !downloadComplete ? (
                  <div className="bg-[#E7F0FF] border border-[#A2C4FF] rounded-lg p-3 flex gap-2 mb-4">
                    <svg className="w-5 h-5 text-[#0C5BEF] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <p className="font-['Noto_Sans:Regular',sans-serif] text-xs text-[#303A47]">
                      La descarga está en progreso. Puedes seguir generando reportes o minimizar esta ventana.
                    </p>
                  </div>
                ) : null}

                {/* Opciones de acción */}
                <div className="space-y-3">
                  {showDrawerCancelAllConfirm ? (
                    /* Confirmación inline cancelar todo */
                    <div className="bg-[#FFF4F2] border border-[#FECDC9] rounded-lg p-4">
                      <p className="font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] mb-1">
                        ¿Cancelar todas las descargas en progreso?
                      </p>
                      <p className="font-['Noto_Sans:Regular',sans-serif] text-xs text-[#5C646F] mb-3">
                        Esta acción no se puede deshacer.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleConfirmCancel}
                          className="flex-1 bg-[#D92D20] text-white px-3 py-2.5 rounded-lg font-['Noto_Sans:Regular',sans-serif] text-sm hover:bg-[#B42318] transition-colors"
                        >
                          Sí, cancelar todo
                        </button>
                        <button
                          onClick={() => setShowDrawerCancelAllConfirm(false)}
                          className="flex-1 bg-white text-[#303A47] px-3 py-2.5 rounded-lg font-['Noto_Sans:Regular',sans-serif] text-sm border border-[#D0D2D5] hover:bg-[#F3F3F4] transition-colors"
                        >
                          No, continuar
                        </button>
                      </div>
                    </div>
                  ) : downloadComplete && !downloadingReports.some(r => r.status === 'error') ? (
                    <>
                      <button
                        onClick={handleOpenFolder}
                        className="w-full bg-[#0C5BEF] text-white px-4 py-3 rounded-lg font-['Helvetica_Now_Text_:Bold',sans-serif] text-base hover:bg-[#0A4BC7] transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
                        </svg>
                        Abrir carpeta de descargas
                      </button>
                      <button
                        onClick={handleContinueGenerating}
                        className="w-full bg-white text-[#0C5BEF] px-4 py-3 rounded-lg font-['Helvetica_Now_Text_:Regular',sans-serif] text-base border border-[#0C5BEF] hover:bg-[#F3F3F4] transition-colors"
                      >
                        Generar más reportes
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleContinueGenerating}
                        className="w-full bg-[#0C5BEF] text-white px-4 py-3 rounded-lg font-['Helvetica_Now_Text_:Bold',sans-serif] text-base hover:bg-[#0A4BC7] transition-colors"
                      >
                        Generar más reportes
                      </button>
                      <button
                        onClick={handleExitAndDownload}
                        className="w-full bg-white text-[#303A47] px-4 py-3 rounded-lg font-['Helvetica_Now_Text_:Regular',sans-serif] text-base border border-[#D0D2D5] hover:bg-[#F3F3F4] transition-colors"
                      >
                        Minimizar y continuar
                      </button>
                      <button
                        onClick={() => setShowDrawerCancelAllConfirm(true)}
                        className="w-full bg-white text-[#D92D20] px-4 py-3 rounded-lg font-['Helvetica_Now_Text_:Regular',sans-serif] text-base border border-[#D92D20] hover:bg-[#FDEAEA] transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 6h12v12H6z"/>
                        </svg>
                        Cancelar descarga
                      </button>
                    </>
                  )}

                  {!showDrawerCancelAllConfirm && (
                    <button
                      onClick={() => handleCloseDrawer()}
                      className="w-full text-[#5C646F] px-4 py-2 rounded-lg font-['Helvetica_Now_Text_:Regular',sans-serif] text-sm hover:bg-[#F3F3F4] transition-colors"
                    >
                      Cerrar
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // Vista de formulario original
              <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Tipo de Reporte */}
              <div className="mb-6">
                <label className="block font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-xs mb-2 uppercase tracking-wide">
                  Tipo de reporte
                </label>
                <div className="flex gap-2 bg-[#E7E8EA] p-1 rounded-lg">
                  <button
                    onClick={() => {
                      setReportType('Individual');
                      setAlcanceFieldValue('');
                      setShowAlcanceFieldError(false);
                    }}
                    className={`flex-1 py-2 px-4 rounded-md font-['Helvetica_Now_Text_:Regular',sans-serif] text-sm transition-all ${
                      reportType === 'Individual'
                        ? 'bg-white text-[#0C5BEF] shadow-sm'
                        : 'text-[#303A47] hover:text-[#0C5BEF]'
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    onClick={() => {
                      setReportType('Masivo');
                      setShowColaboradorError(false);
                    }}
                    className={`flex-1 py-2 px-4 rounded-md font-['Helvetica_Now_Text_:Regular',sans-serif] text-sm transition-all ${
                      reportType === 'Masivo'
                        ? 'bg-white text-[#303A47] shadow-sm'
                        : 'text-[#303A47] hover:text-[#0C5BEF]'
                    }`}
                  >
                    Masivo
                  </button>
                </div>
              </div>

              {reportType === 'Individual' ? (
                <>
                  {/* Seleccionar Colaborador */}
                  <div className="mb-6">
                    <label className="block font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-xs mb-2 uppercase tracking-wide">
                      Seleccionar colaborador
                    </label>
                    <div className="relative" ref={searchRef}>
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C646F] z-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="Buscar colaborador..."
                        value={selectedColaborador || searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setSelectedColaborador('');
                          setShowSuggestions(true);
                          setShowColaboradorError(false);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] placeholder-[#5C646F] focus:outline-none focus:border-[#0C5BEF] focus:ring-1 focus:ring-[#0C5BEF] ${
                          showColaboradorError ? 'border-[#D92D20]' : 'border-[#D0D2D5]'
                        }`}
                      />

                      {/* Dropdown de sugerencias */}
                      {showSuggestions && searchTerm && filteredColaboradores.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D0D2D5] rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                          {filteredColaboradores.map((colaborador) => (
                            <button
                              key={colaborador.id}
                              onClick={() => {
                                setSelectedColaborador(colaborador.name);
                                setSearchTerm('');
                                setShowSuggestions(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F3F3F4] transition-colors text-left"
                            >
                              <div className="bg-[#0C5BEF] rounded-full size-8 flex items-center justify-center shrink-0">
                                <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-white text-xs">
                                  {colaborador.initials}
                                </p>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] truncate">
                                  {colaborador.name}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Mensaje cuando no hay resultados */}
                      {showSuggestions && searchTerm && filteredColaboradores.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D0D2D5] rounded-lg shadow-lg px-4 py-3 z-50">
                          <p className="font-['Noto_Sans:Regular',sans-serif] text-sm text-[#5C646F] text-center">
                            No se encontraron colaboradores
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Error de colaborador */}
                    {showColaboradorError && (
                      <p className="text-[#D92D20] text-xs mt-1 font-['Noto_Sans:Regular',sans-serif]">
                        Por favor selecciona un colaborador antes de generar el reporte.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Configuración de Alcance */}
                  <div className="mb-6">
                    <label className="block font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-xs mb-2 uppercase tracking-wide">
                      Configuración de alcance
                    </label>
                    <div className="relative">
                      {openDropdown === 'alcance' && (
                        <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                      )}
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(openDropdown === 'alcance' ? null : 'alcance')}
                        className="w-full px-4 py-3 border border-[#D0D2D5] rounded-lg font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] bg-white flex items-center justify-between hover:border-[#0C5BEF] transition-colors"
                      >
                        <span>{alcance}</span>
                        <svg className={`w-4 h-4 text-[#303A47] transition-transform duration-200 ${openDropdown === 'alcance' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z"/>
                        </svg>
                      </button>
                      {openDropdown === 'alcance' && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D0D2D5] rounded-lg shadow-xl z-50 overflow-hidden">
                          {['Toda la empresa', 'Área', 'Líder', 'País', 'Ciudad', 'Columna A', 'Columna B'].map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => { setAlcance(opt); setAlcanceFieldValue(''); setShowAlcanceFieldError(false); setOpenDropdown(null); }}
                              className={`w-full px-4 py-2.5 text-left font-['Noto_Sans:Regular',sans-serif] text-sm transition-colors flex items-center justify-between ${
                                alcance === opt ? 'text-[#0C5BEF] bg-[#EEF4FF]' : 'text-[#303A47] hover:bg-[#F3F3F4]'
                              }`}
                            >
                              {opt}
                              {alcance === opt && (
                                <svg className="w-4 h-4 text-[#0C5BEF]" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {alcance === 'Toda la empresa' && (
                      <div className="mt-3 bg-[#E7F0FF] border border-[#A2C4FF] rounded-lg p-3 flex gap-2">
                        <svg className="w-5 h-5 text-[#0C5BEF] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                        <p className="font-['Noto_Sans:Regular',sans-serif] text-xs text-[#303A47]">
                          Se generarán reportes para los {getColaboradoresCount('Toda la empresa', '')} colaboradores analizados en el ciclo actual.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Campo específico según selección */}
                  {(['Área', 'Líder', 'País', 'Ciudad'] as const).includes(alcance as any) && (
                    <div className="mb-6">
                      <label className="block font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-xs mb-2">
                        {alcance}
                      </label>
                      <div className="relative">
                        {openDropdown === 'alcanceField' && (
                          <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (openDropdown === 'alcanceField') {
                              setOpenDropdown(null);
                            } else {
                              const loadFailed = isErrorDemoMode && Math.random() < 0.25;
                              setFetchDataError(loadFailed);
                              setOpenDropdown('alcanceField');
                            }
                          }}
                          className={`w-full px-4 py-3 border rounded-lg font-['Noto_Sans:Regular',sans-serif] text-sm bg-white flex items-center justify-between hover:border-[#0C5BEF] transition-colors ${
                            showAlcanceFieldError ? 'border-[#D92D20]' : 'border-[#D0D2D5]'
                          }`}
                        >
                          <span className={alcanceFieldValue ? 'text-[#303A47]' : 'text-[#5C646F]'}>
                            {alcanceFieldValue || `Seleccionar ${alcance.toLowerCase()}...`}
                          </span>
                          <svg className={`w-4 h-4 text-[#303A47] transition-transform duration-200 ${openDropdown === 'alcanceField' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 10l5 5 5-5z"/>
                          </svg>
                        </button>
                        {openDropdown === 'alcanceField' && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D0D2D5] rounded-lg shadow-xl z-50 overflow-hidden">
                            {fetchDataError ? (
                              <div className="px-4 py-4 flex flex-col items-center gap-2 text-center">
                                <svg className="w-8 h-8 text-[#D92D20]" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                </svg>
                                <p className="font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47]">No pudimos cargar las opciones</p>
                                <p className="font-['Noto_Sans:Regular',sans-serif] text-xs text-[#5C646F]">Verifica tu conexión e intenta de nuevo.</p>
                                <button
                                  type="button"
                                  onClick={() => { setFetchDataError(false); }}
                                  className="mt-1 px-3 py-1.5 bg-[#0C5BEF] text-white rounded-lg font-['Noto_Sans:Regular',sans-serif] text-xs hover:bg-[#0A4BC7] transition-colors"
                                >
                                  Reintentar
                                </button>
                              </div>
                            ) : (
                              (alcance === 'Área' ? ['Tecnología', 'Ventas', 'Marketing', 'Recursos Humanos', 'Operaciones']
                                : alcance === 'Líder' ? ['Juan Pérez', 'María González', 'Carlos Rodríguez', 'Ana Martínez']
                                : alcance === 'País' ? ['México', 'Colombia', 'Argentina', 'Chile', 'Perú']
                                : ['Bogotá', 'Medellín', 'Ciudad de México', 'Guadalajara', 'Buenos Aires', 'Córdoba', 'Santiago', 'Valparaíso', 'Lima']
                              ).map(opt => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => { setAlcanceFieldValue(opt); setShowAlcanceFieldError(false); setOpenDropdown(null); }}
                                  className={`w-full px-4 py-2.5 text-left font-['Noto_Sans:Regular',sans-serif] text-sm transition-colors flex items-center justify-between ${
                                    alcanceFieldValue === opt ? 'text-[#0C5BEF] bg-[#EEF4FF]' : 'text-[#303A47] hover:bg-[#F3F3F4]'
                                  }`}
                                >
                                  {opt}
                                  {alcanceFieldValue === opt && (
                                    <svg className="w-4 h-4 text-[#0C5BEF]" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                    </svg>
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                      {showAlcanceFieldError && (
                        <p className="text-[#D92D20] text-xs mt-1 font-['Noto_Sans:Regular',sans-serif]">
                          Debes seleccionar {alcance === 'Área' ? 'un área' : alcance === 'Líder' ? 'un líder' : alcance === 'País' ? 'un país' : 'una ciudad'} para generar los reportes masivos.
                        </p>
                      )}
                      {alcanceFieldValue && (
                        <div className="mt-3 bg-[#E7F0FF] border border-[#A2C4FF] rounded-lg p-3 flex gap-2">
                          <svg className="w-5 h-5 text-[#0C5BEF] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                          </svg>
                          <p className="font-['Noto_Sans:Regular',sans-serif] text-xs text-[#303A47]">
                            Se generarán reportes para los {getColaboradoresCount(alcance, alcanceFieldValue)} colaboradores
                            {alcance === 'Área' ? ' del área' : alcance === 'Líder' ? ' bajo este líder' : alcance === 'País' ? ' del país' : ' de la ciudad'} seleccionado.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {alcance === 'Columna A' && (
                    <div className="mb-6">
                      <label className="block font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-xs mb-2">
                        Columna A
                      </label>
                      <input
                        type="text"
                        placeholder="Ingresar valor para Columna A..."
                        value={alcanceFieldValue}
                        onChange={(e) => { setAlcanceFieldValue(e.target.value); setShowAlcanceFieldError(false); }}
                        className={`w-full px-4 py-3 border rounded-lg font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] placeholder-[#5C646F] focus:outline-none focus:border-[#0C5BEF] focus:ring-1 focus:ring-[#0C5BEF] ${showAlcanceFieldError ? 'border-[#D92D20]' : 'border-[#D0D2D5]'}`}
                      />
                      {showAlcanceFieldError && (
                        <p className="text-[#D92D20] text-xs mt-1 font-['Noto_Sans:Regular',sans-serif]">Debes ingresar un valor para Columna A.</p>
                      )}
                    </div>
                  )}

                  {alcance === 'Columna B' && (
                    <div className="mb-6">
                      <label className="block font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-xs mb-2">
                        Columna B
                      </label>
                      <input
                        type="text"
                        placeholder="Ingresar valor para Columna B..."
                        value={alcanceFieldValue}
                        onChange={(e) => { setAlcanceFieldValue(e.target.value); setShowAlcanceFieldError(false); }}
                        className={`w-full px-4 py-3 border rounded-lg font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] placeholder-[#5C646F] focus:outline-none focus:border-[#0C5BEF] focus:ring-1 focus:ring-[#0C5BEF] ${showAlcanceFieldError ? 'border-[#D92D20]' : 'border-[#D0D2D5]'}`}
                      />
                      {showAlcanceFieldError && (
                        <p className="text-[#D92D20] text-xs mt-1 font-['Noto_Sans:Regular',sans-serif]">Debes ingresar un valor para Columna B.</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Configuración de Pesos */}
              <div className="mb-6">
                <label className="block font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-xs mb-2 uppercase tracking-wide">
                  Configuración de pesos
                </label>
                <p className="text-[#5C646F] text-xs mb-4 font-['Noto_Sans:Regular',sans-serif]">
                  La suma de los porcentajes debe ser exactamente 100%
                </p>

                {/* Evaluación 360 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-['Helvetica_Now_Text_:Regular',sans-serif] text-[#303A47] text-sm">
                      Evaluación 360
                    </label>
                    <span className="bg-[#E7F0FF] text-[#0C5BEF] px-2 py-1 rounded text-xs font-['Helvetica_Now_Text_:Bold',sans-serif]">
                      %
                    </span>
                  </div>
                  <input
                    type="number"
                    value={peso360}
                    onChange={(e) => setPeso360(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] focus:outline-none focus:border-[#0C5BEF] focus:ring-1 focus:ring-[#0C5BEF] ${
                      hasPesoError ? 'border-[#D92D20]' : 'border-[#D0D2D5]'
                    }`}
                  />
                  {hasPesoError && (
                    <p className="text-[#D92D20] text-xs mt-1 font-['Noto_Sans:Regular',sans-serif]">
                      {totalPeso > 100
                        ? `Reduce este porcentaje. La suma actual es ${totalPeso}%.`
                        : `Aumenta este porcentaje. La suma actual es ${totalPeso}%.`
                      }
                    </p>
                  )}
                </div>

                {/* Cumplimiento de Objetivos */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-['Helvetica_Now_Text_:Regular',sans-serif] text-[#303A47] text-sm">
                      Cumplimiento de Objetivos
                    </label>
                    <span className="bg-[#E7F0FF] text-[#0C5BEF] px-2 py-1 rounded text-xs font-['Helvetica_Now_Text_:Bold',sans-serif]">
                      %
                    </span>
                  </div>
                  <input
                    type="number"
                    value={pesoObjetivos}
                    onChange={(e) => setPesoObjetivos(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] focus:outline-none focus:border-[#0C5BEF] focus:ring-1 focus:ring-[#0C5BEF] ${
                      hasPesoError ? 'border-[#D92D20]' : 'border-[#D0D2D5]'
                    }`}
                  />
                  {hasPesoError && (
                    <p className="text-[#D92D20] text-xs mt-1 font-['Noto_Sans:Regular',sans-serif]">
                      {totalPeso > 100
                        ? `Reduce este porcentaje. La suma actual es ${totalPeso}%.`
                        : `Aumenta este porcentaje. La suma actual es ${totalPeso}%.`
                      }
                    </p>
                  )}
                </div>
              </div>

              {/* Total Peso Asignado */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-xs uppercase tracking-wide">
                    Total peso asignado
                  </label>
                  <span className={`px-3 py-1 rounded-full text-xs font-['Helvetica_Now_Text_:Bold',sans-serif] flex items-center gap-1 ${
                    totalPeso === 100
                      ? 'bg-[#F3F3F4] text-[#5C646F]'
                      : 'bg-[#FEF3F2] text-[#D92D20]'
                  }`}>
                    {totalPeso === 100 ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                      </svg>
                    )}
                    Total: {totalPeso}%
                  </span>
                </div>
              </div>
            </div>
            )}

            {/* Footer Actions - Solo mostrar si no está en vista de opciones */}
            {!showReportOptions && (
              <div className="border-t border-[#D0D2D5] px-6 py-4 space-y-3">
                <button
                  onClick={handleGenerateReport}
                  disabled={isGeneratingPdf}
                className={`w-full py-3 rounded-lg font-['Helvetica_Now_Text_:Bold',sans-serif] text-base transition-all ${
                  !isGeneratingPdf
                    ? 'bg-[#0C5BEF] text-white hover:bg-[#0A4BC7] cursor-pointer'
                    : 'bg-[#E1E2E5] text-[#A2A6AD] cursor-not-allowed'
                }`}
              >
                {isGeneratingPdf ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando PDF...
                  </span>
                ) : (
                  reportType === 'Individual' ? 'Generar reporte' : 'Generar reportes masivos'
                )}
                </button>
                <button
                  onClick={() => handleCloseDrawer()}
                  disabled={isGeneratingPdf}
                  className={`w-full py-3 rounded-lg font-['Helvetica_Now_Text_:Regular',sans-serif] text-base transition-colors ${
                    isGeneratingPdf ? 'text-[#A2A6AD] cursor-not-allowed' : 'text-[#303A47] hover:bg-[#F3F3F4]'
                  }`}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Panel de progreso de descarga masiva */}
      {isDownloading && !isDrawerOpen && !isDownloadMinimized && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border border-[#D0D2D5] w-[400px] z-50 max-h-[500px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#D0D2D5] flex-shrink-0">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-sm">
                  {downloadComplete && !downloadingReports.some(r => r.status === 'error') ? 'Descargas completadas' : 'Descargando reportes'}
                </h3>
              </div>
              {!downloadComplete && downloadingReports.length > 0 && (
                <p className="font-['Noto_Sans:Regular',sans-serif] text-[#5C646F] text-xs">
                  {downloadingReports.filter(r => r.status === 'downloading').length} {downloadingReports.filter(r => r.status === 'downloading').length === 1 ? 'reporte' : 'reportes'} en cola
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {!downloadComplete && (
                <button
                  onClick={() => setIsDownloadMinimized(true)}
                  className="p-1 hover:bg-[#F3F3F4] rounded transition-colors"
                  title="Minimizar"
                >
                  <svg className="w-4 h-4 text-[#5C646F]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              )}
              <button
                onClick={() => { setPendingCancelReportId(null); handleCloseDownload(); }}
                className="p-1 hover:bg-[#F3F3F4] rounded transition-colors"
                title={downloadComplete ? 'Cerrar' : 'Detener descarga'}
              >
                <svg className="w-4 h-4 text-[#5C646F]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Body - List of Reports */}
          <div className="px-4 py-4 overflow-y-auto flex-1">
            {downloadingReports.length > 0 ? (
              <div className="space-y-3">
                {downloadingReports.map((report) => (
                  <div key={report.id} className="pb-3 border-b border-[#E7E8EA] last:border-b-0">
                    {report.status === 'error' ? (
                      // Error state: only name, icon, and retry button
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-5 h-5 rounded-full bg-[#D92D20] flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                          </div>
                          <p className="font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] truncate">
                            {report.name}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRetryReport(report.id)}
                          className="text-xs text-[#0C5BEF] hover:underline font-['Noto_Sans:Regular',sans-serif] whitespace-nowrap ml-2 flex-shrink-0"
                        >
                          Reintentar
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {report.status === 'completed' ? (
                              <div className="w-5 h-5 rounded-full bg-[#17B26A] flex items-center justify-center flex-shrink-0">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                </svg>
                              </div>
                            ) : (
                              <svg className="w-5 h-5 text-[#0C5BEF] animate-spin flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                              </svg>
                            )}
                            <p className="font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] truncate">
                              {report.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                            <p className="font-['Noto_Sans:Bold',sans-serif] text-sm text-[#0C5BEF]">
                              {report.progress}%
                            </p>
                            {report.status === 'downloading' && (
                              <button
                                onClick={() => { setPendingCancelReportId(report.id); setShowCancelConfirmation(true); }}
                                className="w-5 h-5 rounded-full bg-[#F3F3F4] hover:bg-[#FDEAEA] flex items-center justify-center transition-colors group"
                                title="Detener descarga"
                              >
                                <svg className="w-3 h-3 text-[#5C646F] group-hover:text-[#D92D20]" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M6 6h12v12H6z"/>
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                        {report.status !== 'completed' && (
                          <div className="w-full bg-[#E7E8EA] rounded-full h-1.5 overflow-hidden ml-7" style={{ width: 'calc(100% - 1.75rem)' }}>
                            <div
                              className="bg-[#0C5BEF] h-full transition-all duration-300 ease-out rounded-full"
                              style={{ width: `${report.progress}%` }}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-['Noto_Sans:Regular',sans-serif] text-xs text-[#5C646F]">
                No hay reportes en descarga
              </p>
            )}
          </div>

          {/* Footer Actions */}
          {downloadComplete && !downloadingReports.some(r => r.status === 'error') ? (
            <div className="px-4 py-3 border-t border-[#D0D2D5] flex gap-2 flex-shrink-0">
              <button onClick={handleOpenFolder} className="flex-1 bg-[#0C5BEF] text-white px-4 py-2 rounded-lg font-['Helvetica_Now_Text_:Bold',sans-serif] text-sm hover:bg-[#0A4BC7] transition-colors">
                Abrir carpeta
              </button>
              <button
                onClick={handleCloseDownload}
                className="flex-1 bg-white text-[#303A47] px-4 py-2 rounded-lg font-['Helvetica_Now_Text_:Regular',sans-serif] text-sm border border-[#D0D2D5] hover:bg-[#F3F3F4] transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <div className="px-4 py-3 border-t border-[#D0D2D5] flex-shrink-0">
              <p className="font-['Noto_Sans:Regular',sans-serif] text-xs text-[#5C646F]">
                Puedes minimizar esta ventana y seguir trabajando
              </p>
            </div>
          )}
        </div>
      )}

      {/* Indicador minimizado de descarga - Google Drive style */}
      {isDownloading && !isDrawerOpen && isDownloadMinimized && (!downloadComplete || downloadingReports.some(r => r.status === 'error')) && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border border-[#D0D2D5] w-[400px] z-50">
          {downloadComplete ? (
            // Versión simplificada cuando está completado
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#17B26A] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                </div>
                <p className="font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-sm">
                  Descarga completada
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsDownloadMinimized(false)}
                  className="p-1 hover:bg-[#F3F3F4] rounded transition-colors"
                  title="Expandir"
                >
                  <svg className="w-4 h-4 text-[#5C646F]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M18 15l-6-6-6 6"/>
                  </svg>
                </button>
                <button
                  onClick={handleCloseDownload}
                  className="p-1 hover:bg-[#F3F3F4] rounded transition-colors"
                  title="Cerrar"
                >
                  <svg className="w-4 h-4 text-[#5C646F]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            // Versión con progreso
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#D0D2D5]">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-[#0C5BEF]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
                    </svg>
                    <h3 className="font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-sm">
                      Generando reportes masivos
                    </h3>
                  </div>
                  {reportsInQueue > 0 && (
                    <p className="font-['Noto_Sans:Regular',sans-serif] text-[#5C646F] text-xs ml-7">
                      {reportsInQueue} {reportsInQueue === 1 ? 'reporte' : 'reportes'} en cola
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setIsDownloadMinimized(false);
                    }}
                    className="p-1 hover:bg-[#F3F3F4] rounded transition-colors"
                    title="Expandir"
                  >
                    <svg className="w-4 h-4 text-[#5C646F]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M18 15l-6-6-6 6"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => { setPendingCancelReportId(null); handleCloseDownload(); }}
                    className="p-1 hover:bg-[#F3F3F4] rounded transition-colors"
                    title="Detener descarga"
                  >
                    <svg className="w-4 h-4 text-[#5C646F]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal de confirmación para cancelar descarga */}
      {showCancelConfirmation && (() => {
        return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl border-0">
            <div className="flex gap-3 mb-4">
              <div className="bg-[#FDEAEA] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#D92D20]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-base mb-1">
                  ¿Detener descarga?
                </h3>
                <p className="font-['Noto_Sans:Regular',sans-serif] text-[#5C646F] text-sm">
                  Si te detienes ahora, los reportes en progreso no se guardarán.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleKeepDownloading}
                className="flex-1 bg-white text-[#303A47] px-3 py-2 rounded-lg font-['Helvetica_Now_Text_:Regular',sans-serif] text-xs border border-[#D0D2D5] hover:bg-[#F3F3F4] transition-colors whitespace-nowrap"
              >
                Seguir descargando
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 bg-[#D92D20] text-white px-3 py-2 rounded-lg font-['Helvetica_Now_Text_:Bold',sans-serif] text-xs hover:bg-[#BA2318] transition-colors whitespace-nowrap"
              >
                Detener descarga
              </button>
            </div>
          </div>
        </div>
      );
      })()}

      {/* Toast de error - Centrado abajo, compacto */}
      {errorNotification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] w-full px-4 max-w-md animate-[slideUp_0.3s_ease-in-out]">
          <div className="bg-[#FEF3F2] rounded-lg border border-[#FED4D1] p-3 shadow-md">
            <div className="flex items-start gap-3">
              <div className="bg-[#D92D20] rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['Noto_Sans:Bold',sans-serif] text-[#D92D20] text-xs mb-0.5">{errorNotification.title}</p>
                <p className="font-['Noto_Sans:Regular',sans-serif] text-[#8B4545] text-xs leading-tight">{errorNotification.message}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setErrorNotification(null);
                }}
                className="text-[#D92D20] hover:text-[#A71E17] transition-colors flex-shrink-0 self-start"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
