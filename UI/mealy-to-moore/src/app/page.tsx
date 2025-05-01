"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import React from "react";

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

type MealyMachineData = {
  states: string[];
  transitions: Transition[];
};

type MooreMachineData = {
  states: Array<{ name: string; output: number }>;
  transitions: { [key: string]: string[] };
  inputs_per_state: number;
};

type ConversionType = "mealy-to-moore" | "moore-to-mealy";

type ConversionResult = {
  original: MealyMachineData | MooreMachineData;
  converted: MooreMachineData | MealyMachineData;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conversionType, setConversionType] = useState<ConversionType>("mealy-to-moore");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      console.log('Sending request to:', `http://localhost:8000/${conversionType}`);
      console.log('Input data:', input.trim());
      
      const response = await fetch(`http://localhost:8000/${conversionType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          input_text: input.trim()
        }),
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error(`Server error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('Received data:', {
        conversionType,
        original: data.original,
        converted: data.converted
      });
      
      if (conversionType === 'moore-to-mealy') {
        console.log('Moore machine data:', {
          states: data.original.states,
          transitions: data.original.transitions,
          inputs_per_state: data.original.inputs_per_state
        });
      }
      
      setResult(data);
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert machine. Please check your input and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getInputPlaceholder = () => {
    if (conversionType === "mealy-to-moore") {
      return "Enter Mealy machine description (each line: next_state output for each input)...";
    }
    return "Enter Moore machine description (first line: outputs for each state, following lines: next states for each input)...";
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
            FSM Converter
          </h1>
          <p className="mt-4 text-gray-300 max-w-2xl">
            Convert between Mealy and Moore machines with a modern, interactive tool.
          </p>
        </motion.div>

        {/* Conversion Type Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-3xl"
        >
          <div className="flex justify-center mb-8">
            <div className="relative inline-block">
              <select
                value={conversionType}
                onChange={(e) => {
                  setConversionType(e.target.value as ConversionType);
                  setResult(null);
                  setInput("");
                }}
                className="appearance-none bg-white/10 border border-gray-700 rounded-lg px-6 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              >
                <option value="mealy-to-moore">Mealy to Moore</option>
                <option value="moore-to-mealy">Moore to Mealy</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
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
                  placeholder={getInputPlaceholder()}
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
              {/* Original Machine Table */}
              <div className="backdrop-blur-sm bg-white/5 rounded-lg shadow-lg border border-gray-700 p-6">
                <h2 className="text-xl font-bold mb-4 text-purple-400">
                  {conversionType === "mealy-to-moore" ? "Mealy Machine" : "Moore Machine"}
                </h2>
                <div className="overflow-x-auto">
                  {conversionType === "mealy-to-moore" ? (
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-2">State</th>
                          {Array.from({ length: ((result?.original as MealyMachineData)?.transitions?.length || 0) / ((result?.original as MealyMachineData)?.states?.length || 1) }, (_, i) => (
                            <React.Fragment key={i}>
                              <th className="text-left p-2">At_{i}</th>
                              <th className="text-left p-2">Output_{i}</th>
                            </React.Fragment>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {((result?.original as MealyMachineData)?.states || []).map((state) => (
                          <tr key={state} className="border-b border-gray-700/50">
                            <td className="p-2">{state}</td>
                            {((result?.original as MealyMachineData)?.transitions || [])
                              .filter(t => t.from === state)
                              .map((transition, i) => (
                                <React.Fragment key={i}>
                                  <td className="p-2">{transition.to}</td>
                                  <td className="p-2">{transition.output}</td>
                                </React.Fragment>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-2">State</th>
                          <th className="text-left p-2">Output</th>
                          {Array.from({ length: (result?.original as MooreMachineData)?.inputs_per_state || 0 }, (_, i) => (
                            <th className="text-left p-2" key={`input_${i}`}>On Input {i}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {((result?.original as MooreMachineData)?.states || []).map((state) => (
                          <tr key={state.name} className="border-b border-gray-700/50">
                            <td className="p-2">{state.name}</td>
                            <td className="p-2">{state.output}</td>
                            {((result?.original as MooreMachineData)?.transitions?.[state.name] || []).map((transition, i) => (
                              <td className="p-2" key={`transition_${i}`}>{transition}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Converted Machine Table */}
              <div className="backdrop-blur-sm bg-white/5 rounded-lg shadow-lg border border-gray-700 p-6">
                <h2 className="text-xl font-bold mb-4 text-blue-400">
                  {conversionType === "mealy-to-moore" ? "Moore Machine" : "Mealy Machine"}
                </h2>
                <div className="overflow-x-auto">
                  {conversionType === "mealy-to-moore" ? (
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-2">State</th>
                          {Array.from({ length: (result?.converted as MooreMachineData)?.inputs_per_state || 0 }, (_, i) => (
                            <th className="text-left p-2" key={`input_${i}`}>On Input {i}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {((result?.converted as MooreMachineData)?.states || []).map((state) => (
                          <tr key={state.name} className="border-b border-gray-700/50">
                            <td className="p-2">{state.name}</td>
                            {((result?.converted as MooreMachineData)?.transitions[state.name] || []).map((transition, i) => (
                              <td className="p-2" key={`transition_${i}`}>{transition}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-2">State</th>
                          {Array.from({ length: ((result?.converted as MealyMachineData)?.transitions?.length || 0) / ((result?.converted as MealyMachineData)?.states?.length || 1) }, (_, i) => (
                            <React.Fragment key={i}>
                              <th className="text-left p-2">At_{i}</th>
                              <th className="text-left p-2">Output_{i}</th>
                            </React.Fragment>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {((result?.converted as MealyMachineData)?.states || []).map((state) => (
                          <tr key={state} className="border-b border-gray-700/50">
                            <td className="p-2">{state}</td>
                            {((result?.converted as MealyMachineData)?.transitions || [])
                              .filter(t => t.from === state)
                              .map((transition, i) => (
                                <React.Fragment key={i}>
                                  <td className="p-2">{transition.to}</td>
                                  <td className="p-2">{transition.output}</td>
                                </React.Fragment>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 text-sm text-gray-400">
        FSM Converter | UI designed by @mustafahk27
      </div>
    </main>
  );
}
