import { NextResponse } from "next/server"
import ReactPDF from "@react-pdf/renderer"

import { cvSchema, type CVData } from "../../../lib/cv"

const { Document, Page, StyleSheet, Text, View, renderToStream } = ReactPDF

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
    backgroundColor: "#ffffff",
    color: "#1f2937",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    borderBottomStyle: "solid",
    marginBottom: 16,
    paddingBottom: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 2,
  },
  subheading: {
    fontSize: 12,
    fontWeight: 500,
    color: "#4b5563",
    marginBottom: 8,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: "#111827",
    marginBottom: 6,
  },
  entry: {
    marginBottom: 8,
  },
  entryHeading: {
    fontSize: 11,
    fontWeight: 600,
  },
  entryMeta: {
    fontSize: 10,
    color: "#6b7280",
  },
  bullet: {
    fontSize: 10,
    marginLeft: 10,
  },
  list: {
    marginTop: 4,
    paddingLeft: 8,
  },
  chipList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
  },
  chip: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#9ca3af",
    borderRadius: 9999,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 9,
    marginRight: 4,
    marginBottom: 4,
  },
})

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const data = cvSchema.parse(payload.cv) as CVData

    // Create the PDF document
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.heading}>{data.personal.fullName}</Text>
            {data.personal.title && <Text style={styles.subheading}>{data.personal.title}</Text>}
            <Text style={styles.entryMeta}>
              {[data.personal.email, data.personal.phone, data.personal.location]
                .filter(Boolean)
                .join(" · ")}
            </Text>
          </View>

          {data.personal.summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <Text>{data.personal.summary}</Text>
            </View>
          )}

          {data.experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {data.experience.map((role: CVData["experience"][number]) => (
                <View key={role.id} style={styles.entry}>
                  <Text style={styles.entryHeading}>
                    {role.role} · {role.company}
                  </Text>
                  <Text style={styles.entryMeta}>
                    {[role.location, [role.startDate, role.endDate].filter(Boolean).join(" — ")]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>
                  <View style={styles.list}>
                    {role.highlights.map((highlight: string, index: number) => (
                      <Text key={`${role.id}-highlight-${index}`} style={styles.bullet}>
                        • {highlight}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {data.projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {data.projects.map((project: CVData["projects"][number]) => (
                <View key={project.id} style={styles.entry}>
                  <Text style={styles.entryHeading}>{project.name}</Text>
                  {project.summary && <Text>{project.summary}</Text>}
                  <View style={styles.list}>
                    {project.highlights.map((highlight: string, index: number) => (
                      <Text key={`${project.id}-highlight-${index}`} style={styles.bullet}>
                        • {highlight}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {data.education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {data.education.map((item: CVData["education"][number]) => (
                <View key={item.id} style={styles.entry}>
                  <Text style={styles.entryHeading}>{item.degree}</Text>
                  <Text style={styles.entryMeta}>
                    {[item.school, item.location].filter(Boolean).join(" · ")}
                  </Text>
                  <Text style={styles.entryMeta}>
                    {[item.startDate, item.endDate].filter(Boolean).join(" — ")}
                  </Text>
                  <View style={styles.list}>
                    {item.highlights.map((highlight: string, index: number) => (
                      <Text key={`${item.id}-highlight-${index}`} style={styles.bullet}>
                        • {highlight}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {data.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.chipList}>
                {data.skills.map((skill: string) => (
                  <Text key={skill} style={styles.chip}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {data.certifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {data.certifications.map((cert: string, index: number) => (
                <Text key={`${cert}-${index}`} style={styles.bullet}>
                  • {cert}
                </Text>
              ))}
            </View>
          )}

          {data.languages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              {data.languages.map((language: string, index: number) => (
                <Text key={`${language}-${index}`} style={styles.bullet}>
                  • {language}
                </Text>
              ))}
            </View>
          )}
        </Page>
      </Document>
    )
    
    // Debug: Check what doc is
    console.log("doc:", doc)
    console.log("doc type:", typeof doc)
    console.log("doc props:", doc?.props)
    console.log("Document component:", Document)
    console.log("renderToStream:", renderToStream)
    
    // Generate PDF using ReactPDF
    const pdfStream = await renderToStream(doc)
    
    // Convert Node.js stream to buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of pdfStream as any) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)
    const pdfBytes = new Uint8Array(buffer)

    const fileName = `${data.personal.fullName.replace(/\s+/g, "-")}-CV.pdf`

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "private, max-age=0, no-cache",
      },
    })
  } catch (error) {
    console.error("Export failed", error)
    return NextResponse.json({ message: "Unable to generate PDF" }, { status: 400 })
  }
}
