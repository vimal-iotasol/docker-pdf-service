// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');
const cors = require('cors');
const ejs = require('ejs');
const { PDFDocument } = require('pdf-lib');
const { BlobServiceClient } = require('@azure/storage-blob');

const logger = require('./logger');
const morgan = require('morgan');
const { createRank, PERSONALITY_TYPE_INFO, personalityTypeColors, capitalizeChartsDataKeys } = require('./utils');
const { chartData, charts, rankResult, behaviours, minimumScoreAttributes, reportAddition, userDetail, barChart } = require('./utils/dummyData');

const app = express();
const port = 3000;
const hostname = 'localhost';
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// ───── HTTP & middleware ─────
app.use(cors());

// Request logging – only errors & non‑2xx responses
app.use(
  morgan('combined', {
    stream: logger.stream,
    skip: (req, res) => res.statusCode < 400
  })
);

app.use(
  bodyParser.json({
    limit: '10mb'   // keep the same payload limit
  })
);

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/logs', express.static(path.join(__dirname, 'logs')));

// ───── Basic health‐check ─────
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'PDF service is running'
  });
});

const generateHtml  = async (
  ChartData,Charts,associationData,userDetails,rankResult,PERSONALITY_TYPE_INFO,behaviours,minimumScoreAttributes,reportAddition,personalityTypeColors
) => {
  const html = await ejs.renderFile(
    path.join(__dirname, 'templates', 'panPersona.ejs'),  
    {
      chartData: ChartData,
      chartsJSON: JSON.stringify(Charts),
      associationData: associationData.sort((a,b) => b.Value - a.Value),
      userDetails,
      rankResult,
      PERSONALITY_TYPE_INFO,
      behaviours,
      minimumScoreAttributes,
      reportAddition,
      personalityTypeColors
    })
    return html
}

// ───── Azure Blob uploader ─────
async function uploadFileToBlobAsync(fileName, fileData, fileMimeType) {
  try {
    // Check if connection string exists
    if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
      logger.error('Azure Storage connection string is not defined');
      throw new Error('Azure Storage connection string is not defined');
    }
    
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    const containerName = process.env.CONTAINER_NAME || 'pdf-reports';
    const containerClient = blobServiceClient.getContainerClient(containerName);

    await containerClient.createIfNotExists({
      access: 'blob'   // Blob‑level public access
    });

    const blobName = `${fileName}.pdf`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(fileData, fileData.length, {
      blobHTTPHeaders: {
        blobContentType: fileMimeType
      }
    });

    logger.info('Uploaded blob', { blobUrl: blockBlobClient.url });

    return blockBlobClient.url;
  } catch (error) {
    logger.error('Blob upload failed', { error: error.stack || error });
    throw error;
  }
}

app.get('/panPersona', async (req, res) => {
  const htmlContent = await generateHtml(
    chartData,charts,barChart,userDetail,rankResult,PERSONALITY_TYPE_INFO,behaviours,minimumScoreAttributes,reportAddition,personalityTypeColors
  );
  res.send(htmlContent);
});

