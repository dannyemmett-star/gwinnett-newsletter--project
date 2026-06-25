const fs = require("fs");
const path = require("path");

const root = __dirname;
const dataFile = process.argv[2] || "newsletter-data.json";
const dataPath = path.resolve(root, dataFile);
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const template = fs.readFileSync(path.join(root, "newsletter-template.html"), "utf8");

const themes = [
  { name: "Light Blue", outer: "#dff3ff", frame: "#bfe9ff", header: "#8fd3f4", headerAccent: "#3a96c2" },
  { name: "Soft Peach", outer: "#fff3e6", frame: "#ffd9b3", header: "#f2b47e", headerAccent: "#d9824b" },
  { name: "Pale Green", outer: "#eefaf1", frame: "#c9f2d2", header: "#9ed8ad", headerAccent: "#58a66c" },
  { name: "Soft Lavender", outer: "#f5f0ff", frame: "#ded2ff", header: "#b9a7e8", headerAccent: "#8069bd" },
  { name: "Light Cream", outer: "#fffbea", frame: "#fff0b8", header: "#efd27a", headerAccent: "#bd9a32" }
];

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const safeUrl = (value = "") => {
  const url = String(value).trim();
  return /^(https?:|mailto:|tel:)/i.test(url) || /^assets\/[a-z0-9._/-]+$/i.test(url)
    ? escapeHtml(url)
    : "";
};

const rotate = (items, index) => items[((Number(index) || 0) % items.length + items.length) % items.length];
const paragraphs = (items) => items.map((text) => `<p style="margin:12px 0 0;">${text}</p>`).join("");

const theme = rotate(themes, data.themeIndex);
const quickNote = `<p style="margin:0;">${escapeHtml(data.quickNote.greeting)}</p>${paragraphs(data.quickNote.paragraphs)}`;
const marketContent = `
  <div style="padding-top:7px; font-size:20px; line-height:26px; font-weight:bold; color:#16324f;">${escapeHtml(data.market.title)}</div>
  ${paragraphs(data.market.paragraphs)}
  ${data.market.verificationNote ? `<div style="margin-top:14px; padding:9px 11px; background-color:#ffffff; font-size:12px; line-height:18px; color:#8a4b08;"><strong>Pre-send check:</strong> ${escapeHtml(data.market.verificationNote.replace(/^Stacy:\s*/i, ""))}</div>` : ""}
`;
const homeownerTip = `
  <div style="padding-top:7px; font-size:20px; line-height:26px; font-weight:bold; color:#16324f;">${escapeHtml(data.homeownerTip.title)}</div>
  <p style="margin:12px 0 8px;">${escapeHtml(data.homeownerTip.intro)}</p>
  <ul style="margin:8px 0 12px; padding-left:22px;">${data.homeownerTip.items.map((item) => `<li style="margin:5px 0;">${escapeHtml(item)}</li>`).join("")}</ul>
  <p style="margin:0;">${escapeHtml(data.homeownerTip.closing)}</p>
`;
const eventLink = safeUrl(data.localEvent.link);
const localEvent = `
  <p style="margin:10px 0 0;">${escapeHtml(data.localEvent.intro)}</p>
  <div style="padding-top:10px; font-size:20px; line-height:26px; font-weight:bold;"><a href="${eventLink}" style="color:#b64b08; text-decoration:underline;">${escapeHtml(data.localEvent.title)}</a></div>
  <p style="margin:12px 0 0;">${escapeHtml(data.localEvent.copy)}</p>
  <p style="margin:12px 0 0; font-size:13px; line-height:20px;"><strong>${escapeHtml(data.localEvent.tip)}</strong></p>
`;
const cartoonUrl = safeUrl(data.cartoon.imageUrl);
const cartoonImage = cartoonUrl
  ? `<img src="${cartoonUrl}" width="500" alt="${escapeHtml(data.cartoon.imageAlt)}" style="display:block; width:100%; max-width:500px; height:auto; margin:14px auto 0; border:0;">`
  : `<div style="margin-top:14px; padding:30px 18px; border:2px dashed #d7aa19; background-color:#ffffff; text-align:center; font-size:13px; line-height:20px; color:#77601a;"><strong>[INSERT CARTOON IMAGE URL]</strong><br>Suggested scene: ${escapeHtml(data.cartoon.imageAlt)}.</div>`;
