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
      
        <div className="bg-black/20 shadow-[0_40px_20px_-10px] shadow-purple-200/30 rounded-2xl p-8 border border-[#2A2A35]">
          <div className="flex items-center mb-6">
            <div className="mr-3 p-2 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <FileText className="h-6 w-6 text-purple-400"/>
            </div>
          </div>

          <div className="max-w-none px-6 py-5 rounded-xl bg-[#0f0f13] border border-[#2A2A35]">
            <pre className="whitespace-pre-wrap text-purple-100 text-sm leading-relaxed">
              {summary}
            </pre>

          </div>
        </div>



      )}
    </div>
  )
}

export default DashboardContent;
