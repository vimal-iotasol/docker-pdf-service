const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const fs = require("fs");
const cors = require("cors");
const { PDFDocument } = require("pdf-lib");


const app = express();
const port = 3000;
const hostname = "panalitix-rpt.azurewebsites.net";
// const hostname = "localhost";

const { BlobServiceClient } = require('@azure/storage-blob');

// Add this function to generate a unique filename
function generateFileName(originalName) {
    const timestamp = new Date().getTime();
    const extension = originalName.split('.').pop();
    return `${originalName}_${timestamp}_${Math.random().toString(36).substring(7)}.${extension}`;
}

// Add the upload function
async function uploadFileToBlobAsync(fileName, fileData, fileMimeType) {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        const containerName = process.env.CONTAINER_NAME;
        const containerClient = blobServiceClient.getContainerClient(containerName);
        
        // Create container if it doesn't exist
        await containerClient.createIfNotExists({
            access: 'blob' // This is equivalent to Blob level public access
        });

        const blobName = generateFileName(fileName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        
        // Upload the file
        await blockBlobClient.upload(fileData, fileData.length, {
            blobHTTPHeaders: {
                blobContentType: fileMimeType
            }
        });

        return blockBlobClient.url;
    } catch (error) {
        console.error('Error uploading to blob storage:', error);
        throw error;
    }
}

app.use(cors());
app.use(bodyParser.text({ 
  type: '*/*',
  limit: '10mb'  // Increase payload limit
}));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Add basic GET endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "PDF service is running"
  });
});

app.post("/generate-pdf", async (req, res) => {
  const imageMap = {
    'footerImg': { path: '/app/assets/footerImg.svg', type: 'svg+xml' },
    'logo': { path: '/app/assets/logo.png', type: 'png' },
    'progress1': { path: '/app/assets/progress1.svg', type: 'svg+xml' },
    'progress2': { path: '/app/assets/progress2.svg', type: 'svg+xml' },
    'progress3': { path: '/app/assets/progress3.svg', type: 'svg+xml' },
    'progress4': { path: '/app/assets/progress4.svg', type: 'svg+xml' },
    'reportBg': { path: '/app/assets/report-bg.svg', type: 'svg+xml' },
    'reportLockIcon': { path: '/app/assets/reportLockIcon.svg', type: 'svg+xml' },
    'reportRightIcon': { path: '/app/assets/reportRightIcon.svg', type: 'svg+xml' },
    'listIcon': { path: '/app/assets/listIcon.svg', type: 'svg+xml' }
  };

  const dataUris = {};
  for (const [key, { path, type }] of Object.entries(imageMap)) {
    const buffer = fs.readFileSync(path);
    const base64 = buffer.toString("base64");
    dataUris[key] = `data:image/${type};base64,${base64}`;
  }

  let htmlContent = req.body;
  
  // Replace all image references in one pass
  const replacements = {
    'logoDataUri': dataUris.logo,
    'progress1Uri': dataUris.progress1,
    'progress2Uri': dataUris.progress2,
    'progress3Uri': dataUris.progress3,
    'progress4Uri': dataUris.progress4,
    'reportBgUri': dataUris.reportBg,
    'reportLockIconUri': dataUris.reportLockIcon,
    'reportRightIconUri': dataUris.reportRightIcon,
    'listIconUri': dataUris.listIcon
  };

  for (const [placeholder, uri] of Object.entries(replacements)) {
    htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), uri);
  }
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: process.env.CHROME_BIN || puppeteer.executablePath()
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1240, height: 1754 });
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Wait for all images to load
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images.map((img) => {
          if (img.complete) return;
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
        })
      );
    });

    // Get the total number of pages by checking height
    const pageCount = await page.evaluate(() => {
      const bodyHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;
      return Math.ceil(bodyHeight / viewportHeight);
    });

    // Generate first page without header/footer
    const firstPagePdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: false,
      pageRanges: "1",
    });

    // If there's only one page, just return that
    if (pageCount <= 1) {
      await browser.close();
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="output.pdf"',
      });
      res.send(firstPagePdf);
      return;
    }
    const fontBase64 = fs.readFileSync('/app/assets/montserrat-regular.woff2', 'base64');
    
    // Generate remaining pages with header/footer
    const headerHtml = `
        <style>
          @font-face {
            font-family: 'Montserrat';
            src: url(data:font/woff2;base64,${fontBase64}) format('woff2');
            font-weight: normal;
            font-style: normal;
          }
          .header {
            max-width: 794px;
            width: 100%;
            margin: 0 auto;
            background-color: #fff;
            color: #333;
          }
          .conclusion-wrapper {
            padding: 0vw 3vw;
          }
          .conclusion-wrapper .header-flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #00000029;
          }
          .header-title {
            color: #1D3559;
            font-family: "Montserrat", sans-serif !important;
            font-size: 16px;
          }
          .main-page-logo {
            max-width: 188px;
            width: 30%;
            margin-bottom: 5px;
          }
          .main-page-logo img {
            width: 100%;
          }
        </style>
        <div class="header">
          <div class="conclusion-wrapper">
            <div class="header-flex">
              <div class="header-title" style="font-family: "Montserrat", sans-serif !important;">PanPersona Report</div>
              <div class="main-page-logo">
                <img src="${dataUris.logo}" alt="Logo" />
              </div>
            </div>
          </div>
        </div>
      `;

    
    const footerHtml = `
    <style>
      .footer-wrapper {
        width: 100%;
        text-align: center;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        line-height: 0;
      }
      .footer-wrapper img {
        max-height: 20px;
        width: auto;
        display: block;
        margin: 0 auto;      }
    </style>
    <div class="footer-wrapper"><img src="${dataUris.footerImg}" style="max-height: 20px; width: auto;bottom: 0;"/></div>
    `;
    
    const remainingPagesPdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: headerHtml,
      footerTemplate: footerHtml,
      pageRanges: "2-",
      margin: {
        top: "70px",
        bottom: "70px",
        left: "0px"
      },
    });

    await browser.close();

    // Merge PDFs using pdf-lib

    const mergedPdf = await PDFDocument.create();

    // Add first page
    const firstPageDoc = await PDFDocument.load(firstPagePdf);
    const [firstPage] = await mergedPdf.copyPages(firstPageDoc, [0]);
    mergedPdf.addPage(firstPage);

    // Add remaining pages
    if (remainingPagesPdf.length > 0) {
      const remainingPagesDoc = await PDFDocument.load(remainingPagesPdf);
      const pageCount = remainingPagesDoc.getPageCount();

      for (let i = 0; i < pageCount; i++) {
        const [copiedPage] = await mergedPdf.copyPages(remainingPagesDoc, [i]);
        mergedPdf.addPage(copiedPage);
      }
    }

    const mergedPdfBytes = await mergedPdf.save();

    // Upload PDF to blob storage
    const blobUrl = await uploadFileToBlobAsync(
        'Personality-Test.pdf',
        Buffer.from(mergedPdfBytes),
        'application/pdf'
    );

    res.status(200).json({
      status: "success",
      data: {
        pdfUrl: blobUrl
      },
      message: "PDF generated and uploaded successfully."
    });

  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Failed to generate PDF");
  }
});
app.listen(port, () => {
  console.log(`PDF service listening at http://${hostname}:${port}`);
});
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});