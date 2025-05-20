import { useEffect, useState } from 'react';
import axios from 'axios';

interface Question {
  id: string;
  title: string;
  description: string;
  type: string;
  options?: string[];
}

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [reviewData, setReviewData] = useState<Record<string, string> | null>(null);

  // Load survey questions
  useEffect(() => {
    axios
      .get('http://localhost:4000/survey')
      .then((res) => {
        setQuestions(res.data);
      })
      .catch((err) => {
        console.error('Error loading survey:', err);
      });
  }, []);

  // Handle input change
  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form submit
  const handleSubmit = async () => {
    const res = await axios.post('http://localhost:4000/responses', { answers });
    setSubmittedId(res.data.id);
    const reviewRes = await axios.get(`http://localhost:4000/responses/${res.data.id}`);
    setReviewData(reviewRes.data.answers);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Waterlily Survey Form</h1>

      {submittedId && reviewData ? (
        <div className="bg-green-50 border border-green-300 rounded p-4">
          <h2 className="text-xl font-semibold mb-2">
            Thank you! Here are your responses
          </h2>
          <ul className="list-disc pl-6">
            {Object.entries(reviewData).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      ) : questions.length === 0 ? (
        <p className="text-gray-500">Loading survey questions...</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          {questions.map((q, index) => (
            <div key={q.id} className="border p-4 rounded shadow-sm bg-white">
              {/* Progress Indicator */}
              <div className="text-sm text-gray-500 mb-1">
                Question {index + 1} of {questions.length}
              </div>

              {/* Question Title */}
              <label className="block font-semibold text-lg mb-1">{q.title}</label>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-2">{q.description}</p>

              {/* Input Field with validation */}
              {q.type === 'text' || q.type === 'number' ? (
                <input
                  type={q.type}
                  className="w-full border px-3 py-2 rounded"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  required
                  min={q.type === 'number' ? 1 : undefined}
                />
              ) : q.type === 'textarea' ? (
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  rows={4}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  required
                />
              ) : q.type === 'radio' && q.options ? (
                <div className="flex flex-col gap-1">
                  {q.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        required
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Survey
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
