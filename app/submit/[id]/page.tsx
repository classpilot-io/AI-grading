import StudentSubmissionPage from "./StudentSubmissionPage";

const demoAssignments = [
  { id: "demo-1" },
  { id: "demo-2" },
];

export function generateStaticParams() {
  return demoAssignments.map((a) => ({ id: a.id }));
}

export default function Page({ params }: { params: { id: string } }) {
  return <StudentSubmissionPage params={params} />;
}
