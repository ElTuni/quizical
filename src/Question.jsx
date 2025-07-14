import { useId, Fragment } from "react"
import clsx from 'clsx'

export default function Question(prop) {
    const answersId = useId()
    const questionData = prop.questionData
    const correctAnswer = questionData.correct_answer
    const allAnswers = questionData.allAnswers

    const answersElement = allAnswers.map(answer => {
        const style = 
            clsx(
                prop.userState === "Results" ? 
                    answer === correctAnswer ? "correctAnswer" 
                        : answer === prop.userAnswer ? "incorrectAnswer" 
                    : "gameover" 
                : "")

        return (
            <Fragment key={answer}>

                <input 
                    type="radio" 
                    name={answersId}
                    value={answer}
                    id={answersId + answer}
                    required />

                <label 
                    htmlFor={answersId + answer}
                    className={style}>
                    {answer}
                </label>

            </Fragment>
    )})

        return (
            <div className="each-question-container">
                <h2>{questionData.question}</h2>
                <div className="labels-container">
                    {answersElement}
                </div>
            </div>
        )
}