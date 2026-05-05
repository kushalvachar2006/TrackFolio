import Resume from "../models/Resume.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import HtmlToDocx from "html-to-docx";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function extractTextFromFile(filePath, fileType) {
  if (fileType === "pdf") {
    const data = await pdfParse(fs.readFileSync(filePath));
    return data.text;
  } else if (fileType === "docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  throw new Error("Unsupported file type");
}

async function callGemini(prompt) {
  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  const clean = response.text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

async function callGeminiRaw(prompt) {
  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
}

function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function buildDocxFromTemplate(filePath, tailoredData) {
  const result = await mammoth.convertToHtml({
    path: filePath,
    styleMap: [
      "p[style-name='Title'] => h1:fresh",
      "p[style-name='Section Title'] => h2:fresh",
      "p[style-name='Heading 1'] => h2:fresh",
      "p[style-name='Heading 2'] => h3:fresh",
    ],
  });
  const originalHtml = result.value;
  const tailoredJson = JSON.stringify(tailoredData, null, 2);

  const prompt = `You are an expert HTML editor for resumes. You will receive:
1. The ORIGINAL HTML of a resume (preserve all tags, attributes, base64 images verbatim)
2. TAILORED resume data (JSON with updated content)

RULES:
- PRESERVE every HTML tag and attribute exactly as-is (especially src attributes with base64 data — copy them VERBATIM character-for-character)
- ONLY replace human-readable text: name, summary, skill text, job titles, company names, descriptions, project names, dates
- Match the structure: same number of sections, same nesting
- If tailored data has more items than template, duplicate the last item's HTML pattern
- Return ONLY the modified HTML, no markdown fences, no explanation

ORIGINAL HTML:
${originalHtml}

TAILORED DATA (JSON):
${tailoredJson}`;

  let modifiedHtml;
  try {
    modifiedHtml = await callGeminiRaw(prompt);
    modifiedHtml = modifiedHtml
      .replace(/^```html?\n?/i, "")
      .replace(/\n?```$/m, "")
      .trim();
  } catch (err) {
    console.error("Gemini HTML substitution error:", err.message);
    modifiedHtml = originalHtml;
  }

  return await HtmlToDocx(modifiedHtml, null, {
    table: { row: { cantSplit: true } },
    footer: false,
    pageNumber: false,
    margins: { top: 720, right: 720, bottom: 720, left: 720 },
  });
}

async function buildHtmlFromPdfTemplate(filePath, tailoredData) {
  const pdfData = await pdfParse(fs.readFileSync(filePath));
  const originalText = pdfData.text;
  const tailoredJson = JSON.stringify(tailoredData, null, 2);

  const prompt = `You are an expert resume designer.
Analyze the ORIGINAL resume text to understand its visual style and layout.
Create a complete, professional, self-contained HTML resume using the TAILORED DATA.

REQUIREMENTS:
- Detect style from the text structure (modern/classic/minimal/creative)
- Complete HTML file with embedded CSS + Google Fonts link
- Print-ready with @media print CSS
- Include ALL sections from tailored data
- Genuinely professional — suitable for senior engineer resume
- Return ONLY the complete HTML, no markdown fences

ORIGINAL TEXT (style reference, first 2000 chars):
${originalText.slice(0, 2000)}

TAILORED DATA:
${tailoredJson}`;

  try {
    let html = await callGeminiRaw(prompt);
    return Buffer.from(
      html
        .replace(/^```html?\n?/i, "")
        .replace(/\n?```$/m, "")
        .trim(),
      "utf-8",
    );
  } catch (err) {
    console.error("Gemini PDF template error:", err.message);
    return Buffer.from(generateFallbackHtml(tailoredData), "utf-8");
  }
}

function generateFallbackHtml(d) {
  const skills = (d.skills || []).join(" · ");
  const expHtml = (d.experience || [])
    .map(
      (e) => `
    <div class="item">
      <div class="item-header"><strong>${esc(e.role)}</strong><span class="at">@ ${esc(e.company)}</span><span class="date">${esc(e.duration)}</span></div>
      <p class="desc">${esc(e.description)}</p>
    </div>`,
    )
    .join("");
  const projHtml = (d.projects || [])
    .map(
      (p) => `
    <div class="item">
      <div class="item-header"><strong>${esc(p.name)}</strong><em class="tech">${esc(p.techStack)}</em></div>
      <p class="desc">${esc(p.description)}</p>
      ${p.link ? `<a href="${esc(p.link)}" class="link">${esc(p.link)}</a>` : ""}
    </div>`,
    )
    .join("");
  const eduHtml = (d.education || [])
    .map(
      (e) => `
    <div class="item">
      <div class="item-header"><strong>${esc(e.institution)}</strong><span class="date">${esc(e.year)}</span></div>
      <p>${esc(e.degree)}${e.gpa ? ` · GPA: ${esc(e.gpa)}` : ""}</p>
    </div>`,
    )
    .join("");
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>${esc(d.name)} — Resume</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;font-size:13px;color:#1a1a1a;background:#fff;line-height:1.5}.page{max-width:850px;margin:0 auto;padding:48px 56px}h1.name{font-size:28px;font-weight:700;color:#111;letter-spacing:-0.5px}.contact{display:flex;flex-wrap:wrap;gap:12px;margin-top:10px;font-size:12px;color:#444}.contact a{color:#0066cc;text-decoration:none}hr{border:none;border-top:1.5px solid #e0e0e0;margin:18px 0}h2.sec{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#888;margin-bottom:12px}.section{margin-bottom:22px}.item{margin-bottom:14px}.item-header{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin-bottom:3px}.item-header strong{font-size:13px;font-weight:600;color:#111}.at{color:#555}.date{margin-left:auto;font-size:11px;color:#888}.tech{font-size:11px;color:#888;margin-left:4px}.desc{color:#444;font-size:12.5px;line-height:1.6}.skills-line{font-size:12.5px;color:#333}.link{font-size:11px;color:#0066cc;text-decoration:none;display:block;margin-top:2px}@media print{body{-webkit-print-color-adjust:exact}.page{padding:28px 36px}}</style>
</head><body><div class="page">
<h1 class="name">${esc(d.name)}</h1>
<div class="contact">
${d.email ? `<span>${esc(d.email)}</span>` : ""}${d.phone ? `<span>${esc(d.phone)}</span>` : ""}${d.location ? `<span>${esc(d.location)}</span>` : ""}${d.linkedin ? `<a href="${esc(d.linkedin)}">${esc(d.linkedin)}</a>` : ""}${d.github ? `<a href="${esc(d.github)}">${esc(d.github)}</a>` : ""}${d.portfolio ? `<a href="${esc(d.portfolio)}">${esc(d.portfolio)}</a>` : ""}
</div><hr/>
${d.summary ? `<div class="section"><h2 class="sec">Summary</h2><p class="desc">${esc(d.summary)}</p></div>` : ""}
${skills ? `<div class="section"><h2 class="sec">Skills</h2><p class="skills-line">${esc(skills)}</p></div>` : ""}
${d.experience?.length ? `<div class="section"><h2 class="sec">Experience</h2>${expHtml}</div>` : ""}
${d.projects?.length ? `<div class="section"><h2 class="sec">Projects</h2>${projHtml}</div>` : ""}
${d.education?.length ? `<div class="section"><h2 class="sec">Education</h2>${eduHtml}</div>` : ""}
${d.certifications?.length ? `<div class="section"><h2 class="sec">Certifications</h2><p class="skills-line">${d.certifications.map(esc).join(" · ")}</p></div>` : ""}
${d.achievements?.length ? `<div class="section"><h2 class="sec">Achievements</h2>${d.achievements.map((a) => `<p class="desc">• ${esc(a)}</p>`).join("")}</div>` : ""}
${d.languages?.length ? `<div class="section"><h2 class="sec">Languages</h2><p class="skills-line">${d.languages.map(esc).join(" · ")}</p></div>` : ""}
</div></body></html>`;
}

export const uploadResume = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({
          success: false,
          error: {
            code: "NO_FILE",
            message: "No file uploaded",
            statusCode: 400,
          },
        });
    const { label } = req.body;
    if (!label || label.trim() === "") {
      fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({
          success: false,
          error: {
            code: "MISSING_LABEL",
            message: "Resume label is required",
            statusCode: 400,
          },
        });
    }
    const ext = path.extname(req.file.originalname).toLowerCase().slice(1);
    const fileType = ext === "pdf" ? "pdf" : "docx";
    const resume = new Resume({
      userId: req.user.userId,
      label: label.trim(),
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.filename,
      fileType,
      fileSize: req.file.size,
    });
    await resume.save();
    return res
      .status(201)
      .json({ success: true, message: "Resume uploaded successfully", resume });
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (_) {}
    }
    console.error("Upload resume error:", error);
    return res
      .status(500)
      .json({
        success: false,
        error: {
          code: "UPLOAD_FAILED",
          message: error.message || "Failed to upload resume",
          statusCode: 500,
        },
      });
  }
};

export const parseResumeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    if (!resume)
      return res
        .status(404)
        .json({
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Resume not found",
            statusCode: 404,
          },
        });
    if (resume.userId.toString() !== req.user.userId)
      return res
        .status(403)
        .json({
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Access denied",
            statusCode: 403,
          },
        });
    const filePath = path.join(__dirname, "../uploads", resume.fileName);
    if (!fs.existsSync(filePath))
      return res
        .status(404)
        .json({
          success: false,
          error: {
            code: "FILE_NOT_FOUND",
            message: "Resume file not found on disk",
            statusCode: 404,
          },
        });
    const rawText = await extractTextFromFile(filePath, resume.fileType);
    
    // Extract URLs from the document text using regex
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}\/[^\s]*)/g;
    const foundUrls = rawText.match(urlRegex) || [];
    
    // Filter and categorize URLs
    const linkedinUrls = foundUrls.filter(url => url.includes('linkedin.com'));
    const githubUrls = foundUrls.filter(url => url.includes('github.com'));
    const portfolioUrls = foundUrls.filter(url => 
      !url.includes('linkedin.com') && 
      !url.includes('github.com') &&
      (url.includes('http') || url.includes('www'))
    );
    
    const prompt = `You are an expert resume parser. Extract all structured information from the resume text below.

IMPORTANT: Pay special attention to extracting social media and portfolio links. Look for:
- LinkedIn URLs (linkedin.com/in/...)
- GitHub URLs (github.com/...)
- Portfolio websites
- Any other professional URLs

Return ONLY a valid JSON object (no markdown, no explanation) with these exact keys:
{"name":"","email":"","phone":"","location":"","linkedin":"","github":"","portfolio":"","summary":"","skills":[],"experience":[{"company":"","role":"","duration":"","description":""}],"education":[{"institution":"","degree":"","year":"","gpa":""}],"projects":[{"name":"","description":"","techStack":"","link":""}],"certifications":[],"languages":[],"achievements":[],"extractedUrls":{"linkedin":[],"github":[],"other":[]}}

Use empty string for missing text, empty array for missing lists.

Found URLs in document:
- LinkedIn URLs: ${linkedinUrls.join(', ') || 'None'}
- GitHub URLs: ${githubUrls.join(', ') || 'None'}
- Other URLs: ${portfolioUrls.join(', ') || 'None'}

Resume Text:\n${rawText}`;
    let parsed;
    try {
      parsed = await callGemini(prompt);
    } catch (geminiErr) {
      console.error("Gemini parse error:", geminiErr);
      return res
        .status(502)
        .json({
          success: false,
          error: {
            code: "PARSE_FAILED",
            message: "AI failed to parse resume. Please try again.",
            statusCode: 502,
          },
        });
    }
    
    // Check if LinkedIn or GitHub are missing and flag it
    const needsLinkedIn = !parsed.linkedin || parsed.linkedin.trim() === "";
    const needsGitHub = !parsed.github || parsed.github.trim() === "";
    
    resume.parsedDetails = { 
      ...parsed, 
      isParsed: true, 
      parsedAt: new Date(),
      needsLinkedIn,
      needsGitHub,
      extractedUrls: parsed.extractedUrls || { linkedin: [], github: [], other: [] }
    };
    await resume.save();
    return res
      .status(200)
      .json({
        success: true,
        message: "Resume parsed successfully",
        parsedDetails: resume.parsedDetails,
      });
  } catch (error) {
    console.error("Parse resume error:", error);
    return res
      .status(500)
      .json({
        success: false,
        error: {
          code: "PARSE_FAILED",
          message: error.message || "Failed to parse resume",
          statusCode: 500,
        },
      });
  }
};

export const redefineResume = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim() === "")
      return res
        .status(400)
        .json({
          success: false,
          error: {
            code: "MISSING_JD",
            message: "Job description is required",
            statusCode: 400,
          },
        });
    const resume = await Resume.findById(id);
    if (!resume)
      return res
        .status(404)
        .json({
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Resume not found",
            statusCode: 404,
          },
        });
    if (resume.userId.toString() !== req.user.userId)
      return res
        .status(403)
        .json({
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Access denied",
            statusCode: 403,
          },
        });
    if (!resume.parsedDetails?.isParsed)
      return res
        .status(400)
        .json({
          success: false,
          error: {
            code: "NOT_PARSED",
            message: "Please parse resume details first.",
            statusCode: 400,
          },
        });
    const resumeDetails = JSON.stringify(resume.parsedDetails, null, 2);
    const prompt = `You are an expert resume coach and ATS optimization specialist.
Return ONLY a valid JSON object (no markdown, no extra text):
{"matchScore":72,"summary":"overview paragraph","suggestions":[{"section":"Summary","type":"rewrite","original":"...","suggested":"...","reason":"..."}],"missingKeywords":["kw1"],"strongMatches":["match1"],"updatedResume":{"name":"","email":"","phone":"","location":"","linkedin":"","github":"","portfolio":"","summary":"","skills":[],"experience":[{"company":"","role":"","duration":"","description":""}],"education":[{"institution":"","degree":"","year":"","gpa":""}],"projects":[{"name":"","description":"","techStack":"","link":""}],"certifications":[],"languages":[],"achievements":[]}}
Rules: matchScore 0-100 integer, 3-7 suggestions, do NOT invent content — only rephrase.
Current Resume:\n${resumeDetails}\nJob Description:\n${jobDescription}`;
    let analysis;
    try {
      analysis = await callGemini(prompt);
    } catch (geminiErr) {
      console.error("Gemini redefine error:", geminiErr);
      return res
        .status(502)
        .json({
          success: false,
          error: {
            code: "AI_FAILED",
            message: "AI analysis failed. Please try again.",
            statusCode: 502,
          },
        });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Resume tailored successfully",
        analysis,
      });
  } catch (error) {
    console.error("Redefine resume error:", error);
    return res
      .status(500)
      .json({
        success: false,
        error: {
          code: "REDEFINE_FAILED",
          message: error.message || "Failed to redefine resume",
          statusCode: 500,
        },
      });
  }
};

export const downloadTailoredResume = async (req, res) => {
  try {
    const { id } = req.params;
    const { tailoredData } = req.body;
    if (!tailoredData)
      return res
        .status(400)
        .json({
          success: false,
          error: {
            code: "MISSING_DATA",
            message: "Tailored resume data is required",
            statusCode: 400,
          },
        });
    const resume = await Resume.findById(id);
    if (!resume)
      return res
        .status(404)
        .json({
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Resume not found",
            statusCode: 404,
          },
        });
    if (resume.userId.toString() !== req.user.userId)
      return res
        .status(403)
        .json({
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Access denied",
            statusCode: 403,
          },
        });
    const filePath = path.join(__dirname, "../uploads", resume.fileName);
    const fileExists = fs.existsSync(filePath);
    const safeLabel = (resume.label || "resume").replace(/[^a-z0-9]/gi, "_");

    if (resume.fileType === "docx" && fileExists) {
      try {
        const docxBuffer = await buildDocxFromTemplate(filePath, tailoredData);
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        );
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${safeLabel}_tailored.docx"`,
        );
        return res.send(docxBuffer);
      } catch (err) {
        console.error("DOCX template build failed:", err.message);
      }
    }

    if (resume.fileType === "pdf" && fileExists) {
      try {
        const htmlBuffer = await buildHtmlFromPdfTemplate(
          filePath,
          tailoredData,
        );
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${safeLabel}_tailored.html"`,
        );
        return res.send(htmlBuffer);
      } catch (err) {
        console.error("PDF template build failed:", err.message);
      }
    }

    // Fallback: clean HTML
    const fallbackHtml = generateFallbackHtml(tailoredData);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeLabel}_tailored.html"`,
    );
    return res.send(Buffer.from(fallbackHtml, "utf-8"));
  } catch (error) {
    console.error("Download tailored resume error:", error);
    return res
      .status(500)
      .json({
        success: false,
        error: {
          code: "DOWNLOAD_FAILED",
          message: error.message || "Failed to generate resume",
          statusCode: 500,
        },
      });
  }
};

