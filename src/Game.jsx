import { useEffect, useRef, useState} from "react"
import Question from "./Question.jsx"


export default function Game(prop) {
    const [quizDataBase, setQuizDataBase] = useState([])
    const userAnswer = useRef([])
    const howManyCorrectAnswers = userAnswer.current.filter((answer,index)=>answer===quizDataBase[index].correct_answer).length
    let {trivia_category, trivia_difficulty, trivia_type} = prop.apiSettings.current
    trivia_category = trivia_category === "any" ? "" : `&category=${trivia_category}`
    trivia_difficulty = trivia_difficulty === "any" ? "" : `&difficulty=${trivia_difficulty}`
    trivia_type = trivia_type === "any" ? "" : `&type=${trivia_type}` 
    const apiLink = `https://opentdb.com/api.php?amount=5${trivia_category}${trivia_difficulty}${trivia_type}&encode=url3986`
    useEffect(() => {
        const getQuizDataBase = async() => {
            const res = await fetch(apiLink)
            const data = await res.json()
            console.log(data)
            if (data.response_code === 0) {
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
                prop.setUserState("Game")
            } else if (data.response_code === 1) {
                prop.setUserState("Not Found")
            } else if (data.response_code === 5) {
                prop.setUserState("Rate Limit")
            }
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

            {prop.userState === "Searching" && 
            <p>Getting data from the API...</p>}

            {prop.userState === "Not Found" &&  
            <>
                <p>Bro, try using different settings—there aren't enough questions matching
                your search.</p>
                <button onClick={() => prop.setUserState("Home")} type="button">
                    Let's try something different
                </button>
            </>}
            
            {prop.userState === "Rate Limit" &&
            <>
                <p>Ayo, hold up—you're rushing! Wait at least 5 seconds and try again.</p>
                <button onClick={() => prop.setUserState("Home")} type="button">Ok, I'll wait...</button>
            </>}

            {
            prop.userState === "Game" && <button>Check answers</button> || 
            prop.userState === "Results" && <><p>You scored {howManyCorrectAnswers}/5 correct answers</p><button onClick={() => prop.setUserState("Home")} type="button">Play again</button></>
            }
        </form>
    )
}