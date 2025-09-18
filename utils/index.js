const PERSONALITY_TYPE_LABELS = {
  Minders: "Minder (sometimes referred to as 'Manager')",
  Finders: "Finder (sometimes referred to as 'Entrepreneur')",
  Grinders: "Grinder (sometimes referred to as 'Technician')"
};

const PERSONALITY_TYPE_INFO = {
  Minder: "excels in managerial roles where they help individuals and teams succeed through effective systems, processes, methods, automation and clear communication.",
  Finder: "excels in roles which require advanced interpersonal and communication skills, like marketing, sales, client management, business development etc.",
  Grinder: "excels in roles where they can efficiently and accurately complete a range of important tasks on time without distraction."
};

const personalityTypeColors = {
  Finder: "#91d8f7",
  Minder: "#94829C",
  Grinder: "#6684AC",
};


function createRank(data) {
  const max = Math.max(...data.map(i => i.Value));

  const highRank = [];
  const lowRank = [];
  const highRank2 = [];
  const lowRank2 = [];

  data.forEach(({ Name, Value }) => {
    const label = PERSONALITY_TYPE_LABELS[Name];
    const shortLabel = label.split(' ')[0];

    if (Value === max) {
      highRank.push(label);
      highRank2.push(shortLabel);
    } else {
      lowRank.push(label);
      lowRank2.push(shortLabel);
    }
  });

  return { highRank, lowRank, highRank2, lowRank2 };
}

function capitalizeFirstLetter(str) {
  if (typeof str !== 'string') return str; // Prevent NaN or errors
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeChartsDataKeys(charts) {
  const updatedCharts = {};

  for (const role in charts) {
    updatedCharts[role] = charts[role].map(entry => ({
      ...entry,
      DataKey: capitalizeFirstLetter(entry.DataKey || entry.dataKey),
    }));
  }

  return updatedCharts;
}



// ───── Load images as data URIs ─────
const ImageMap = (upload) => {
  return {
    footerImg: { path: "/app/assets/footerImg.svg", type: "svg+xml" },
    logo: { path: "/app/assets/logo.png", type: "png" },
    progress1: { path: "/app/assets/progress1.svg", type: "svg+xml" },
    progress2: { path: "/app/assets/progress2.svg", type: "svg+xml" },
    progress3: { path: "/app/assets/progress3.svg", type: "svg+xml" },
    progress4: { path: "/app/assets/progress4.svg", type: "svg+xml" },
    reportBg: { path: "/app/assets/report-bg.svg", type: "svg+xml" },
    reportLockIcon: { path: "/app/assets/reportLockIcon.svg", type: "svg+xml" },
    reportRightIcon: { path: "/app/assets/reportRightIcon.svg", type: "svg+xml" },
    listIcon: { path: "/app/assets/listIcon.svg", type: "svg+xml" },
    panPersona: {
      path: `/app/assets/${upload ? "panPersona" : "clientClassification"}.svg`,
      type: "svg+xml",
    },
  };
};

function pdfTimeoutExpires(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("PDF generation timed out")), ms);
  });
}

module.exports = {
  createRank,
  PERSONALITY_TYPE_INFO,
  personalityTypeColors,
  capitalizeChartsDataKeys,
  ImageMap,
  pdfTimeoutExpires
};