app.post('/create-pdf', async (req, res) => {
  logger.debug('PDF generation request received', { body: req.body });
  // Validate request
  // if (!req.body || !req.body.content || !req.body.fileName) {
  //   logger.warn('Bad request – missing content or fileName', { body: req.body });
  //   return res.status(400).json({
  //     status: 'error',
  //     message: 'Missing required fields: content and fileName'
  //   });
  // }

  const { content, fileName="personality-report.pdf", upload = true } = req.body;

  let htmlContent = await generateHtml(
      chartData,charts,barChart,userDetail,rankResult,PERSONALITY_TYPE_INFO,behaviours,minimumScoreAttributes,reportAddition,personalityTypeColors
  );


  // ───── Load all required SVG‑/PNG assets as data URIs ─────
  const imageMap = {
    footerImg: { path: 'assets/footerImg.svg', type: 'svg+xml' },
    logo: { path: 'assets/logo.png', type: 'png' },
    progress1: { path: 'assets/progress1.svg', type: 'svg+xml' },
    progress2: { path: 'assets/progress2.svg', type: 'svg+xml' },
    progress3: { path: 'assets/progress3.svg', type: 'svg+xml' },
    progress4: { path: 'assets/progress4.svg', type: 'svg+xml' },
    reportBg: { path: 'assets/report-bg.svg', type: 'svg+xml' },
    reportLockIcon: { path: 'assets/reportLockIcon.svg', type: 'svg+xml' },
    reportRightIcon: { path: 'assets/reportRightIcon.svg', type: 'svg+xml' },
    listIcon: { path: 'assets/listIcon.svg', type: 'svg+xml' },
    panPersona: {
      path: `assets/${upload ? 'panPersona' : 'clientClassification'}.svg`,
      type: 'svg+xml'
    }
  };

  const dataUris = {};
  try {
    for (const [key, { path: imgPath, type }] of Object.entries(imageMap)) {
      const buffer = fs.readFileSync(imgPath);
      const base64 = buffer.toString('base64');
      dataUris[key] = `data:image/${type};base64,${base64}`;
    }
  } catch (imgErr) {
    logger.error('Error reading image assets', { error: imgErr.stack || imgErr });
    return res.status(500).send('Server error while loading assets');
  }

  // Replace placeholders in HTML
  const replacements = {
    logoDataUri: dataUris.logo,
    progress1Uri: dataUris.progress1,
    progress2Uri: dataUris.progress2,
    progress3Uri: dataUris.progress3,
    progress4Uri: dataUris.progress4,
    reportBgUri: dataUris.reportBg,
    reportLockIconUri: dataUris.reportLockIcon,
    reportRightIconUri: dataUris.reportRightIcon,
    listIconUri: dataUris.listIcon
  };  

  for (const [placeholder, uri] of Object.entries(replacements)) {
    htmlContent = htmlContent.replace(
      new RegExp(placeholder, 'g'),
      uri
    );
  }

  // Header / Footer
  const headerHtml = `
    <style>
      .header { max-width: 794px; width: 100%; margin:0 auto; background:#fff; color:#333; }
      .conclusion-wrapper{padding:0 3vw;}
      .header-flex{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #00000029;}
      .header-title{width:45%;color:#1D3559;font-family:"Montserrat",sans-serif!important;font-size:16px;}
      .main-page-logo{max-width:188px;width:30%;margin-bottom:5px;}
      .main-page-logo img{width:100%;}
    </style>
    <div class="header"><div class="conclusion-wrapper"><div class="header-flex">
      <div class="header-title"><img style="width:45%" src="${dataUris.panPersona}" alt="Logo"/></div>
      <div class="main-page-logo"><img src="${dataUris.logo}" alt="Logo"/></div>
    </div></div></div>
  `;

  const footerHtml = `
    <style>
     .footer-wrapper{width:100%;text-align:center;position:fixed;bottom:0;left:0;right:0;line-height:0;}
     .footer-wrapper img{max-height:20px;width:auto;display:block;margin:0 auto;}
    </style>
    <div class="footer-wrapper"><img src="${dataUris.footerImg}" style="max-height:20px;"/></div>
  `;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      // executablePath: process.env.CHROME_BIN || puppeteer.executablePath()
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1240, height: 1754 });
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    // await page.setContent(htmlContent, { waitUntil: 'load', timeout: 60000 });
    // await page.goto("http://localhost:8000/panPersona", { waitUntil: 'load', timeout: 60000 });

    // Wait for the page to be fully rendered (DOM ready)
    await page.waitForSelector('body', { timeout: 20000 });

    // Get number of pages
    const pageCount = await page.evaluate(() => {
      const bodyHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;
      return Math.ceil(bodyHeight / viewportHeight);
    });

    const pdfOptionsBase = {
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: !!upload // if `upload=true` we skip header/footer on first page
    };

    // If user requested only the first page (upload=true), we only render page 1
    const pdfOptions = upload
      ? { ...pdfOptionsBase, pageRanges: '1' }
      : {
          ...pdfOptionsBase,
          headerTemplate: headerHtml,
          footerTemplate: footerHtml,
          margin: { top: '70px', bottom: '70px', left: '0px' }
        };

    const firstPagePdf = await page.pdf(pdfOptions);

    // if (pageCount <= 1) {
    //   await browser.close();
    //   if (!upload) {
    //     const blobUrl = await uploadFileToBlobAsync(
    //       "personality-report",
    //       Buffer.from(firstPagePdf),
    //       'application/pdf'
    //     );
    //     return res.status(200).json({
    //       status: 'success',
    //       data: { pdfUrl: blobUrl },
    //       message: 'PDF generated and uploaded successfully.'
    //     });
    //   } else {
    //     res.set({
    //       'Content-Type': 'application/pdf',
    //       'Content-Disposition': `inline; filename=personality-report.pdf"`
    //     });
    //     return res.send(Buffer.from(firstPagePdf));
    //   }
    // }

    // Render remaining pages, header/footer included
    const remainingPagesPdf = await page.pdf({
      ...pdfOptions,
      pageRanges: '2-',
      displayHeaderFooter: true,
      headerTemplate: headerHtml,
      footerTemplate: footerHtml,
      margin: { top: '70px', bottom: '70px', left: '0px' }
    });

    await browser.close();

    // Merge PDFs with pdf-lib
    const mergedPdf = await PDFDocument.create();
    const firstDoc = await PDFDocument.load(firstPagePdf);
    mergedPdf.addPage(...await mergedPdf.copyPages(firstDoc, [0]));

    if (remainingPagesPdf.length > 0) {
      const remDoc = await PDFDocument.load(remainingPagesPdf);
      const remPages = remDoc.getPageCount();
      for (let i = 0; i < remPages; i++) {
        mergedPdf.addPage(...await mergedPdf.copyPages(remDoc, [i]));
      }
    }

    const mergedPdfBytes = await mergedPdf.save();

    // if (upload) {
    //   const blobUrl = await uploadFileToBlobAsync(
    //     "personality-report",
    //     Buffer.from(mergedPdfBytes),
    //     'application/pdf'
    //   );
    //   return res.status(200).json({
    //     status: 'success',
    //     data: { pdfUrl: blobUrl },
    //     message: 'PDF generated and uploaded successfully.'
    //   });
    // } else {
    //   res.set({
    //     'Content-Type': 'application/pdf',
    //     'Content-Disposition': `inline; filename="personality-report.pdf"`
    //   });
    //   return res.send(Buffer.from(mergedPdfBytes));
    // }
    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="personality-report.pdf"`
      });
      return res.send(Buffer.from(mergedPdfBytes));
  } catch (err) {
    logger.error('Error generating PDF', { error: err.stack || err });
    res.status(500).send('Failed to generate PDF');
  }
});

// ───── Main PDF generation endpoint ─────
app.post('/generate-pdf', async (req, res) => {
  logger.debug('PDF generation request received', { body: req.body });

  // Validate request
  if (!req.body || !req.body.content || !req.body.fileName) {
    logger.warn('Bad request – missing content or fileName', { body: req.body });
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields: content and fileName'
    });
  }

  const { content, fileName, upload } = req.body;

  const { MinimumScoreAttributes,BarChart,RadialChart,Behaviours,UserDetail,ReportAddition } = content;

  const {ChartData,Charts} = RadialChart;
  const RankResult = createRank(BarChart);

  // ───── Load all required SVG‑/PNG assets as data URIs ─────
  const imageMap = {
    footerImg: { path: 'assets/footerImg.svg', type: 'svg+xml' },
    logo: { path: 'assets/logo.png', type: 'png' },
    progress1: { path: 'assets/progress1.svg', type: 'svg+xml' },
    progress2: { path: 'assets/progress2.svg', type: 'svg+xml' },
    progress3: { path: 'assets/progress3.svg', type: 'svg+xml' },
    progress4: { path: 'assets/progress4.svg', type: 'svg+xml' },
    reportBg: { path: 'assets/report-bg.svg', type: 'svg+xml' },
    reportLockIcon: { path: 'assets/reportLockIcon.svg', type: 'svg+xml' },
    reportRightIcon: { path: 'assets/reportRightIcon.svg', type: 'svg+xml' },
    listIcon: { path: 'assets/listIcon.svg', type: 'svg+xml' },
    panPersona: {
      path: `assets/${upload ? 'panPersona' : 'clientClassification'}.svg`,
      type: 'svg+xml'
    }
  };

  const dataUris = {};
  try {
    for (const [key, { path: imgPath, type }] of Object.entries(imageMap)) {
      const buffer = fs.readFileSync(imgPath);
      const base64 = buffer.toString('base64');
      dataUris[key] = `data:image/${type};base64,${base64}`;
    }
  } catch (imgErr) {
    logger.error('Error reading image assets', { error: imgErr.stack || imgErr });
    return res.status(500).send('Server error while loading assets');
  }

  // Replace placeholders in HTML
  const replacements = {
    logoDataUri: dataUris.logo,
    progress1Uri: dataUris.progress1,
    progress2Uri: dataUris.progress2,
    progress3Uri: dataUris.progress3,
    progress4Uri: dataUris.progress4,
    reportBgUri: dataUris.reportBg,
    reportLockIconUri: dataUris.reportLockIcon,
    reportRightIconUri: dataUris.reportRightIcon,
    listIconUri: dataUris.listIcon
  };
  
  const capitalizedCharts = capitalizeChartsDataKeys(Charts);

  let htmlContent = await generateHtml(
      ChartData,capitalizedCharts,BarChart,UserDetail,RankResult,PERSONALITY_TYPE_INFO,Behaviours,MinimumScoreAttributes,ReportAddition,personalityTypeColors
  );

  for (const [placeholder, uri] of Object.entries(replacements)) {
    htmlContent = htmlContent.replace(
      new RegExp(placeholder, 'g'),
      uri
    );
  }

  // Header / Footer
  const headerHtml = `
    <style>
      .header { max-width: 794px; width: 100%; margin:0 auto; background:#fff; color:#333; }
      .conclusion-wrapper{padding:0 3vw;}
      .header-flex{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #00000029;}
      .header-title{width:45%;color:#1D3559;font-family:"Montserrat",sans-serif!important;font-size:16px;}
      .main-page-logo{max-width:188px;width:30%;margin-bottom:5px;}
      .main-page-logo img{width:100%;}
    </style>
    <div class="header"><div class="conclusion-wrapper"><div class="header-flex">
      <div class="header-title"><img style="width:45%" src="${dataUris.panPersona}" alt="Logo"/></div>
      <div class="main-page-logo"><img src="${dataUris.logo}" alt="Logo"/></div>
    </div></div></div>
  `;

  const footerHtml = `
    <style>
     .footer-wrapper{width:100%;text-align:center;position:fixed;bottom:0;left:0;right:0;line-height:0;}
     .footer-wrapper img{max-height:20px;width:auto;display:block;margin:0 auto;}
    </style>
    <div class="footer-wrapper"><img src="${dataUris.footerImg}" style="max-height:20px;"/></div>
  `;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.CHROME_BIN || puppeteer.executablePath()
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1240, height: 1754 });
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    // await page.setContent(htmlContent, { waitUntil: 'load', timeout: 60000 });


    // Ensure all images are fully loaded
    await page.evaluate(async () => {
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map(
          img =>
            new Promise((res, rej) => {
              img.complete ? res() : (img.onload = res);
              img.onerror = rej;
            })
        )
      );
    });

    // Wait for the page to be fully rendered (DOM ready)
    await page.waitForSelector('body', { timeout: 20000 });

    // Get number of pages
    const pageCount = await page.evaluate(() => {
      const bodyHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;
      return Math.ceil(bodyHeight / viewportHeight);
    });

    const pdfOptionsBase = {
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: !!upload // if `upload=true` we skip header/footer on first page
    };

    // If user requested only the first page (upload=true), we only render page 1
    const pdfOptions = upload
      ? { ...pdfOptionsBase, pageRanges: '1' }
      : {
          ...pdfOptionsBase,
          headerTemplate: headerHtml,
          footerTemplate: footerHtml,
          margin: { top: '70px', bottom: '70px', left: '0px' }
        };

    const firstPagePdf = await page.pdf(pdfOptions);

    if (pageCount <= 1) {
      await browser.close();
      if (upload) {
        const blobUrl = await uploadFileToBlobAsync(
          fileName,
          Buffer.from(firstPagePdf),
          'application/pdf'
        );
        return res.status(200).json({
          status: 'success',
          data: { pdfUrl: blobUrl },
          message: 'PDF generated and uploaded successfully.'
        });
      } else {
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${fileName}.pdf"`
        });
        return res.send(Buffer.from(firstPagePdf));
      }
    }

    // Render remaining pages, header/footer included
    const remainingPagesPdf = await page.pdf({
      ...pdfOptions,
      pageRanges: '2-',
      displayHeaderFooter: true,
      headerTemplate: headerHtml,
      footerTemplate: footerHtml,
      margin: { top: '70px', bottom: '70px', left: '0px' }
    });

    await browser.close();

    // Merge PDFs with pdf-lib
    const mergedPdf = await PDFDocument.create();
    const firstDoc = await PDFDocument.load(firstPagePdf);
    mergedPdf.addPage(...await mergedPdf.copyPages(firstDoc, [0]));

    if (remainingPagesPdf.length > 0) {
      const remDoc = await PDFDocument.load(remainingPagesPdf);
      const remPages = remDoc.getPageCount();
      for (let i = 0; i < remPages; i++) {
        mergedPdf.addPage(...await mergedPdf.copyPages(remDoc, [i]));
      }
    }

    const mergedPdfBytes = await mergedPdf.save();

    if (upload) {
      const blobUrl = await uploadFileToBlobAsync(
        fileName,
        Buffer.from(mergedPdfBytes),
        'application/pdf'
      );
      return res.status(200).json({
        status: 'success',
        data: { pdfUrl: blobUrl },
        message: 'PDF generated and uploaded successfully.'
      });
    } else {
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}.pdf"`
      });
      return res.send(Buffer.from(mergedPdfBytes));
    }
  } catch (err) {
    logger.error('Error generating PDF', { error: err.stack || err });
    res.status(500).send('Failed to generate PDF');
  }
});

// ───── Generic error handler ─────
app.use((err, req, res, next) => {
  logger.error('Unhandled Express error', { error: err.stack || err });
  res.status(500).send('Internal Server Error');
});

// ───── Server start ─────
app.listen(port, () => {
  logger.info(`PDF service listening at http://${hostname}:${port}`);
});

// ───── Global uncaught errors ─────
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { promise, reason: reason.stack || reason });
});
process.on('uncaughtException', err => {
  logger.error('Uncaught Exception', { error: err.stack || err });
});