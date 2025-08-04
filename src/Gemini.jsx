import React, { useState, useEffect } from 'react'
import axios from 'axios'
const Gemini = () => {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [chatHistory, setChatHistory] = useState([]);
    useEffect(() => {
        const savedChats = localStorage.getItem('chatHistory');
        if (savedChats) {
            setChatHistory(JSON.parse(savedChats));
        }
    }, []);

    const URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD3NKstEU2ON7IbxBkJV7OhdFDP-xQUwJI';
    const payLoad =
    {
        "contents": [
            {
                "parts": [
                    {
                        "text": question
                    }
                ]
            }
        ]
    }

    const handleSubmit = async (e) => {
        setChatHistory(prev => [...prev, { sender: 'user', text: question }]);
        localStorage.setItem('chatHistory', JSON.stringify([...chatHistory, { sender: 'user', text: question }]));
        try {
            const res = await axios.post(URL, payLoad, {
                headers: {
                    'Content-Type': 'application/json',
                },

            });
            const text = res.data.candidates[0].content.parts[0].text;
            setChatHistory(prev => [...prev, { sender: 'gemini', text }]);
            localStorage.setItem('chatHistory', JSON.stringify([...chatHistory, { sender: 'gemini', text }]));
            console.log('Response from Gemini:', res.data.candidates[0].content.parts[0].text
            );
        } catch (err) {
            console.error('Error:', err);
        }
        setQuestion('');
    };

    return (
        <div className='grid grid-cols-5 text-center' >
            <div className='col-span-1 bg-zinc-800 h-screen'>
                <h1 className='text-white m-auto p-3'>Recent Searches</h1>
                <div className='text-white p-2 max-h-[450px] overflow-y-auto bg-zinc-700 rounded-lg'>
                    {chatHistory[0]?.text}
                </div>
            </div>
            <div className='col-span-4 bg-zinc-900 h-screen'>
                <div className='flex flex-col gap-4 mt-6  h-[450px] overflow-y-auto p-2  rounded-lg'>
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender === 'user' ? 'bg-gray-700 text-white  self-end' : 'bg-zinc-500 text-black  self-start'} p-2 m-2 rounded-lg`}>
                            <p> {msg.text}</p>
                        </div>
                    ))}

                </div>
                <div className='flex w-1/2 bg-zinc-800 m-auto p-1 border  rounded-4xl border-zinc-400 '>
                    <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className=' outline-none text-white w-full h-full p-3' placeholder='Ask Me Anything' />
                    <button onClick={handleSubmit} className=' rounded-2xl p-1 text-white'>Ask</button>
                </div>
            </div>
        </div>
    )
}

export default Gemini
