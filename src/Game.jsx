import { useEffect, useRef, useState} from "react"
import Question from "./Question.jsx"


export default function Game(prop) {
    const [quizDataBase, setQuizDataBase] = useState([])
    const userAnswer = useRef([])
    const howManyCorrectAnswers = userAnswer.current.filter((answer,index)=>answer===quizDataBase[index].correct_answer).length
    const {trivia_category, trivia_difficulty, trivia_type} = prop.apiSettings.current
    const apiLink = `https://opentdb.com/api.php?amount=5&category=${trivia_category}&difficulty=${trivia_difficulty}&type=${trivia_type}&encode=url3986`
    console.log(apiLink)
    useEffect(() => {
        const getQuizDataBase = async() => {
            const res = await fetch(apiLink)
            const data = await res.json()

            const dataCleaned = data.results.map(question => {
                const randomIndex = Math.floor(Math.random() * (question.incorrect_answers.length + 1)) 
                const allAnswers = question.incorrect_answers.toSpliced(randomIndex, 0, question.correct_answer)
                return {
                    ...question, 
                    question: decodeURIComponent(question.question),
                    correct_answer: decodeURIComponent(question.correct_answer),
                    allAnswers: allAnswers.map(allAnswer => decodeURIComponent(allAnswer))
                }
            })
            setQuizDataBase(dataCleaned)
        }

        getQuizDataBase()
        
    }, [])

    function formManipulate(e) {
        e.preventDefault()
        const form = new FormData(e.target)
        userAnswer.current = Object.values(Object.fromEntries(form))
        prop.setUserState("Results")
    }


    const questionsElement = quizDataBase.map((question, index) => 
        <Question 
            key={index} 
            questionData={question} 
            userState={prop.userState}
            userAnswer={userAnswer.current[index]}/>)


    return (
        <form onSubmit={formManipulate} className="all-questions-container">
            {questionsElement}
            {
            prop.userState === "Game" && <button>Check answers</button> || 
            prop.userState === "Results" && <><p>You scored {howManyCorrectAnswers}/5 correct answers</p><button onClick={() => prop.setUserState("Home")} type="button">Play again</button></>
            }
        </form>
    )
}