export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      userId: req.user.userId,
      isActive: true,
    }).sort({ uploadedAt: -1 });
    return res
      .status(200)
      .json({
        success: true,
        message: "Resumes retrieved successfully",
        resumes,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        error: {
          code: "FETCH_FAILED",
          message: error.message || "Failed to fetch resumes",
          statusCode: 500,
        },
      });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    if (!resume)
      return res
        .status(404)
        .json({
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Resume not found",
            statusCode: 404,
          },
        });
    if (resume.userId.toString() !== req.user.userId)
      return res
        .status(403)
        .json({
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Access denied",
            statusCode: 403,
          },
        });
    const filePath = path.join(__dirname, "../uploads", resume.fileName);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (e) {}
    await Resume.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        error: {
          code: "DELETE_FAILED",
          message: error.message || "Failed to delete resume",
          statusCode: 500,
        },
      });
  }
};

export const getResumeFile = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    if (!resume)
      return res
        .status(404)
        .json({
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Resume not found",
            statusCode: 404,
          },
        });
    if (resume.userId.toString() !== req.user.userId)
      return res
        .status(403)
        .json({
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Access denied",
            statusCode: 403,
          },
        });
    return res
      .status(200)
      .json({
        success: true,
        message: "File URL retrieved successfully",
        fileUrl: resume.fileUrl,
        fileName: resume.label,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        error: {
          code: "FETCH_FAILED",
          message: error.message || "Failed to retrieve file",
          statusCode: 500,
        },
      });
  }
};

export const updateParsedDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { parsedDetails } = req.body;
    
    if (!parsedDetails) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_DATA",
          message: "Parsed details are required",
          statusCode: 400,
        },
      });
    }

    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Resume not found",
          statusCode: 404,
        },
      });
    }

    if (resume.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Access denied",
          statusCode: 403,
        },
      });
    }

    // Update the parsed details
    resume.parsedDetails = {
      ...resume.parsedDetails,
      ...parsedDetails,
      updatedAt: new Date(),
    };
    
    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Parsed details updated successfully",
      parsedDetails: resume.parsedDetails,
    });
  } catch (error) {
    console.error("Update parsed details error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "UPDATE_FAILED",
        message: error.message || "Failed to update parsed details",
        statusCode: 500,
      },
    });
  }
};