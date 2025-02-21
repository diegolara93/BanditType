'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { generate } from 'random-words';
import axios from 'axios';
import { auth } from '@/utils/firebase';

const updateWPM = async (wpm: number, username: string) => {
    try {
    const resp = await axios.post(`http://127.0.0.1:8000/users/${username}/wpm?wpm=${wpm}`);
    console.log("Updated wpm", resp);
    } catch (error) {
        console.error("Failed to update wpm", error);
    }
}

const getUsername = async(uid: string) => {
    try {
        const resp = await axios.get(`http://127.0.0.1:8000/users/${uid}/username`);
        /*
            Without returning the .slice(1, -1) the username is returned with quotes which messes with the post request
            do not remove!
        */ 
        let username =JSON.stringify(resp.data).slice(1, -1);
        console.log("got name", username);
        return username;
        } catch (error) {
            console.error("Failed to get username", error);
        }
}

export default function Typer() {
    const [textToType, setTextToType] = useState('');
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);

    useEffect(() => {
        const generatedText = generate({
            minLength: 3,
            maxLength: 7,
            exactly: 10,
            join: ' ',
        });
        setTextToType(generatedText);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!textToType || endTime !== null) return;

            if (!startTime && e.key.length === 1) {
                setStartTime(Date.now());
            }

            if (e.key === 'Backspace') {
                setInput((prev) => prev.slice(0, -1));
            } else if (e.key.length === 1) {
                if (input.length >= textToType.length) return;
                setInput((prev) => prev + e.key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [input, startTime, endTime, textToType]);

    useEffect(() => {
        if (textToType && input.length === textToType.length && endTime === null) {
            setEndTime(Date.now());
        }
    }, [input, endTime, textToType]);

    useEffect(() => {
        if (textToType && input.length === textToType.length && endTime !== null) {
            const wpm = getWPM();
            let uid = auth.currentUser?.uid
            if (!uid) {
                console.log("No user logged in")
                return;
            }
            getUsername(uid).then(username => {
                if (username) {
                    updateWPM(wpm, username);
                }
            });
        }
    })

    const getWPM = () => {
        if (!startTime || !endTime) return 0;
        const timeMinutes = (endTime - startTime) / 60000;
        const wordCount = textToType.split(' ').length;
        return Math.round(wordCount / timeMinutes);
    };

    const resetGame = () => {
        setInput('');
        setStartTime(null);
        setEndTime(null);
        const text = generate({
            minLength: 3,
            maxLength: 7,
            exactly: 10,
            join: ' ',
        });
        setTextToType(text);
    };

    if (!textToType) {
        return <div>Loading</div>;
    }

    return (
        <div className="flex flex-col w-[60rem] items-center justify-center p-4">
            <div className="text-2xl text-[#cdd6f4] font-bold mb-4 select-none">
                {textToType.split('').map((char, index) => {
                    let spanClass = 'px-0.5';
                    if (index < input.length) {
                        spanClass +=
                            char === input[index]
                                ? ' text-[#a6e3a1]'
                                : ' bg-red-300 bg-opacity-50';
                    } else if (index === input.length) {
                        // cursor
                        spanClass += ' border-l-2 border-gray-500 animate-pulse';
                    }
                    return (
                        <span key={index} className={spanClass}>
              {char}
            </span>
                    );
                })}
            </div> 
            {endTime && (
                <div  className="mt-4 flex flex-col items-center">
                    <p className="text-xl">Finished! WPM: {getWPM()}</p>
                    
                    <Button onClick={resetGame} className="mt-2">
                        Restart
                    </Button>
                </div>
            )}
        </div>
    );
}
