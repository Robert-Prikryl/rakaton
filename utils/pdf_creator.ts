import jsPDF from 'jspdf'
import logoPath from '@/assets/images/motol_logo.png'

// ... other imports and code ...

interface Doctor {
  firstname: string;
  surname: string;
  specialization: string;
  email: string;
  phone: string;
}

interface PDFTemplate {
  header: {
    title: string;
    logo?: string;
  };
  content: {
    basicInfo: {
      date: string;
      place: string;
    };
    patientInfo: {
      name: string;
      birthNumber: string;
      insuranceId: string;
    };
    modalities?: Array<{
      type: string;
      date: string;
      place: string;
      results: string;
    }>;
    questions?: Array<{
      question: string;
      tasks?: Array<{
        name: string;
        description: string;
      }>;
    }>;
    doctors: Array<{
      name: string;
      specialization: string;
    }>;
  };
  footer: {
    createdAt: string;
    pageInfo: boolean;
  };
}

function removeDiacritics(text: string): string {
  return text.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[řŘ]/g, 'r')
    .replace(/[čČ]/g, 'c')
    .replace(/[žŽ]/g, 'z')
    .replace(/[šŠ]/g, 's')
    .replace(/[ýÝ]/g, 'y')
    .replace(/[áÁ]/g, 'a')
    .replace(/[íÍ]/g, 'i')
    .replace(/[éÉ]/g, 'e')
    .replace(/[ěĚ]/g, 'e')
    .replace(/[ťŤ]/g, 't')
    .replace(/[ďĎ]/g, 'd')
    .replace(/[ňŇ]/g, 'n')
    .replace(/[úůÚŮ]/g, 'u')
}

function downloadReportUtils(activeMeeting: any, patient: any) {
  const doc = new jsPDF()
//   const logoUrl = 'https://cdn.freebiesupply.com/logos/large/2x/fn-motol-logo-png-transparent.png' // Replace with your actual logo URL
  const logoWidth = 30 // Adjust as needed
  const logoHeight = 30 // Adjust as needed
  const margin = 20
  
  // Set Czech font support
  doc.setFont("helvetica")
  
  // Add logo
  doc.addImage(logoPath, 'PNG', margin, margin, logoWidth, logoHeight)
  
  // Add header with logo - adjust text position to accommodate logo
  doc.setFontSize(22)
  doc.text(removeDiacritics("Rakaton - Zapis ze schuzky"), margin + logoWidth + 10, margin + (logoHeight/2))
  
  // Rest of your code, but adjust starting Y position to account for logo
  const startY = margin + logoHeight + 10
  
  // Add meeting info
  doc.setFontSize(14)
  doc.text(removeDiacritics(`Neurologicky tym - ${formatDate(activeMeeting.date)}`), margin, startY + 15)
  doc.text(removeDiacritics(`Misto: ${activeMeeting.place}`), margin, startY + 25)
  
  // Add patient info
  doc.setFontSize(16)
  doc.text(removeDiacritics("Informace o pacientovi"), margin, startY + 40)
  doc.setFontSize(12)
  doc.text(removeDiacritics(`Jmeno: ${patient.name} ${patient.lastName}`), margin, startY + 50)
  doc.text(removeDiacritics(`Rodne cislo: ${patient.birthNumber}`), margin, startY + 60)
  doc.text(removeDiacritics(`Cislo pojistence: ${patient.insuranceId}`), margin, startY + 70)
  
  // Add epikríza if exists
  if (patient.epikriza) {
    doc.setFontSize(16)
    doc.text(removeDiacritics("Epikrize"), margin, startY + 90)
    doc.setFontSize(12)
    
    // Handle long text wrapping
    const splitEpikriza = doc.splitTextToSize(removeDiacritics(patient.epikriza), 170)
    doc.text(splitEpikriza, margin, startY + 100)
  }
  
  // Add participating doctors
  let yPos = startY + 120 // Position from bottom
  
  doc.setFontSize(16)
  doc.text(removeDiacritics("Ucastnici schuzky"), margin, yPos)
  doc.setFontSize(12)
  
  activeMeeting.doctors.forEach((doctor: Doctor, index: number) => {
    yPos += 10
    doc.text(removeDiacritics(`${doctor.firstname} ${doctor.surname} - ${doctor.specialization}`), margin, yPos)
  })
  
  // Add footer with date and page number
  const pageCount = doc.internal.pages.length
  doc.setFontSize(10)
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(
      removeDiacritics(`Vytvoreno: ${formatDate(new Date())} | Strana ${i} z ${pageCount}`),
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }
  
  // Download the PDF
  doc.save(removeDiacritics(`zapis-ze-schuzky-${formatDate(activeMeeting.date)}.pdf`))
}

