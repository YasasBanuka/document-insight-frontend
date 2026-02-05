import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, Search, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMGI5ODEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtMS4xMDUuODk1LTIgMi0yaDRjMS4xMDUgMCAyIC44OTUgMiAydjRjMCAxLjEwNS0uODk1IDItMiAyaC00Yy0xLjEwNSAwLTItLjg5NS0yLTJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full text-sm font-medium text-primary-700 mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Powered by Advanced AI
            </motion.div>

            {/* Hero Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Intelligence
              </span>
              <br />
              for Your Documents
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform your documents into intelligent knowledge bases. Ask questions, 
              get instant answers, and unlock insights with AI-powered analysis.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/documents"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-primary text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold border-2 border-slate-200 hover:border-primary-500 hover:text-primary-700 transition-all duration-200"
              >
                Try Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to work smarter
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Upload, analyze, and interact with your documents like never before
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Link
                to="/documents"
                className="group block p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl border border-slate-200 hover:border-primary-200 transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-primary rounded-xl shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3 text-center">
                  Smart Document Management
                </h3>
                <p className="text-slate-600 text-center leading-relaxed">
                  Upload and organize PDF, DOCX, and text files with automatic processing and intelligent chunking
                </p>
              </Link>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/chat"
                className="group block p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl border border-slate-200 hover:border-primary-200 transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-primary rounded-xl shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3 text-center">
                  AI-Powered Chat
                </h3>
                <p className="text-slate-600 text-center leading-relaxed">
                  Ask questions in natural language and get accurate answers from your document knowledge base
                </p>
              </Link>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/search"
                className="group block p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl border border-slate-200 hover:border-primary-200 transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-primary rounded-xl shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3 text-center">
                  Semantic Search
                </h3>
                <p className="text-slate-600 text-center leading-relaxed">
                  Find exactly what you need with AI-powered semantic search across all your documents
                </p>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Why choose Docura?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Zap className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Lightning Fast</h3>
                    <p className="text-slate-600">Get answers in seconds with optimized vector search and AI processing</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Shield className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Secure & Private</h3>
                    <p className="text-slate-600">Your documents stay yours. All processing happens securely</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Sparkles className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Advanced AI</h3>
                    <p className="text-slate-600">Powered by state-of-the-art RAG technology and local LLMs</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-primary p-8 rounded-2xl shadow-2xl"
            >
              <div className="text-white space-y-4">
                <h3 className="text-2xl font-bold">Ready to get started?</h3>
                <p className="text-primary-50">Upload your first document and experience the power of AI-driven insights</p>
                <Link
                  to="/documents"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
                >
                  Start Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}