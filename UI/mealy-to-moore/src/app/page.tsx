"use client";

import { useState } from "react";
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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_text: input.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to convert machine. Please check your input and try again.');
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

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isProcessing || !input.trim()}
                className={`px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 font-medium text-white 
                  ${(isProcessing || !input.trim()) ? 'opacity-70 cursor-not-allowed' : 'hover:from-purple-600 hover:to-blue-600'}`}
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

        {/* Error display */}
        {error && (
          <div className="w-full max-w-3xl mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

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
        Mealy to Moore Converter | UI designed by @mustafahk27
      </div>
    </main>
  );
}
