"use client";

import { useState } from "react";
import axios from "axios";

interface OptimizeResult {
  original: string;
  concise: string;
  detailed: string;
  structured: string;
}

const CARD_CONFIG = [
  {
    key: "concise" as const,
    label: "简洁版",
    desc: "去除冗余，保留核心意图",
    color: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-300",
    icon: "✦",
  },
  {
    key: "detailed" as const,
    label: "详细版",
    desc: "补充背景与约束，信息更完整",
    color: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-300",
    icon: "✦",
  },
  {
    key: "structured" as const,
    label: "结构化版",
    desc: "角色设定 + 分点结构，效果最强",
    color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-300",
    icon: "✦",
  },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post<OptimizeResult>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/optimize`,
        { prompt: input }
      );
      setResult(res.data);
    } catch (e: any) {
      setError(e.response?.data?.detail || "请求失败，请检查后端服务");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      // 现代安全环境（https 或 localhost）
      if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // 非安全上下文的降级方案
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("复制失败", err);
    }
  };


  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-3">
          Prompt 优化助手
        </h1>
        <p className="text-gray-400 text-lg">输入你的原始 Prompt，AI 为你生成三个优化版本</p>
      </div>

      {/* Input Area */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-8">
        <label className="block text-sm text-gray-400 mb-3 font-medium">
          原始 Prompt
        </label>
        <textarea
          className="w-full bg-gray-800 border border-gray-600 rounded-xl p-4 text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 transition-colors text-sm leading-relaxed"
          rows={5}
          placeholder="在这里输入你想优化的 prompt，例如：帮我写一篇文章..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-500 text-sm">{input.length} 字符</span>
          <button
            onClick={handleOptimize}
            disabled={loading || !input.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                优化中...
              </>
            ) : (
              "✨ 开始优化"
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Result Cards */}
      {result && (
        <div className="flex flex-col gap-5 mt-6">
          {CARD_CONFIG.map((card) => (
            <div
              key={card.key}
              className={`bg-gradient-to-b ${card.color} border rounded-2xl p-5 flex flex-col gap-4`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${card.badge}`}>
                    {card.label}
                  </span>
                  <p className="text-gray-400 text-xs mt-2">{card.desc}</p>
                </div>
              </div>
              <p className="text-gray-100 text-sm leading-relaxed flex-1 whitespace-pre-wrap">
                {result[card.key]}
              </p>
              <button
                onClick={() => handleCopy(result[card.key], card.key)}
                className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs transition-colors"
              >
                {copied === card.key ? "✓ 已复制" : "复制"}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