// Helper function to format dates
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

// If you want to add a more detailed report with modalities
function addModalities(doc: jsPDF, modalities: any[], startY: number): number {
  let yPos = startY

  if (modalities && modalities.length > 0) {
    doc.setFontSize(16)
    doc.text("Vyšetření a výkony", 20, yPos)
    doc.setFontSize(12)
    
    modalities.forEach((mod, index) => {
      yPos += 15
      
      // Check if we need a new page
      if (yPos >= doc.internal.pageSize.height - 20) {
        doc.addPage()
        yPos = 20
      }
      
      doc.text(`${mod.type}`, 20, yPos)
      doc.text(`Datum: ${formatDate(mod.date)}`, 30, yPos + 5)
      doc.text(`Místo: ${mod.place}`, 30, yPos + 10)
      
      // Handle long results text
      const splitResults = doc.splitTextToSize(mod.results, 150)
      doc.text(splitResults, 30, yPos + 15)
      
      yPos += 20 + (splitResults.length * 5)
    })
  }
  
  return yPos
}

// Add these helper functions before downloadDetailedReport

function addBasicInfo(doc: jsPDF, yPos: number, activeMeeting: any): number {
  doc.setFontSize(14)
  doc.text(`Datum: ${formatDate(new Date())}`, 20, yPos)
  doc.text(`Místo: ${activeMeeting.place}`, 20, yPos + 10)
  return yPos + 20
}

function addPatientInfo(doc: jsPDF, yPos: number, patient: any): number {
  doc.setFontSize(16)
  doc.text("Informace o pacientovi", 20, yPos)
  doc.setFontSize(12)
  doc.text(`Jméno: ${patient.firstname} ${patient.surname}`, 20, yPos + 10)
  doc.text(`Rodné číslo: ${patient.birthNumber}`, 20, yPos + 20)
  doc.text(`Číslo pojištěnce: ${patient.insuranceId}`, 20, yPos + 30)
  return yPos + 40
}

function addQuestionsAndTasks(doc: jsPDF, yPos: number, patient: any): number {
  doc.setFontSize(16)
  doc.text("Otázky a úkoly", 20, yPos)
  doc.setFontSize(12)
  
  patient.questions.forEach((question: any) => {
    yPos += 15
    doc.text(question.question, 20, yPos)
    
    question.tasks?.forEach((task: any) => {
      yPos += 10
      doc.text(`- ${task.name}: ${task.description}`, 30, yPos)
    })
  })
  
  return yPos
}

