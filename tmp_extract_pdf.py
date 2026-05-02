from pathlib import Path
import sys

pdf_path = Path('d:/RA2311003020010/imp.pdf')
try:
    import PyPDF2
except ImportError:
    print('NO_PYPDF2')
    sys.exit(0)

reader = PyPDF2.PdfReader(str(pdf_path))
print('PAGES', len(reader.pages))
for i, page in enumerate(reader.pages):
    print(f'--- PAGE {i+1} ---')
    print(page.extract_text())
