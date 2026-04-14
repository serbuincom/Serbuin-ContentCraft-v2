import React, { useState } from "react";
import { generateContent, ContentType, ToneType } from "@/lib/gemini";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Check, RotateCcw, Send, FileText, Share2, MessageSquare, Twitter, Linkedin, Instagram } from "lucide-react";
import Markdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [type, setType] = useState<ContentType>("linkedin");
  const [tone, setTone] = useState<ToneType>("professional");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await generateContent(input, type, tone);
      setOutput(result || "");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#60a5fa", "#93c5fd"]
      });
    } catch (error: any) {
      console.error(error);
      alert(`Gagal menghasilkan konten: ${error.message || "Silakan coba lagi."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setInput("");
    setOutput("");
  };

  const platformIcons = {
    linkedin: <Linkedin className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
    blog: <FileText className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    summary: <MessageSquare className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">Serbuin ContentCraft</h1>
          </div>
          <Badge variant="secondary" className="font-medium">AI Powered</Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-none shadow-xl shadow-slate-200/50 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Input Sumber
                </CardTitle>
                <CardDescription>
                  Tempelkan transkrip, ringkasan, atau catatan Anda di sini.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-6">
                <div className="flex-1">
                  <Textarea
                    placeholder="Contoh: Transkrip meeting, ringkasan buku, atau ide mentah..."
                    className="min-h-[300px] h-full resize-none border-slate-200 focus:ring-blue-500 focus:border-blue-500 text-base"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-semibold">Tipe Konten</Label>
                    <Select value={type} onValueChange={(v) => setType(v as ContentType)}>
                      <SelectTrigger id="type" className="bg-white border-slate-200">
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linkedin">LinkedIn Post</SelectItem>
                        <SelectItem value="twitter">Twitter Thread</SelectItem>
                        <SelectItem value="blog">Blog Snippet</SelectItem>
                        <SelectItem value="instagram">Instagram Caption</SelectItem>
                        <SelectItem value="summary">Structured Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tone" className="text-sm font-semibold">Nada Bicara</Label>
                    <Select value={tone} onValueChange={(v) => setTone(v as ToneType)}>
                      <SelectTrigger id="tone" className="bg-white border-slate-200">
                        <SelectValue placeholder="Pilih nada" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Profesional</SelectItem>
                        <SelectItem value="casual">Santai</SelectItem>
                        <SelectItem value="witty">Lucu/Cerdas</SelectItem>
                        <SelectItem value="inspirational">Inspiratif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex w-full gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-slate-200 hover:bg-slate-50"
                    onClick={reset}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button 
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                    disabled={isLoading || !input.trim()}
                    onClick={handleGenerate}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="mr-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </motion.div>
                        Memproses...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="w-4 h-4 mr-2" />
                        Generate Konten
                      </span>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-none shadow-xl shadow-slate-200/50 h-full flex flex-col bg-white overflow-hidden">
              <div className="bg-blue-600 h-1.5 w-full" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Share2 className="w-5 h-5 text-blue-600" />
                    Hasil Konten
                  </CardTitle>
                  <CardDescription>
                    Konten siap pakai untuk platform pilihan Anda.
                  </CardDescription>
                </div>
                {output && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-100">
                    {platformIcons[type]}
                    <span className="capitalize">{type}</span>
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0 border-t border-slate-100">
                <AnimatePresence mode="wait">
                  {output ? (
                    <motion.div
                      key="output"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-6 prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:text-slate-900"
                    >
                      <Markdown>{output}</Markdown>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-slate-400 p-12 text-center"
                    >
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 opacity-20" />
                      </div>
                      <p className="text-sm">Belum ada konten yang dihasilkan.</p>
                      <p className="text-xs mt-1">Klik "Generate Konten" untuk memulai keajaiban.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              {output && (
                <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-4">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <span className="flex items-center text-green-600">
                        <Check className="w-4 h-4 mr-2" />
                        Tersalin!
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Copy className="w-4 h-4 mr-2" />
                        Salin ke Clipboard
                      </span>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-5xl mx-auto px-4 py-8 text-center text-slate-400 text-xs">
        <p>© 2024 Serbuin ContentCraft • Powered by Gemini AI</p>
      </footer>
    </div>
  );
}
