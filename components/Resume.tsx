import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  section: { marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "bold" },
  text: { fontSize: 12, marginTop: 4 },
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
          <Text style={styles.title}>{profile}</Text>
          {userBio?.length > 0 ? (
            <Text style={styles.text}>{userBio}</Text>
          ) : (
            <Text style={styles.text}>{bio}</Text>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Projects</Text>
          {projects.map((project, index) => (
            <Text key={index} style={styles.text}>
              - {project}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
