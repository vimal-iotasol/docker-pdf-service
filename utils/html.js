// settings for header and footer html
const HeaderHtml = (dataUris) => {
  return `
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
};

const FooterHtml = (dataUris) => {
  return `
    <style>
      .footer-wrapper{width:100%;text-align:center;position:fixed;bottom:0;left:0;right:0;line-height:0;}
      .footer-wrapper img{max-height:20px;width:auto;display:block;margin:0 auto;}
    </style>
    <div class="footer-wrapper"><img src="${dataUris.footerImg}" style="max-height:20px;"/></div>
  `;
};

module.exports = { HeaderHtml, FooterHtml };
