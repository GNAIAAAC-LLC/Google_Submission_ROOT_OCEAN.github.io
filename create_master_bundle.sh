#!/bin/bash
# File: create_master_bundle.sh
# Purpose: Automate creation of GNAIAAAC Master Bundle for GitHub pre-release

# --- Configuration ---
LOCAL_REPO_PATH="$HOME/path/to/Google_Submission_ROOT_OCEAN"  # Update this to your local repo path
BUNDLE_DIR="$LOCAL_REPO_PATH/GNAIAAAC_Master_Bundle"

# Paths to source files (update if needed)
PDF_FILE="$LOCAL_REPO_PATH/GNAIAAAC_MASTER_ROOT.pdf"
DOCX_FILE="$LOCAL_REPO_PATH/ROOT_OCEAN_MASTER.docx"
XLSX_FILE="$LOCAL_REPO_PATH/GNAIAAAC_Budget.xlsx"
PPTX_FILE="$LOCAL_REPO_PATH/GNAIAAAC_Executive_Deck.pptx"
PY_FILE="$LOCAL_REPO_PATH/scripts/generate_reports.py"

# --- Script ---
echo "Creating GNAIAAAC_Master_Bundle folder..."
mkdir -p "$BUNDLE_DIR"

echo "Copying files into Master Bundle..."
cp "$PDF_FILE" "$BUNDLE_DIR/"
cp "$DOCX_FILE" "$BUNDLE_DIR/"
cp "$XLSX_FILE" "$BUNDLE_DIR/"
cp "$PPTX_FILE" "$BUNDLE_DIR/"
cp "$PY_FILE" "$BUNDLE_DIR/"

echo "Master Bundle prepared at $BUNDLE_DIR"

# Optional: Commit and push changes
cd "$LOCAL_REPO_PATH" || exit
git add GNAIAAAC_Master_Bundle
git commit -m "Prepare GNAIAAAC Master Bundle for pre-release"
git push

echo "Done! You can now create a GitHub pre-release at:"
echo "https://github.com/GNAIAAAC-LLC/Google_Submission_ROOT_OCEAN/releases/new"