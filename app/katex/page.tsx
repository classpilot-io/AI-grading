"use client";
import KaTeXComponent from '@/components/kaTexComponent';

// Assuming `gradedData` is the JSON object from the LLM
const gradedData = {"grades": [{"parts": [], "answer_text": "$2000 = m \\times 2^3$\n$m = \\frac{2000}{8}$\n$m = 250$\nAnswer $m = 250$", "total_marks": "1/1", "question_text": "After 1 hour, the number of bacteria has increased to 2000. Find $m$.", "correct_answer": null, "question_number": "25(a)"}, {"parts": [], "answer_text": "$N = 250 \\times (2^3)^t$\n$N = 250 \\times 8^t$\n$N = 250 \\times k$\nAnswer $N = 250K$", "total_marks": "1/1", "question_text": "Find, in terms of $k$, the number of bacteria when $8^t = k$.", "correct_answer": null, "question_number": "25(b)"}, {"parts": [], "answer_text": "When $t=2h$: $N = 250 \\times 2^6 = 16000$\n$\\frac{16000 - 250}{250} \\times 100\\% = 6300\\%$\nAnswer $6300 \\%$", "total_marks": "2/2", "question_text": "Find the increase in the number of bacteria after 2 hours as a percentage of the number of bacteria originally introduced.", "correct_answer": null, "question_number": "25(c)"}, {"parts": [], "answer_text": "Answer Diagram 3", "total_marks": "1/1", "question_text": "Which of these diagrams represents the graph of $N$ against $t$?", "correct_answer": null, "question_number": "25(d)"}], "total_submission_marks": "5/5"}

export default function GraderPage() {
  return (
    <div>
      <h1>Graded Submission</h1>
      {gradedData.grades.map((grade, index) => (
        <div key={index}>
          <h2>Question {grade.question_number}</h2>
          {/* Check if the question has parts */}
          {grade.parts.length > 0 ? (
            // If it has parts, map over them
            <div>
              <p><strong>Total Marks:</strong> {grade.total_marks}</p>
              {grade.parts.map((part: any, partIndex: any) => (
                <div key={partIndex} style={{ marginLeft: '20px' }}>
                  <h3>Part {part.part_number}</h3>
                  <p><strong>Question Text:</strong> <KaTeXComponent mathText={part.question_text} /></p>
                  <p><strong>Student's Answer:</strong> <KaTeXComponent mathText={part.answer_text.replace(/\\n/g, '\n')} /></p>
                  <p><strong>Part Marks:</strong> {part.marks}</p>
                  {part.correct_answer && (
                    <p><strong>Correct Answer:</strong> <KaTeXComponent mathText={part.correct_answer} /></p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // If no parts, render as a single question
            <div>
              <p><strong>Question:</strong> <KaTeXComponent mathText={grade.question_text} /></p>
              <p><strong>Student's Answer:</strong> <KaTeXComponent mathText={grade.answer_text.replace(/\\n/g, '\n')} /></p>
              <p><strong>Grade:</strong> {grade.total_marks}</p>
              {grade.correct_answer && (
                <p><strong>Correct Answer:</strong> <KaTeXComponent mathText={grade.correct_answer} /></p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}