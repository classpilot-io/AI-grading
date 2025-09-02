import SubmissionViewClient from "./SubmissionViewClient";

// Required because of `output: export`
export async function generateStaticParams() {
  // Replace with real IDs later
  return [
    { id: "1", submissionId: "1" },
    { id: "1", submissionId: "2" },
    { id: "1", submissionId: "3" },
    { id: "2", submissionId: "1" },
    { id: "2", submissionId: "2" },
    { id: "2", submissionId: "3" },
    { id: "3", submissionId: "1" },
    { id: "3", submissionId: "2" },
    { id: "3", submissionId: "3" },
  ];
}

export default function Page({
  params,
}: {
  params: { id: string; submissionId: string };
}) {
  return <SubmissionViewClient params={params} />;
}
