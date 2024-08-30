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
  const [previousQuestions, setPreviousQuestions] = useState([]);

  // Load dataset from a JSON file
  useEffect(() => {
    axios.get('src/questions_answers.json') // Adjust the path as necessary
      .then(response => {
        setDataset(response.data);
      })
      .catch(error => {
        console.error("Error loading dataset", error);
      });
  }, []);

  // Function to generate a question
  function generate() {
    if (dataset.length === 0) {
      setResp('No questions available.');
      return;
    }

    // Select a random question that hasn't been asked yet
    let randomQuestion;
    do {
      const randomTopic = dataset[Math.floor(Math.random() * dataset.length)];
      randomQuestion = randomTopic.questions[Math.floor(Math.random() * randomTopic.questions.length)];
    } while (previousQuestions.includes(randomQuestion.question));

    setCurrentQuestion(randomQuestion);
    setResp(`Answer the following question: ${randomQuestion.question}`);
    setConv([...conv, { role: 'system', content: randomQuestion.question }]);
    setPreviousQuestions([...previousQuestions, randomQuestion.question]); // Track asked questions
  }

  // Function to evaluate the user's response using the Gemini API
  const evaluateResponse = async (userAnswer) => {
    if (!currentQuestion) return;

    const questionText = currentQuestion.question;
    const apiKey = 'AIzaSyBu1zAi0qkx9o-1dYPaDAmk7KHltzNTqFE'; // Replace with your actual API key

    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey,
        {
          contents: [
            {
              parts: [
                { text: `Evaluate the following answer for the question: "${questionText}". Answer: "${userAnswer}". Rate the answer on a scale of 0 to 100. ,just display score and evaluation reason/criteria in 1line ` }
              ]
            }
          ]
        }
      );

      const aiScore = response.data.candidates[0].content.parts[0].text;
      setResp(`Score: ${aiScore}`);
      setConv([...conv, { role: 'user', content: userAnswer }, { role: 'system', content: `Score: ${aiScore}` }]);
    } catch (error) {
      console.error("Error evaluating response", error);
      setResp('Error evaluating response.');
    }
  };

  const handleSubmitAnswer = () => {
    evaluateResponse(que);
    setQue(''); // Clear the input
    setCurrentQuestion(null); // Clear the current question
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const displayHistory = () => (
    <div>
      <h2>Conversation History:</h2>
      {conv.map((query, index) => (
        <p key={index}>{query.role === 'user' ? 'You:' : 'System:'} {query.content}</p>
      ))}
    </div>
  );

  return (
    <>
      <h1>Chatai</h1>
      {currentQuestion ? (
        <>
          <h2>{currentQuestion.question}</h2>
          <textarea value={que} onChange={(e) => setQue(e.target.value)} placeholder="Type your answer here"></textarea>
          <button onClick={handleSubmitAnswer}>Submit Answer</button>
        </>
      ) : (
        <>
          <button onClick={generate}>Generate Question</button>
        </>
      )}
      <button onClick={toggleHistory}>
        {showHistory ? 'Hide Conversation History' : 'Show Conversation History'}
      </button>
      {showHistory && displayHistory()}
      <h2>Result:</h2>
      <p>{resp}</p>
    </>
  );
}

export default App;