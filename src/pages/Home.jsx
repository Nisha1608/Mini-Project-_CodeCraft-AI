import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Home = () => {

  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});


  async function getResponse() {
    if (!prompt.trim()) return toast.error("Please describe your component first");

    try {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
        Generate UI for: ${prompt}
        Framework: ${frameWork.value}
        Return ONLY code.
      `,
      });

      setCode(extractCode(response.text));
      setOutputScreen(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  };

  const downnloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <>
      <Navbar />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16">

        {/* LEFT */}
        <div className="w-full py-6 rounded-xl bg-[#141319] mt-5 p-5">
          
          {/* 🔥 Teal Title */}
          <h3 className='text-[25px] font-semibold sp-text text-teal-400'>
          UI By AI
          </h3>

          <p className='text-gray-400 mt-2 text-[16px]'>
            Describe your component and let AI code it for you.
          </p>

          <p className='text-[15px] font-[700] mt-4'>Framework</p>

          <Select
            className='mt-2 text-black'
            options={options}
            value={frameWork}
            onChange={(selected) => setFrameWork(selected)}
          />

          <p className='text-[15px] font-[700] mt-5'>
            AI-powered tool to craft clean React UI components instantly.
          </p>

          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className='w-full min-h-[200px] rounded-xl bg-[#09090B] mt-3 p-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-500 resize-none'
            placeholder="Describe your component in detail and AI will generate it..."
          ></textarea>

          <div className="flex items-center justify-between mt-3">
            <p className='text-gray-400 text-sm'>Click on generate button to get your code</p>

            {/* Teal Generate Button */}
            <button
              onClick={getResponse}
              className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-teal-400 to-teal-600 px-5 gap-2 transition-all hover:opacity-80 hover:scale-105 active:scale-95"
            >
              {loading ? <ClipLoader color='white' size={18} /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative mt-2 w-full h-[80vh] bg-[#141319] rounded-xl overflow-hidden">

          {!outputScreen ? (
            <div className="w-full h-full flex items-center flex-col justify-center">

              {/* Teal icon circle */}
              <div className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full bg-gradient-to-r from-teal-400 to-teal-600">
                <HiOutlineCode />
              </div>

              <p className='text-[16px] text-gray-400 mt-3'>
                Your component & code will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* TABS */}
              <div className="bg-[#17171C] w-full h-[50px] flex items-center gap-3 px-3">

                <button
                  onClick={() => setTab(1)}
                  className={`w-1/2 py-2 rounded-lg transition-all ${tab === 1 ? "bg-teal-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                >
                  {/* 🔥 Teal “Code” label */}
                  <span className="text-teal-300">Code</span>
                </button>

                <button
  onClick={() => setTab(2)}
  className={`w-1/2 py-2 rounded-lg transition-all ${tab === 2 ? "bg-teal-600 text-white" : "bg-zinc-800 text-gray-300"}`}
>
  <span className="text-teal-300">Preview</span>
</button>

              </div>

              {/* TOOLBAR */}
              <div className="bg-[#17171C] w-full h-[50px] flex items-center justify-between px-4">
                <p className='font-bold text-gray-200'>Code Editor</p>

                <div className="flex items-center gap-2">
                  {tab === 1 ? (
                    <>
                      <button onClick={copyCode} className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><IoCopy /></button>
                      <button onClick={downnloadFile} className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><PiExportBold /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setIsNewTabOpen(true)} className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><ImNewTab /></button>
                      <button onClick={() => setRefreshKey(prev => prev + 1)} className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><FiRefreshCcw /></button>
                    </>
                  )}
                </div>
              </div>

              <div className="h-full">
                {tab === 1 ? (
                  <Editor value={code} height="100%" theme='vs-dark' language="html" />
                ) : (
                  <iframe key={refreshKey} srcDoc={code} className="w-full h-full bg-white text-black"></iframe>
                )}
              </div>
            </>
          )}

        </div>
      </div>

      {isNewTabOpen && (
        <div className="absolute inset-0 bg-white w-screen h-screen overflow-auto">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100">
            <p className='font-bold'>Preview</p>
            <button onClick={() => setIsNewTabOpen(false)} className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-200">
              <IoCloseSharp />
            </button>
          </div>
          <iframe srcDoc={code} className="w-full h-[calc(100vh-60px)]"></iframe>
        </div>
      )}
    </>
  )
}

export default Home
