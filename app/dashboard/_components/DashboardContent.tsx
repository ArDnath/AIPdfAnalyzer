"use client"

import {useState, useCallback, useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import { extractAction } from "../extract/actions.ts";
import {
  CheckCircle,
  FileText,
  AlertCircle,
  Loader
} from "lucide-react";

// Function to format the summary with beautiful styling
const formatSummary = (summary: string) => {
  if (!summary) return null;

  const lines = summary.split('\n');
  const elements: JSX.Element[] = [];
  let key = 0;
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ').trim();
      if (text) {
        elements.push(
          <p key={key++} className="text-gray-200 leading-relaxed mb-4 text-sm hover:text-gray-100 transition-colors duration-200">
            {text}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Empty line - flush current paragraph
    if (!line) {
      flushParagraph();
      continue;
    }

    // Main heading (#Document Overview)
    if (line.match(/^#\s*Document Overview/i)) {
      flushParagraph();
      elements.push(
        <h1 key={key++} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 mt-6 first:mt-0 hover:from-blue-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300 cursor-default">
          📄 Document Overview
        </h1>
      );
    }
    // Sub headings
    else if (line.match(/^##\s*Main Insights/i)) {
      flushParagraph();
      elements.push(
        <h2 key={key++} className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-3 mt-5 hover:from-green-300 hover:to-emerald-300 transition-all duration-300 cursor-default">
          💡 Main Insights
        </h2>
      );
    }
    else if (line.match(/^##\s*Critical Analysis/i)) {
      flushParagraph();
      elements.push(
        <h2 key={key++} className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-3 mt-5 hover:from-orange-300 hover:to-red-300 transition-all duration-300 cursor-default">
          🔍 Critical Analysis
        </h2>
      );
    }
    else if (line.match(/^##\s*Conclusion/i)) {
      flushParagraph();
      elements.push(
        <h2 key={key++} className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3 mt-5 hover:from-purple-300 hover:to-pink-300 transition-all duration-300 cursor-default">
          🎯 Conclusion
        </h2>
      );
    }
    // Regular text - add to current paragraph
    else {
      currentParagraph.push(line);
    }
  }

  // Flush any remaining paragraph
  flushParagraph();

  return <div className="space-y-1">{elements}</div>;
};

const DashboardContent = ()=>{

  const [selectedFile, setSelectedFile] = useState<File | null> (null);
  const [summary, setSummary] = useState('');
  const [ isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const SearchParams = useSearchParams();
  const router = useRouter();

  useEffect(()=>{
    const isPaymentSuccess = SearchParams?.get("payment")=== "success";

    if(isPaymentSuccess){
      setShowPaymentSuccess(true);
      router.replace("/dashboard");

      const timer = setTimeout(() =>{
        setShowPaymentSuccess(false);
      },5000);

      return () => clearTimeout(timer);
    }
  }, [SearchParams, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setError("")

    if(!e.target.files?.[0]) return

    setSelectedFile(e.target.files[0])
  }

  const handleAnalyze = useCallback(async ()=>{
    if(!selectedFile){
      setError("Please select a file before analyzing.")
      return
    }

    setIsLoading(true)
    setError('')
    setSummary('')

    try{
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Extract text from PDF
      const extractResult = await extractAction(formData);
      console.log("Extracted text:", extractResult);

      if (!extractResult.text) {
        setError("No text could be extracted from the PDF.");
        return;
      }

      // Send extracted text to analyze API
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: extractResult.text.substring(0,10000) }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed: ${analyzeResponse.statusText}`);
      }

      const analysisResult = await analyzeResponse.json();
      setSummary(analysisResult.summary || "No analysis available.");
    }
    catch(err){
      setError(err  instanceof Error ? err.message : "Failed to analyze PDF.")
    }
    finally{
      setIsLoading(false)
    }
  },[selectedFile])

  return (
    <div className="space-y-10 mt-30 max-w-4xl mx-auto">
      {showPaymentSuccess && (
        <div className="flex items-center gap-2 justify-center max-w-xl mx-auto border my-8 bg-green-500/10 border-green-500/20  rounded-xl p-4 text-green-400">
          <CheckCircle className="h-5 w-5 " />
          <p>Payment successful! Your subscription is now active!</p>
        </div>
      )}
      <div className="p-10 rounded-2xl border border-purple-500/20 bg-black/40 shadow-[0_4px_20px_-10px] shadow-purple-500/30">
        <div className="relative space-y-4">
          <div className="flex items-center gap-2 text-purple-200">
            <FileText className="w-5 h-5" />
            <span className="text-sm">Supported format: PDF</span>
          </div>

        <div>
      <input
        type="file"
        accept=".pdf"
        onChange = {handleFileChange}
        className="block w-full text-purple-100 rounded-xl px-3 py-2 border border-purple-500/30 bg-black/60 
                   file:mr-4 file:py-2 file:px-4 
                   file:rounded-lg file:border-0 
                   file:text-sm file:font-semibold 
                   file:bg-purple-600 file:text-white 
                   hover:file:bg-purple-700 
                   transition-colors duration-200"
      />
    </div>

  </div>

        <button 
          className="mt-4 w-full rounded-xl px-4 py-3 font-semibold text-white 
             bg-gradient-to-r from-purple-500 via-pink-500 to-purple-900
             border border-purple-500 shadow-lg shadow-purple-500/20
             transition-all duration-500 ease-in-out
             hover:scale-[1.02] hover:shadow-purple-500/40
             hover:from-purple-600 hover:via-pink-600 hover:to-purple-700"
          onClick={handleAnalyze}
          disabled ={!selectedFile || isLoading}
          >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Document...
            </>
          ) : (
            'Analyze Document'
          )}
        </button>
</div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400">
          <div className="flex items-center">
            <AlertCircle className="h-5 mr-2 mt-0.5"/>
            <div>
              <p className="font-medium mb-1">Error analyzing Document</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {summary &&(
        <div className="bg-gradient-to-br from-black/30 via-purple-900/10 to-black/30 backdrop-blur-sm shadow-[0_40px_20px_-10px] shadow-purple-200/30 rounded-2xl p-8 border border-purple-500/20 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
          <div className="flex items-center mb-6">
            <div className="mr-3 p-3 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/30 animate-pulse">
              <FileText className="h-6 w-6 text-purple-300"/>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                Document Analysis
              </h3>
              <p className="text-xs text-gray-400">AI-powered insights and summary</p>
            </div>
          </div>

          <div className="max-w-none px-6 py-6 rounded-xl bg-gradient-to-br from-[#0f0f13] to-[#1a1a1f] border border-purple-500/10 shadow-inner">
            <div className="prose prose-invert max-w-none">
              {formatSummary(summary)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardContent;
