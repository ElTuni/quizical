import { useRef, useState } from "react"
import Home from "./Home.jsx"
import Game from "./Game.jsx"



export default function App() {
    const [userState, setUserState] = useState("Home")
    const apiSettings = useRef(null)
    return(
        <main>
            {userState === "Home" && <Home setUserState={setUserState} apiSettings={apiSettings}/>}
            {(userState === "Game" || userState === "Results") && <Game setUserState={setUserState} userState={userState} apiSettings={apiSettings} />}
        </main>
    )
}