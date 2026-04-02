import os
import pandas as pd
from docx import Document
from jinja2 import Template
import matplotlib.pyplot as plt
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# 1. Configuration - Uses Environment Variables for GitHub/Vercel Security
GOOGLE_SERVICE_ACCOUNT_JSON = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
DRIVE_FOLDER_ID = os.getenv("GOOGLE_DRIVE_FOLDER_ID") # The ID of your 'ROOT_OCEAN' folder

def generate_report(data_dict, output_file):
    """Creates a professional .docx report using python-docx."""
    doc = Document()
    doc.add_heading('GNAIAAAC LLC - Project Root Ocean Claim', 0)
    
    # Add data from Pandas
    df = pd.DataFrame(data_dict)
    doc.add_paragraph(f"Report Data Summary:\n{df.describe()}")
    
    # Simple Matplotlib plot
    plt.figure(figsize=(5, 3))
    plt.plot(df['id'], df['value'])
    plt.title("Ocean Metric Trends")
    plt.savefig("trend.png")
    
    doc.add_picture("trend.png")
    doc.save(output_file)
    print(f"Successfully generated {output_file}")

def upload_to_drive(file_path, folder_id):
    """Uploads the generated file to Google Drive using Service Account."""
    if not GOOGLE_SERVICE_ACCOUNT_JSON:
        print("Error: Google Credentials not found in environment.")
        return

    # Authenticate
    import json
    info = json.loads(GOOGLE_SERVICE_ACCOUNT_JSON)
    creds = service_account.Credentials.from_service_account_info(info)
    service = build('drive', 'v3', credentials=creds)

    file_metadata = {
        'name': os.path.basename(file_path),
        'parents': [folder_id] if folder_id else []
    }
    media = MediaFileUpload(file_path, resumable=True)
    
    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    print(f"File uploaded to Drive. File ID: {file.get('id')}")

if __name__ == "__main__":
    # Sample Data for ssgpt6.com submission
    sample_data = {
        "id": [1, 2, 3, 4],
        "value": [10, 25, 13, 40]
    }
    
    filename = "Root_Ocean_Claim_Report.docx"
    
    # Execute steps
    generate_report(sample_data, filename)
    upload_to_drive(filename, DRIVE_FOLDER_ID)
