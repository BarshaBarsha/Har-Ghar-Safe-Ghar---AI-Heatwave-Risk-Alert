import React, { useState } from 'react';
import {
  X,
  Cpu,
  Code2,
  Copy,
  Check,
  GitBranch,
  Layers,
  ArrowRight,
  Server,
  Zap,
} from 'lucide-react';
import { PredictionResult, WeatherData } from '../types';
import { getPythonBackendCode } from '../services/mlClassifier';

interface MLArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: PredictionResult;
  weather: WeatherData;
  executionMode: 'in-browser-decision-tree' | 'python-backend-api';
  onToggleExecutionMode: (mode: 'in-browser-decision-tree' | 'python-backend-api') => void;
}

export const MLArchitectureModal: React.FC<MLArchitectureModalProps> = ({
  isOpen,
  onClose,
  prediction,
  weather,
  executionMode,
  onToggleExecutionMode,
}) => {
  const [activeTab, setActiveTab] = useState<'decision-tree' | 'python-code' | 'api-inspector'>('decision-tree');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const pythonCode = getPythonBackendCode();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const sampleRequestJson = JSON.stringify(
    {
      temperature: weather.temperature,
      humidity: weather.humidity,
      location: weather.locationName,
      unit: 'C',
    },
    null,
    2
  );

  const sampleResponseJson = JSON.stringify(
    {
      status: 'success',
      predicted_risk: prediction.riskLevel,
      confidence: prediction.confidence,
      heat_index: weather.heatIndex,
      wet_bulb: weather.wetBulb,
      class_probabilities: prediction.classProbabilities,
      model_type: 'DecisionTreeClassifier(max_depth=4)',
      latency_ms: prediction.latencyMs,
    },
    null,
    2
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl my-8 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-950/80 border border-indigo-800 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                AI / ML Architecture &amp; Python Backend Bridge
              </h3>
              <p className="text-xs text-slate-400">
                Modular Decision Tree Classifier with Python Microservice Interoperability
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & Execution Mode Switcher */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('decision-tree')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'decision-tree'
                  ? 'bg-slate-800 text-slate-100 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tree Path &amp; Features
            </button>
            <button
              onClick={() => setActiveTab('python-code')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'python-code'
                  ? 'bg-slate-800 text-slate-100 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Python (Flask + scikit-learn)
            </button>
            <button
              onClick={() => setActiveTab('api-inspector')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'api-inspector'
                  ? 'bg-slate-800 text-slate-100 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              API Request / Response
            </button>
          </div>

          {/* Execution Mode Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Runtime Mode:</span>
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 font-mono text-[11px]">
              <button
                onClick={() => onToggleExecutionMode('in-browser-decision-tree')}
                className={`px-2 py-1 rounded transition-colors ${
                  executionMode === 'in-browser-decision-tree'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                In-Browser ML
              </button>
              <button
                onClick={() => onToggleExecutionMode('python-backend-api')}
                className={`px-2 py-1 rounded transition-colors ${
                  executionMode === 'python-backend-api'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Python Backend API
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Decision Tree Path & Feature Weights */}
        {activeTab === 'decision-tree' && (
          <div className="p-6 space-y-5">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-400" />
                <span>Active Decision Tree Traversal Trace</span>
              </h4>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-slate-500 text-[11px]">
                  # Evaluating input vector: [{weather.temperature}°C, {weather.humidity}%, {weather.heatIndex}°C, {weather.wetBulb}°C]
                </div>
                {prediction.decisionTreePath.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold shrink-0">{idx + 1}.</span>
                    <span className={idx === prediction.decisionTreePath.length - 1 ? 'text-amber-400 font-bold' : ''}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Weights & Importance */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Feature Importance Breakdown (scikit-learn Gini weights)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prediction.featureWeights.map((f, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-200">{f.name}</span>
                      <span className="font-mono text-slate-400">{f.value}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${f.importancePercentage}%` }}
                      />
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 text-right mt-1">
                      Weight: {f.importancePercentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Python Microservice Code */}
        {activeTab === 'python-code' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-300">
                Standalone Python Flask microservice using <code className="text-amber-400 font-mono">scikit-learn.tree.DecisionTreeClassifier</code>:
              </p>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy app.py</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto max-h-96 text-xs font-mono text-slate-300">
              <pre>{pythonCode}</pre>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-200">How to run in local hackathon / evaluation setup:</p>
              <p className="font-mono text-[11px] text-amber-300">
                pip install flask flask-cors scikit-learn numpy &amp;&amp; python app.py
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: API Request / Response Inspector */}
        {activeTab === 'api-inspector' && (
          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-300">
              HTTP Schema for <code className="text-amber-400 font-mono">POST /api/predict-risk</code>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase font-mono text-slate-400 block mb-1.5">
                  Request Payload (JSON)
                </span>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-slate-300 h-64 overflow-y-auto">
                  <pre>{sampleRequestJson}</pre>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase font-mono text-slate-400 block mb-1.5">
                  Response Payload (JSON)
                </span>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-emerald-400 h-64 overflow-y-auto">
                  <pre>{sampleResponseJson}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Current Latency: <span className="font-mono text-slate-300">{prediction.latencyMs}ms</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-100 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
