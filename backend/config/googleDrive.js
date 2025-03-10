const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

// Create credentials object from environment variables
const credentials = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`,
  universe_domain: "googleapis.com"
};

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

// Create drive instance
const drive = google.drive({ version: "v3", auth });

// Helper function to extract file ID from Google Drive URL
function extractFileId(url) {
  try {
    // Handle different Google Drive URL formats
    const patterns = [
      /\/file\/d\/([^/]+)/,  // Format: /file/d/{fileId}/
      /id=([^&]+)/,          // Format: ?id={fileId}
      /folders\/([^?/]+)/    // Format: /folders/{fileId}
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    throw new Error("Could not extract file ID from URL");
  } catch (error) {
    throw new Error(`Invalid Google Drive URL format: ${error.message}`);
  }
}

async function uploadToGoogleDrive(filePath, fileName) {
  try {
    console.log("🔄 Authenticating Google Drive...");

    const mimeType = mime.lookup(filePath) || "application/octet-stream";

    const fileMetadata = {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // 🔹 Replace with your actual Google Drive Folder ID
    };

    const media = {
      mimeType: mimeType,
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink, webContentLink",
    });

    // Set public read permission
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    console.log("✅ File uploaded successfully:", response.data.id);
    return response.data.webViewLink; // Return the Google Drive file URL
  } catch (error) {
    console.error("❌ Error uploading file to Google Drive:", error.message);
    throw new Error("Google Drive upload failed");
  }
}

async function deleteFromGoogleDrive(fileIdOrUrl) {
  try {
    console.log("🔄 Initializing file deletion...");
    
    // Extract file ID if a URL is provided
    const fileId = fileIdOrUrl.includes('drive.google.com') 
      ? extractFileId(fileIdOrUrl)
      : fileIdOrUrl;

    // Verify file exists before attempting deletion
    try {
      await drive.files.get({
        fileId: fileId,
        fields: 'id'
      });
    } catch (error) {
      if (error.code === 404) {
        console.warn("⚠️ File already deleted or not found:", fileId);
        return true;
      }
      throw error;
    }

    // Delete the file
    await drive.files.delete({
      fileId: fileId,
    });
    
    console.log("✅ File deleted successfully:", fileId);
    return true;
  } catch (error) {
    console.error("❌ Error deleting file from Google Drive:", error);
    throw new Error(`Failed to delete file from Google Drive: ${error.message}`);
  }
}

module.exports = {
  uploadToGoogleDrive,
  deleteFromGoogleDrive
};