const cartoonContent = `
  ${cartoonImage}
  <div style="padding-top:15px; text-align:center; font-size:19px; line-height:27px; font-weight:bold; color:#5f4b00;">${escapeHtml(data.cartoon.caption)}</div>
  <p style="margin:10px 0 0; text-align:center;">${escapeHtml(data.cartoon.closing)}</p>
`;
const quizSection = data.quiz.include ? `
  <tr>
    <td style="padding:12px 28px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; background-color:#f5f0ff; border-left:5px solid #7c3aed;">
        <tr><td style="padding:22px; font-family:Arial,Helvetica,sans-serif; font-size:15px; line-height:24px; color:#243447;">
          <div style="font-size:12px; line-height:16px; font-weight:bold; letter-spacing:1px; color:#6b2bd1;">MONTHLY QUIZ • $25 AMAZON GIFT CARD</div>
          <div style="padding-top:8px; font-size:19px; line-height:26px; font-weight:bold; color:#16324f;">${escapeHtml(data.quiz.question)}</div>
          <div style="padding-top:10px;">${data.quiz.answers.map((answer) => `<div style="padding:3px 0;">${escapeHtml(answer)}</div>`).join("")}</div>
          <p style="margin:14px 0 0;"><strong>${escapeHtml(data.quiz.cta)}</strong></p>
          <p style="margin:10px 0 0; font-size:11px; line-height:17px; color:#665b78;">${escapeHtml(data.quiz.legalLine)}</p>
        </td></tr>
      </table>
    </td>
  </tr>` : "";

const buttons = [
  ["Request an Equity Report", "https://emmettrealtygroup.com/equity-report"],
  ["Book a 15-Minute Call", "https://calendar.app.google/TkqULC8rNLSWrhjt5"]
];
const ctaButtons = buttons.map(([label, href]) =>
  `<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:8px auto;"><tr><td align="center" bgcolor="#2563eb" style="border-radius:4px;"><a href="${safeUrl(href)}" style="display:inline-block; padding:11px 18px; font-family:Arial,Helvetica,sans-serif; font-size:14px; font-weight:bold; color:#ffffff; text-decoration:none;">${escapeHtml(label)}</a></td></tr></table>`
).join("");

const selectedFooterImage = rotate(data.footerImages, data.footerImageIndex);
const footerUrl = safeUrl(selectedFooterImage);
const footerImage = footerUrl
  ? `<img src="${footerUrl}" width="544" alt="Around Gwinnett" style="display:block; width:100%; max-width:544px; height:auto; margin:0 0 10px; border:0;">`
  : "";
const footerImageSection = footerImage
  ? `<tr><td style="padding:0 28px 22px;">${footerImage}</td></tr>`
  : "";

const replacements = {
  SUBJECT_LINE: escapeHtml(data.subjectLine),
  PREVIEW_TEXT: escapeHtml(data.previewText),
  ISSUE_DATE: escapeHtml(data.issueDate),
  OUTER_BACKGROUND: theme.outer,
  FRAME_BACKGROUND: theme.frame,
  HEADER_BACKGROUND: theme.header,
  HEADER_ACCENT: theme.headerAccent,
  QUICK_NOTE: quickNote,
  MARKET_CONTENT: marketContent,
  HOMEOWNER_TIP: homeownerTip,
  LOCAL_EVENT: localEvent,
  CARTOON_CONTENT: cartoonContent,
  QUIZ_SECTION: quizSection,
  CTA_BUTTONS: ctaButtons,
  FOOTER_IMAGE_SECTION: footerImageSection
};

let output = template;
for (const [key, value] of Object.entries(replacements)) {
  output = output.replaceAll(`{{${key}}}`, value);
}

const unresolved = output.match(/{{[A-Z0-9_]+}}/g);
if (unresolved) throw new Error(`Unresolved template fields: ${unresolved.join(", ")}`);

const dist = path.join(root, "dist");
fs.mkdirSync(dist, { recursive: true });
const issueSlug = String(data.issueDate)
  .toLowerCase()
  .replace(/,/g, "")
  .replace(/\s+/g, "-")
  .replace(/[^a-z0-9-]/g, "");
const datedFileName = `gwinnett-and-beyond-${issueSlug}.html`;
fs.writeFileSync(path.join(dist, "newsletter.html"), output, "utf8");
fs.writeFileSync(path.join(dist, datedFileName), output, "utf8");
fs.writeFileSync(path.join(root, "index.html"), output, "utf8");

console.log(`Generated issue dated ${data.issueDate} with theme ${Number(data.themeIndex) + 1}: ${theme.name}`);
console.log(`Footer image rotation slot: ${Number(data.footerImageIndex) + 1}`);
console.log(path.join(dist, "newsletter.html"));
console.log(path.join(dist, datedFileName));
