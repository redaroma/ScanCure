
import React, { useState, useCallback } from 'react';
import { ScanScreen } from './components/ScanScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { Disclaimer } from './components/Disclaimer';
import { AnalysisResult, AppState, Scan } from './types';
import { analyzeIngredientsFromImage } from './services/geminiService';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SCAN);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<Scan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleScan = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setAppState(AppState.RESULTS);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = (reader.result as string).split(',')[1];
      setImagePreview(reader.result as string);
      
      try {
        const result = await analyzeIngredientsFromImage(base64data, file.type);
        setAnalysisResult(result);
        if (result) {
           setHistory(prev => [...prev, { id: Date.now(), image: reader.result as string, result}]);
        }
      } catch (e) {
        console.error(e);
        setError('We had trouble analyzing this image. Please try another one. 💛');
        setAppState(AppState.SCAN);
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
        console.error("Error reading file");
        setError("Could not read the image file. Please try again.");
        setIsLoading(false);
        setAppState(AppState.SCAN);
    };
  }, []);

  const handleNewScan = () => {
    setAppState(AppState.SCAN);
    setAnalysisResult(null);
    setError(null);
    setImagePreview(null);
  };
  
  const handleViewHistory = () => {
    setAppState(AppState.HISTORY);
  };

  const handleScanFromHistory = (scan: Scan) => {
    setImagePreview(scan.image);
    setAnalysisResult(scan.result);
    setAppState(AppState.RESULTS);
  }

  const renderContent = () => {
    switch (appState) {
      case AppState.HISTORY:
        return <HistoryScreen history={history} onScanSelect={handleScanFromHistory} onNewScan={handleNewScan} />;
      case AppState.RESULTS:
        return (
          <>
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-center text-red-500 my-4">{error}</p>}
            {analysisResult && <ResultsScreen result={analysisResult} imagePreview={imagePreview} onNewScan={handleNewScan} />}
          </>
        );
      case AppState.SCAN:
      default:
        return <ScanScreen onScan={handleScan} error={error}/>;
    }
  };

  return (
    <div className="min-h-screen bg-mama-white text-gray-800 font-sans">
      <div className="container mx-auto max-w-2xl p-4 sm:p-6">
        <Header onNewScan={handleNewScan} onViewHistory={handleViewHistory} currentView={appState} />
        <main className="mt-6">
          {renderContent()}
        </main>
        <Disclaimer />
      </div>
    </div>
  );
};

export default App;
