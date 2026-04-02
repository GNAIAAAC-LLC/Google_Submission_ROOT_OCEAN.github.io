#!/usr/bin/env python3
"""
Master Bundle Generator
Generates:
- PDF report
- DOCX master
- Excel budget
- PPTX executive deck
"""

from pathlib import Path
from fpdf import FPDF
from docx import Document
import openpyxl
from pptx import Presentation

# Output folder (can be root or "output")
OUTPUT_DIR = Path("GNAIAAAC_Master_Bundle")
OUTPUT_DIR.mkdir(exist_ok=True)

PDF_FILE = OUTPUT_DIR / "GNAIAAAC_MASTER_ROOT.pdf"
DOCX_FILE = OUTPUT_DIR / "ROOT_OCEAN_MASTER.docx"
EXCEL_FILE = OUTPUT_DIR / "GNAIAAAC_Budget.xlsx"
PPTX_FILE = OUTPUT_DIR / "GNAIAAAC_Executive_Deck.pptx"

def generate_pdf():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "GNAIAAAC ROOT OCEAN / PURE WATER MASTER REPORT", ln=True, align="C")
    pdf.ln(10)
    pdf.set_font("Arial", "", 12)
    pdf.multi_cell(0, 8, "Full technical documentation, AI simulations, visualizations, and analysis.")
    pdf.output(str(PDF_FILE))
    print(f"PDF generated: {PDF_FILE}")

def generate_docx():
    doc = Document()
    doc.add_heading("ROOT OCEAN MASTER DOCUMENT", level=0)
    doc.add_paragraph("Master document with all notes, references, and technical explanations.")
    doc.save(DOCX_FILE)
    print(f"DOCX generated: {DOCX_FILE}")

def generate_excel():
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Budget Plan"
    ws.append(["Item", "Description", "Estimated Cost (USD)"])
    ws.append(["Water Sensors", "AI monitoring sensors", 5000])
    ws.append(["Software Licenses", "AI tools", 2000])
    ws.append(["Consulting / Staff", "Remote technical experts", 3000])
    wb.save(EXCEL_FILE)
    print(f"Excel generated: {EXCEL_FILE}")

def generate_pptx():
    prs = Presentation()
    slide_layout = prs.slide_layouts[0]
    slide = prs.slides.add_slide(slide_layout)
    slide.shapes.title.text = "GNAIAAAC Root Ocean / Pure Water"
    slide.placeholders[1].text = "Executive Pitch Deck"

    slide_layout = prs.slide_layouts[1]
    slide = prs.slides.add_slide(slide_layout)
    slide.shapes.title.text = "Project Overview"
    slide.placeholders[1].text = "AI-driven simulations, visualizations, automated workflows."

    prs.save(PPTX_FILE)
    print(f"PPTX generated: {PPTX_FILE}")

if __name__ == "__main__":
    generate_pdf()
    generate_docx()
    generate_excel()
    generate_pptx()
    print("\nAll files generated successfully!")
    chmod +x generate_master_bundle.sh