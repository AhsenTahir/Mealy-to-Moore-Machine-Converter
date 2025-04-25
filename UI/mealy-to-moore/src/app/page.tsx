"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

// Define types for the state
type Transition = {
  from: string;
  to: string;
  input: string;
  output: string;
};

type MooreState = {
  name: string;
  output: number;
};

type MachineData = {
  states: string[];
  transitions: Transition[];
};

type MooreMachineData = {
  moore_states: MooreState[];
  transitions: { [key: string]: string[] };
  inputs_per_state: number;
};

type ConversionResult = {
  original: MachineData;
  converted: MooreMachineData;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !uploadedImage)) return;

    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:8000/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_text: input
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      // You might want to add error state handling here
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="w-full max-w-5xl flex flex-col items-center space-y-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Mealy to Moore Converter
          </h1>
          <p className="mt-4 text-gray-300 max-w-2xl">
            Convert Mealy machines to Moore machines with a modern, interactive tool.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-3xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Text Input */}
            <div className="relative backdrop-blur-sm bg-white/5 rounded-lg shadow-2xl border border-gray-700 p-1">
              <div className="flex items-start">
                <div className="p-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter Mealy machine description or paste transition table..."
                  className="flex-1 h-48 p-4 bg-transparent outline-none text-white resize-none"
                />
              </div>
              <div className="absolute inset-0 rounded-lg pointer-events-none" style={{
                background: "linear-gradient(145deg, rgba(168, 85, 247, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)",
                zIndex: -1
              }}></div>
            </div>

            {/* OR Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="flex-shrink mx-4 text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>

            {/* Image Upload */}
            <div className="relative backdrop-blur-sm bg-white/5 rounded-lg shadow-2xl border border-gray-700 p-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Uploaded Mealy machine" 
                    className="max-h-64 mx-auto rounded-md object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div 
                  onClick={handleUploadClick}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-4 text-gray-300">Upload image of Mealy machine</p>
                  <p className="mt-2 text-sm text-gray-400">Supports PNG, JPG, JPEG, GIF</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isProcessing || (!input.trim() && !uploadedImage)}
                className={`px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 font-medium text-white 
                  ${(isProcessing || (!input.trim() && !uploadedImage)) ? 'opacity-70 cursor-not-allowed' : 'hover:from-purple-600 hover:to-blue-600'}`}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Converting...
                  </div>
                ) : "Convert"}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Results Area */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-8"
          >
            <div className="grid grid-cols-1 gap-8">
              {/* Mealy Machine Table */}
              <div className="backdrop-blur-sm bg-white/5 rounded-lg shadow-lg border border-gray-700 p-6">
                <h2 className="text-xl font-bold mb-4 text-purple-400">Mealy Machine</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2">State</th>
                        {Array.from({ length: result.original.transitions.length / result.original.states.length }, (_, i) => (
                          <>
                            <th className="text-left p-2" key={`at_${i}`}>At_{i}</th>
                            <th className="text-left p-2" key={`output_${i}`}>Output_{i}</th>
                          </>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.original.states.map((state) => (
                        <tr key={state} className="border-b border-gray-700/50">
                          <td className="p-2">{state}</td>
                          {result.original.transitions
                            .filter(t => t.from === state)
                            .map((transition, i) => (
                              <>
                                <td className="p-2" key={`to_${i}`}>{transition.to}</td>
                                <td className="p-2" key={`out_${i}`}>{transition.output}</td>
                              </>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Moore Machine Table */}
              <div className="backdrop-blur-sm bg-white/5 rounded-lg shadow-lg border border-gray-700 p-6">
                <h2 className="text-xl font-bold mb-4 text-blue-400">Moore Machine</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2">State</th>
                        {Array.from({ length: result.converted.inputs_per_state }, (_, i) => (
                          <th className="text-left p-2" key={`input_${i}`}>On Input {i}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.converted.moore_states.map((state) => (
                        <tr key={state.name} className="border-b border-gray-700/50">
                          <td className="p-2">{state.name}</td>
                          {result.converted.transitions[state.name].map((transition, i) => (
                            <td className="p-2" key={`transition_${i}`}>{transition}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 text-sm text-gray-400">
        Mealy to Moore Converter | Created with Next.js
      </div>
    </main>
  );
}
