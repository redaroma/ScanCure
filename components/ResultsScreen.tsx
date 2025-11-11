import React from 'react';
import { AnalysisResult, IngredientSafety, SafetyRating } from '../types';

const SafetyIcon: React.FC<{ rating: SafetyRating }> = ({ rating }) => {
  switch (rating) {
    case SafetyRating.Safe:
      return <span className="text-2xl">✅</span>;
    case SafetyRating.Caution:
      return <span className="text-2xl">⚠️</span>;
    case SafetyRating.Unsafe:
      return <span className="text-2xl">❌</span>;
    default:
      return <span className="text-2xl">❔</span>;
  }
};

const getRatingColors = (rating: SafetyRating) => {
  switch (rating) {
    case SafetyRating.Safe:
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-400',
      };
    case SafetyRating.Caution:
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-400',
      };
    case SafetyRating.Unsafe:
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-400',
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-400',
      };
  }
};

const AmazonLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

const IngredientCard: React.FC<{ ingredient: IngredientSafety }> = ({ ingredient }) => {
    const { bg, text } = getRatingColors(ingredient.safety);
    return (
        <div className="p-4 bg-white rounded-lg border border-gray-200 mb-3">
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-800">{ingredient.name}</h4>
                <div className={`px-3 py-1 text-xs font-bold rounded-full ${bg} ${text}`}>
                    {ingredient.safety}
                </div>
            </div>
            <p className="mt-2 text-sm text-mama-gray">{ingredient.explanation}</p>
            {ingredient.alternatives && ingredient.alternatives.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Safer Product Ideas:</h5>
                    <div className="space-y-2">
                        {ingredient.alternatives.map((alt, index) => (
                             <a 
                                key={index} 
                                href={`https://www.amazon.com/s?k=${encodeURIComponent(alt.productName)}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block p-3 rounded-lg bg-mama-light-gray hover:bg-gray-200/70 transition-colors group"
                            >
                                <p className="font-semibold text-mama-teal text-sm group-hover:underline">
                                    {alt.productName}
                                    <AmazonLinkIcon />
                                </p>
                                <p className="text-xs text-mama-gray mt-1">{alt.reason}</p>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export const ResultsScreen: React.FC<{ result: AnalysisResult; imagePreview: string | null; onNewScan: () => void; }> = ({ result, imagePreview, onNewScan }) => {
  const { bg, text, border } = getRatingColors(result.overallSafety);
  
  return (
    <div className="space-y-6">
        <div className={`p-6 rounded-2xl border ${border} ${bg} ${text} text-center`}>
            <div className="flex justify-center items-center gap-4">
                <SafetyIcon rating={result.overallSafety} />
                <h2 className="text-3xl font-bold">{result.overallSafety} for Pregnancy</h2>
            </div>
            <p className="mt-4 max-w-xl mx-auto">{result.summary}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
                 {imagePreview && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Your Scan</h3>
                        <img src={imagePreview} alt="Scanned ingredients" className="rounded-lg w-full object-cover" />
                    </div>
                 )}
                  <button
                    onClick={onNewScan}
                    className="mt-4 w-full bg-mama-teal text-white font-bold py-3 px-6 rounded-full hover:bg-teal-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mama-teal"
                >
                    Scan Another Product
                </button>
            </div>
            <div className="md:w-2/3">
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Ingredient Breakdown</h3>
                    <div className="max-h-[400px] overflow-y-auto pr-2">
                        {result.ingredients.length > 0 ? (
                            result.ingredients.map((ing, index) => <IngredientCard key={index} ingredient={ing} />)
                        ) : (
                            <p className="text-mama-gray text-center py-8">No ingredients were identified in the image.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
};