// PDF Bundle Entry Point
// This file is the ONLY place that imports @react-pdf/renderer
// All PDF functionality is exported from here for lazy loading

// Core PDF functionality
export { pdf, PDFDownloadLink } from '@react-pdf/renderer'

// PDF Components
export { default as StudentListPDF } from './StudentlistPDF.component'
export { default as GrouplistPDF } from './GrouplistPDF.component' 
export { default as RepertoirePDF } from './RepertoirePDF.component'
export { default as TimetablePDF } from './TimetablePDF.component'
export { LessonsPDF } from './LessonsPDF.component'