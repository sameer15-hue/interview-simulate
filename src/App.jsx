import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [conv, setConv] = useState([]);
  const [resp, setResp] = useState('');
  const [que, setQue] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [dataset, setDataset] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Load dataset from a JSON file
  useEffect(() => {
    axios.get('src/questions_answers.json') // Adjust the path as necessary
      .then(response => setDataset(response.data))
      .catch(error => console.error("Error loading dataset", error));
  }, []);

  // Function to generate a question
  function generate() {
    if (dataset.length === 0) {
      setResp('No questions available.');
      return;
    }

    const randomTopic = dataset[Math.floor(Math.random() * dataset.length)];
    const difficulties = ['easy', 'medium', 'hard'];
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

    const randomQuestion = randomTopic.questions.find(q => q.difficulty === randomDifficulty && !conv.some(entry => entry.question === q.question));

    if (randomQuestion) {
      setCurrentQuestion(randomQuestion);
      setResp(`Answer the following question: ${randomQuestion.question}`);
    } else {
      setResp('No more unique questions available.');
    }
  }

  // Function to evaluate the user's response using the Gemini API
  const evaluateResponse = async (userAnswer) => {
    if (!currentQuestion) return;

    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY', // Replace with your actual API key
        {
          contents: [
            {
              parts: [
                { text: `Evaluate the following answer for the question: "${currentQuestion.question}". Answer: "${userAnswer}". Rate the answer on a scale of 0 to 100. ,just display score and evaluation reason/criteria in 1line ` }
              ]
            }
          ]
        }
      );

      const aiScore = response.data.candidates[0].content.parts[0].text;
      const scoreMatch = aiScore.match(/^\d+/);
      const score = scoreMatch ? parseInt(scoreMatch[0], 10) : 'N/A';

      setResp(`Score: ${score}`);
      setConv([...conv, { question: currentQuestion.question, answer: userAnswer, score }]);
      setCurrentQuestion(null); // Clear the current question
    } catch (error) {
      console.error("Error evaluating response", error);
      setResp('Error evaluating response.');
    }
  };

  const handleSubmitAnswer = () => {
    evaluateResponse(que);
    setQue(''); // Clear the input
  };

  const toggleHistory = () => setShowHistory(!showHistory);

  const displayHistory = () => (
    <div>
      <h2>Conversation History:</h2>
      {conv.map((entry, index) => (
        <p key={index}>
          <strong>Question:</strong> {entry.question}<br />
          <strong>Your Answer:</strong> {entry.answer}<br />
          <strong>Score:</strong> {entry.score}
        </p>
      ))}
    </div>
  );

  return (
    <>
      <h1>Chatai</h1>
      {currentQuestion ? (
        <>
          <p>{resp}</p>
          <textarea value={que} onChange={(e) => setQue(e.target.value)} placeholder="Type your answer here"></textarea>
          <button onClick={handleSubmitAnswer}>Submit Answer</button>
        </>
      ) : (
        <button onClick={generate}>Generate Question</button>
      )}
      <button onClick={toggleHistory}>
        {showHistory ? 'Hide Conversation History' : 'Show Conversation History'}
      </button>
      {showHistory && displayHistory()}
    </>
  );
}

export default App;
