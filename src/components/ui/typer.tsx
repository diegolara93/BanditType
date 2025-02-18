'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { generate } from 'random-words';

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
        <div className="flex flex-col items-center justify-center p-4">
            <div className="text-lg text-[#cdd6f4] font-bold mb-4 select-none">
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
                <div className="mt-4 flex flex-col items-center">
                    <p className="text-xl">Finished! WPM: {getWPM()}</p>
                    <Button onClick={resetGame} className="mt-2">
                        Restart
                    </Button>
                </div>
            )}
        </div>
    );
}
