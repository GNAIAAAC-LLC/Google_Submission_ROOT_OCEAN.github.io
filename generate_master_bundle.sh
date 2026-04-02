#!/bin/bash
# Bash script to generate the full GNAIAAAC Master Bundle

# Ensure Python packages are installed
pip install --upgrade fpdf python-docx openpyxl python-pptx

# Run the Python generator
python3 scripts/generate_master_bundle.py
echo "Master Bundle is ready in GNAIAAAC_Master_Bundle/"
./generate_master_bundle.sh