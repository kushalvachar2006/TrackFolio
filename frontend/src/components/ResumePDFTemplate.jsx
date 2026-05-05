import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 44,
    backgroundColor: "#ffffff",
  },

  // ── Header ──
  header: {
    marginBottom: 14,
    borderBottom: "2pt solid #f97316",
    paddingBottom: 10,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: "#0f0f0f",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  contactItem: {
    fontSize: 8.5,
    color: "#555555",
    marginRight: 10,
  },
  contactSep: {
    fontSize: 8.5,
    color: "#cccccc",
    marginRight: 10,
  },

  // ── Section ──
  section: {
    marginBottom: 11,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#f97316",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 5,
    paddingBottom: 3,
    borderBottom: "0.75pt solid #f97316",
  },

  // ── Summary ──
  summaryText: {
    fontSize: 9.5,
    color: "#333333",
    lineHeight: 1.55,
  },

  // ── Skills ──
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  skillChip: {
    fontSize: 8.5,
    color: "#374151",
    backgroundColor: "#f3f4f6",
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 3,
    border: "0.5pt solid #e5e7eb",
  },

  // ── Experience / Education / Projects ──
  entryBlock: {
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#111111",
    flex: 1,
  },
  entrySub: {
    fontSize: 9,
    color: "#555555",
    marginBottom: 2,
    fontFamily: "Helvetica-Oblique",
  },
  entryDate: {
    fontSize: 8.5,
    color: "#888888",
    fontFamily: "Helvetica-Oblique",
    textAlign: "right",
    flexShrink: 0,
    marginLeft: 8,
  },
  entryDesc: {
    fontSize: 9.2,
    color: "#333333",
    lineHeight: 1.5,
  },
  entryLink: {
    fontSize: 8.5,
    color: "#f97316",
    marginTop: 2,
  },

  // ── Lists ──
  listItem: {
    fontSize: 9.2,
    color: "#333333",
    marginBottom: 3,
    lineHeight: 1.4,
    paddingLeft: 2,
  },

  // ── Two-column chips ──
  twoCol: {
    flexDirection: "row",
    gap: 10,
  },
  col: {
    flex: 1,
  },

  // ── Footer ──
  footer: {
    position: "absolute",
    bottom: 18,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "0.5pt solid #e5e7eb",
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7.5,
    color: "#aaaaaa",
  },
});

// ─── Helper: filter out empty sections ────────────────────────────────────────
const has = (v) => {
  if (!v) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "string") return v.trim().length > 0;
  return true;
};

// ─── Contact row ──────────────────────────────────────────────────────────────
const ContactRow = ({ d }) => {
  const parts = [d.email, d.phone, d.location, d.linkedin, d.github, d.portfolio].filter(Boolean);
  return (
    <View style={S.contactRow}>
      {parts.map((p, i) => (
        <Text key={i} style={S.contactItem}>
          {p}{i < parts.length - 1 ? "   |" : ""}
        </Text>
      ))}
    </View>
  );
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <View style={S.section}>
    <Text style={S.sectionTitle}>{title}</Text>
    {children}
  </View>
);

// ─── Main PDF Document ────────────────────────────────────────────────────────
export const ResumePDFDocument = ({ data }) => {
  const d = data || {};

  return (
    <Document
      title={`${d.name || "Resume"} — Tailored`}
      author="TrackFolio"
    >
      <Page size="A4" style={S.page}>

        {/* ── HEADER ── */}
        <View style={S.header}>
          <Text style={S.name}>{d.name || "Your Name"}</Text>
          <ContactRow d={d} />
        </View>

        {/* ── SUMMARY ── */}
        {has(d.summary) && (
          <Section title="Professional Summary">
            <Text style={S.summaryText}>{d.summary}</Text>
          </Section>
        )}

        {/* ── SKILLS ── */}
        {has(d.skills) && (
          <Section title="Skills">
            <View style={S.skillsWrap}>
              {d.skills.map((sk, i) => (
                <Text key={i} style={S.skillChip}>{sk}</Text>
              ))}
            </View>
          </Section>
        )}

        {/* ── EXPERIENCE ── */}
        {has(d.experience) && (
          <Section title="Experience">
            {d.experience.map((exp, i) => (
              <View key={i} style={S.entryBlock}>
                <View style={S.entryHeader}>
                  <Text style={S.entryTitle}>{exp.role || ""}</Text>
                  {exp.duration && <Text style={S.entryDate}>{exp.duration}</Text>}
                </View>
                {exp.company && (
                  <Text style={S.entrySub}>{exp.company}</Text>
                )}
                {exp.description && (
                  <Text style={S.entryDesc}>{exp.description}</Text>
                )}
              </View>
            ))}
          </Section>
        )}

        {/* ── PROJECTS ── */}
        {has(d.projects) && (
          <Section title="Projects">
            {d.projects.map((proj, i) => (
              <View key={i} style={S.entryBlock}>
                <View style={S.entryHeader}>
                  <Text style={S.entryTitle}>{proj.name || ""}</Text>
                  {proj.techStack && (
                    <Text style={S.entryDate}>{proj.techStack}</Text>
                  )}
                </View>
                {proj.description && (
                  <Text style={S.entryDesc}>{proj.description}</Text>
                )}
                {proj.link && (
                  <Text style={S.entryLink}>{proj.link}</Text>
                )}
              </View>
            ))}
          </Section>
        )}

        {/* ── EDUCATION ── */}
        {has(d.education) && (
          <Section title="Education">
            {d.education.map((edu, i) => (
              <View key={i} style={S.entryBlock}>
                <View style={S.entryHeader}>
                  <Text style={S.entryTitle}>{edu.degree || ""}</Text>
                  {edu.year && <Text style={S.entryDate}>{edu.year}</Text>}
                </View>
                {edu.institution && (
                  <Text style={S.entrySub}>{edu.institution}</Text>
                )}
                {edu.gpa && <Text style={S.entryDesc}>GPA: {edu.gpa}</Text>}
              </View>
            ))}
          </Section>
        )}

        {/* ── CERTIFICATIONS ── */}
        {has(d.certifications) && (
          <Section title="Certifications">
            {d.certifications.map((c, i) => (
              <Text key={i} style={S.listItem}>• {c}</Text>
            ))}
          </Section>
        )}

        {/* ── ACHIEVEMENTS ── */}
        {has(d.achievements) && (
          <Section title="Achievements">
            {d.achievements.map((a, i) => (
              <Text key={i} style={S.listItem}>• {a}</Text>
            ))}
          </Section>
        )}

        {/* ── LANGUAGES ── */}
        {has(d.languages) && (
          <Section title="Languages">
            <Text style={S.summaryText}>{d.languages.join("   •   ")}</Text>
          </Section>
        )}

        {/* ── FOOTER ── */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>Generated by TrackFolio</Text>
          <Text
            style={S.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

// ─── Helper: trigger browser download ────────────────────────────────────────
import { pdf } from "@react-pdf/renderer";

export const downloadResumePDF = async (data, filename = "tailored_resume") => {
  const blob = await pdf(<ResumePDFDocument data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
