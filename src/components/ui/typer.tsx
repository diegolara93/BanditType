'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { generate } from 'random-words';
import axios from 'axios';
import { auth } from '@/utils/firebase';
import { ChevronsRight, ChevronsLeft } from 'lucide-react';

const updateWPM = async (wpm: number, username: string) => {
  try {
    const resp = await axios.post(
      `http://127.0.0.1:8000/users/${username}/wpm?wpm=${wpm}`
    );
    console.log("Updated wpm", resp);
  } catch (error) {
    console.error("Failed to update wpm", error);
  }
};

const getUsername = async (uid: string) => {
  try {
    const resp = await axios.get(`http://127.0.0.1:8000/users/${uid}/username`);
    // Without returning the .slice(1, -1) the username is returned with quotes which messes with the post request
    let username = JSON.stringify(resp.data).slice(1, -1);
    console.log("got name", username);
    return username;
  } catch (error) {
    console.error("Failed to get username", error);
  }
};

export default function Typer() {
  const [textToType, setTextToType] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const [wordCount, setWordCount] = useState(10);
  const [minLength, setMinLength] = useState(3);
  const [maxLength, setMaxLength] = useState(7);

  const generateNewText = () => {
    const generatedText = generate({
      minLength: minLength,
      maxLength: maxLength,
      exactly: wordCount,
      join: ' ',
    });
    setTextToType(generatedText);
  };

  const resetGame = () => {
    setInput('');
    setStartTime(null);
    setEndTime(null);
    generateNewText();
  };

  useEffect(() => {
    generateNewText();
  }, []);
  useEffect(() => {
    resetGame();
  }, [wordCount, minLength, maxLength]);


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
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.log("No user logged in");
        return;
      }
      getUsername(uid).then(username => {
        if (username) {
          updateWPM(wpm, username);
        }
      });
    }
  }, [input, endTime, textToType]);

  const getWPM = () => {
    if (!startTime || !endTime) return 0;
    const timeMinutes = (endTime - startTime) / 60000;
    const wordCountText = textToType.split(' ').length;
    return Math.round(wordCountText / timeMinutes);
  };

  if (!textToType) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex flex-col w-[60rem] items-center justify-center p-4 space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-[#1e1e2e] border border-[#313244] rounded shadow-sm">

        <div className="flex flex-col items-center">
          <label className="text-[#cdd6f4] text-sm">Word Count</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setWordCount(prev => Math.max(10, prev - 10))}
              disabled={wordCount <= 10}
              className="p-1  rounded text-[#cdd6f4] hover:bg-[#313244]"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <span className="text-[#cdd6f4]">{wordCount}</span>
            <button
              onClick={() => setWordCount(prev => Math.min(50, prev + 10))}
              disabled={wordCount >= 50}
              className="p-1  rounded text-[#cdd6f4] hover:bg-[#313244]"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <label className="text-[#cdd6f4] text-sm">Min Length</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMinLength(prev => Math.max(3, prev - 1))}
              disabled={minLength <= 3}
              className="p-1  rounded text-[#cdd6f4] hover:bg-[#313244]"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <span className="text-[#cdd6f4]">{minLength}</span>
            <button
              onClick={() => setMinLength(prev => Math.min(6, prev + 1))}
              disabled={minLength >= 6}
              className="p-1  rounded text-[#cdd6f4] hover:bg-[#313244]"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <label className="text-[#cdd6f4] text-sm">Max Length</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMaxLength(prev => Math.max(7, prev - 1))}
              disabled={maxLength <= 7}
              className="p-1  rounded text-[#cdd6f4] hover:bg-[#313244]"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <span className="text-[#cdd6f4]">{maxLength}</span>
            <button
              onClick={() => setMaxLength(prev => Math.min(15, prev + 1))}
              disabled={maxLength >= 15}
              className="p-1 rounded text-[#cdd6f4] hover:bg-[#313244]"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>


      <div className="text-2xl text-[#cdd6f4] font-bold select-none">
        {textToType.split('').map((char, index) => {
          let spanClass = 'px-0.5';
          if (index < input.length) {
            spanClass +=
              char === input[index]
                ? ' text-[#a6e3a1]'
                : ' bg-red-300 bg-opacity-50';
          } else if (index === input.length) {
            // Cursor 
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
          <p className="text-xl text-[#a6adc8]">Finished! WPM: {getWPM()}</p>
          <Button onClick={resetGame} className="mt-2 bg-[#11111b]">
            Restart
          </Button>
        </div>
      )}
    </div>
  );
}
