import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subHeader: { fontSize: 16, marginBottom: 10 },
  section: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "1pt solid #ccc",
  },
  statCard: { marginBottom: 10 },
  statTitle: { fontSize: 14, fontWeight: "bold" },
  statValue: { fontSize: 12, marginBottom: 4 },
  projectCard: {
    marginBottom: 10,
    padding: 10,
    border: "1pt solid #ccc",
    borderRadius: 5,
  },
  projectTitle: { fontSize: 14, fontWeight: "bold" },
  projectDescription: { fontSize: 12, marginTop: 4 },
});

interface ResumeProps {
  profile: string;
  bio: string;
  projects: string[];
  userBio: string;
}

export default function ResumePDF({
  profile,
  bio,
  userBio,
  projects,
}: ResumeProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>
            {profile}&apos s Developer Portfolio
          </Text>
          <Text style={styles.subHeader}>{userBio || bio}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.subHeader}>Featured Projects</Text>
          {projects.map((project, index) => (
            <View key={index} style={styles.projectCard}>
              <Text style={styles.projectTitle}>{project}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