function addFooter(doc: jsPDF) {
  const pageCount = doc.internal.pages.length
  doc.setFontSize(10)
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(
      `Vytvořeno: ${formatDate(new Date())} | Strana ${i} z ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }
}

// Enhanced version with more sections
function downloadDetailedReportUtils(activeMeeting: any, patient: any) {
  const template: PDFTemplate = {
    header: {
      title: "Rakaton - Detailní zápis ze schůzky"
    },
    content: {
      basicInfo: {
        date: formatDate(activeMeeting.date),
        place: activeMeeting.place
      },
      patientInfo: {
        name: `${patient.firstname} ${patient.surname}`,
        birthNumber: patient.birthNumber,
        insuranceId: patient.insuranceId
      },
      modalities: patient.modality?.map((mod: any) => ({
        type: mod.type,
        date: formatDate(mod.date),
        place: mod.place,
        results: mod.results
      })),
      questions: patient.questions?.map((q: any) => ({
        question: q.question,
        tasks: q.tasks?.map((t: any) => ({
          name: t.name,
          description: t.description
        }))
      })),
      doctors: activeMeeting.doctors.map((d: Doctor) => ({
        name: `${d.firstname} ${d.surname}`,
        specialization: d.specialization
      }))
    },
    footer: {
      createdAt: formatDate(new Date()),
      pageInfo: true
    }
  }

  const doc = createPDFFromTemplate(template)
  doc.save(`detailed-meeting-report-${formatDate(activeMeeting.date)}.pdf`)
}

function createPDFFromTemplate(template: PDFTemplate) {
  const doc = new jsPDF()
  let yPos = 20
  const margin = 20
  const pageHeight = doc.internal.pageSize.height
  const pageWidth = doc.internal.pageSize.width
  const maxWidth = pageWidth - (margin * 2)

  // Helper functions
  function addWrappedText(text: string, x: number, y: number, fontSize: number = 12) {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + (lines.length * (fontSize * 0.352))
  }

  function checkPageBreak(neededSpace: number = 40) {
    if (yPos + neededSpace >= pageHeight - margin) {
      doc.addPage()
      yPos = margin
      return true
    }
    return false
  }

  // Add Header
  doc.setFontSize(22)
  yPos = addWrappedText(template.header.title, margin, yPos, 22)

  // Add Basic Info
  checkPageBreak()
  yPos += 10
  doc.setFontSize(14)
  yPos = addWrappedText(`Datum: ${template.content.basicInfo.date}`, margin, yPos, 14)
  yPos = addWrappedText(`Místo: ${template.content.basicInfo.place}`, margin, yPos, 14)

  // Add Patient Info
  checkPageBreak()
  yPos += 10
  doc.setFontSize(16)
  yPos = addWrappedText("Informace o pacientovi", margin, yPos, 16)
  yPos = addWrappedText(`Jméno: ${template.content.patientInfo.name}`, margin, yPos)
  yPos = addWrappedText(`Rodné číslo: ${template.content.patientInfo.birthNumber}`, margin, yPos)
  yPos = addWrappedText(`Číslo pojištěnce: ${template.content.patientInfo.insuranceId}`, margin, yPos)

  // Add Modalities
  if (template.content.modalities?.length) {
    checkPageBreak()
    yPos += 10
    doc.setFontSize(16)
    yPos = addWrappedText("Vyšetření a výkony", margin, yPos, 16)
    
    template.content.modalities.forEach(modality => {
      checkPageBreak()
      yPos += 5
      doc.setFontSize(12)
      yPos = addWrappedText(modality.type, margin, yPos)
      yPos = addWrappedText(`Datum: ${modality.date}`, margin + 10, yPos)
      yPos = addWrappedText(`Místo: ${modality.place}`, margin + 10, yPos)
      yPos = addWrappedText(modality.results, margin + 10, yPos)
    })
  }

  // Add Questions
  if (template.content.questions?.length) {
    checkPageBreak()
    yPos += 10
    doc.setFontSize(16)
    yPos = addWrappedText("Otázky a úkoly", margin, yPos, 16)
    
    template.content.questions.forEach(question => {
      checkPageBreak()
      yPos += 5
      doc.setFontSize(12)
      yPos = addWrappedText(question.question, margin, yPos)
      
      question.tasks?.forEach(task => {
        yPos = addWrappedText(`- ${task.name}: ${task.description}`, margin + 10, yPos)
      })
    })
  }

  // Add Doctors
  checkPageBreak()
  yPos += 10
  doc.setFontSize(16)
  yPos = addWrappedText("Účastníci schůzky", margin, yPos, 16)
  
  template.content.doctors.forEach(doctor => {
    yPos = addWrappedText(`${doctor.name} - ${doctor.specialization}`, margin, yPos, 12)
  })

  // Add Footer
  const pageCount = doc.internal.pages.length
  doc.setFontSize(10)
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(
      `Vytvořeno: ${template.footer.createdAt} | Strana ${i} z ${pageCount}`,
      pageWidth / 2,
      pageHeight - margin,
      { align: 'center' }
    )
  }

  return doc
}

// You can expose both simple and detailed download options
// defineExpose({
//   downloadReportUtils,
//   downloadDetailedReportUtils
// })

export {
  downloadReportUtils,
  downloadDetailedReportUtils
}