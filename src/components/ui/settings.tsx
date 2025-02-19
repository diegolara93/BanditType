/*
 Used to select the settings for the main typer page
*/
import { SetStateAction, useState, useEffect } from "react";

import { Button } from "./button";

export default function Settings() {
    const [wordCount, setWordCount] = useState(10);
    const [minLength, setMinLength] = useState(3);
    const [maxLength, setMaxLength] = useState(7);
    const [useTimer, setUseTimer] = useState(false);
    const [timerCount, setTimerCount] = useState(15);

    const handleWordCount = (event: { target: { value: SetStateAction<number>; }; }) => {
        setWordCount(event.target.value);
    }
    const handleMinLength = (event: { target: { value: SetStateAction<number>; }; }) => {
        setWordCount(event.target.value);
    }
    const handleMaxLength = (event: { target: { value: SetStateAction<number>; }; }) => {
        setWordCount(event.target.value);
    }

    const handleTimerCount = (event: { target: { value: SetStateAction<number>; }; }) => {
        setWordCount(event.target.value);
    }

    useEffect(() => {
        if (useTimer) {
            console.log("Timer is on")
        } else if (!useTimer) {
            console.log("Timer is off")
        }
    })

    return (
    <div className="flex w-[60rem] items-start justify-start p-4">
        <Button onClick={() => {setUseTimer(!useTimer)}} className="mt-4">
            Timer
        </Button>
        <Button  className="m-4">
            Word Count
        </Button>
        <Button className="m-4">
            Min Length
        </Button>
        <Button className="m-4">
            Max Length
        </Button>
        
    </div>

    )
}