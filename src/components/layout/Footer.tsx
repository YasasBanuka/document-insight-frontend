import { Linkedin } from 'lucide-react';
import { Logo } from '../ui/Logo';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Brand Section */}
                <div className="flex flex-col items-center mb-6">
                    <Logo size="lg" showIcon={true} className="mb-2" />
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
