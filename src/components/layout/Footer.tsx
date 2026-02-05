import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Brand Section */}
                <div className="text-center mb-6">
                    <Link to="/" className="inline-block group">
                        <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-1 group-hover:opacity-80 transition-opacity">
                            Docura
                        </h3>
                    </Link>
                    <p className="text-sm text-slate-600">Intelligence for Your Documents</p>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 my-6"></div>

                {/* Bottom Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
                    <p>© {currentYear} Docura. All rights reserved.</p>

                    <a
                        href="https://www.linkedin.com/in/yasasbanuka/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-primary-600 transition-colors group"
                    >
                        <span>Developed by <strong className="text-slate-900">Yasas Banuka</strong></span>
                        <Linkedin className="w-4 h-4 group-hover:text-primary-600" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
