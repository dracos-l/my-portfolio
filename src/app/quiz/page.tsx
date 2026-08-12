"use client";

import Link from "next/link";
import { useState } from "react";
import { portfolio } from "@/data/portfolio";

export default function QuizPage() {
  const questions = portfolio.quizQuestions;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const question = questions[currentQuestion];
  const score = answers.reduce(
    (total, answer, index) =>
      total + (answer === questions[index].answer ? 1 : 0),
    0,
  );

  function continueQuiz() {
    if (selectedAnswer === null) return;

    const nextAnswers = [...answers, selectedAnswer];

    if (currentQuestion === questions.length - 1) {
      setAnswers(nextAnswers);
      setIsComplete(true);
      return;
    }

    setAnswers(nextAnswers);
    setCurrentQuestion((index) => index + 1);
    setSelectedAnswer(null);
  }

  function restartQuiz() {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setIsComplete(false);
  }

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <main className="quiz-page">
        <section className="quiz-card quiz-results">
          <Link className="quiz-back" href="/">
            ← Back to portfolio
          </Link>
          <p className="quiz-kicker">Quiz complete</p>
          <p className="quiz-score">
            {score}
            <span>/{questions.length}</span>
          </p>
          <h1>{percentage === 100 ? "You know your stuff." : "Nice work!"}</h1>
          <p className="quiz-description">
            You got {score} of {questions.length} questions right.
          </p>
          <button className="quiz-button" onClick={restartQuiz} type="button">
            Play again <span aria-hidden="true">↻</span>
          </button>
        </section>
      </main>
    );
  }

  const hasSelectedAnswer = selectedAnswer !== null;

  return (
    <main className="quiz-page">
      <section className="quiz-card">
        <Link className="quiz-back" href="/">
          ← Back to portfolio
        </Link>
        <div className="quiz-progress" aria-hidden="true">
          {questions.map((item, index) => (
            <span
              className={index <= currentQuestion ? "is-active" : ""}
              key={item.question}
            />
          ))}
        </div>
        <p className="quiz-kicker">
          Quick quiz · {currentQuestion + 1} of {questions.length}
        </p>
        <h1>{question.question}</h1>
        <div className="quiz-options">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.answer;
            const className = [
              "quiz-option",
              isSelected ? "is-selected" : "",
              hasSelectedAnswer && isCorrect ? "is-correct" : "",
              hasSelectedAnswer && isSelected && !isCorrect
                ? "is-incorrect"
                : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                className={className}
                disabled={hasSelectedAnswer}
                key={option}
                onClick={() => setSelectedAnswer(index)}
                type="button"
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {option}
              </button>
            );
          })}
        </div>
        {hasSelectedAnswer && (
          <p className="quiz-feedback">
            {selectedAnswer === question.answer ? "Correct! " : "Not quite. "}
            {question.explanation}
          </p>
        )}
        <button
          className="quiz-button"
          disabled={!hasSelectedAnswer}
          onClick={continueQuiz}
          type="button"
        >
          {currentQuestion === questions.length - 1
            ? "See my score"
            : "Next question"}
          <span aria-hidden="true">→</span>
        </button>
      </section>
    </main>
  );
}
