import { FileText, FileType, FileCheck } from 'lucide-react';

/**
 * Docura Brand Constants
 * Centralized branding definitions for consistent UI/UX
 */

export const BRAND = {
    name: 'Docura',
    tagline: 'Intelligence for Your Documents',

    colors: {
        primary: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',  // Main brand color (Emerald)
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
        },
        accent: {
            50: '#ecfeff',
            100: '#cffafe',
            500: '#06b6d4',  // Cyan accent
            600: '#0891b2',
            700: '#0e7490',
        },
        file: {
            pdf: '#ef4444',      // Red for PDFs
            docx: '#3b82f6',     // Blue for DOCX
            txt: '#64748b',      // Slate for TXT
            default: '#94a3b8',  // Light slate for unknown
        }
    },

    /**
     * File type icon mappings
     * Returns the appropriate icon component and color class for each file type
     */
    getFileTypeIcon: (contentType: string) => {
        if (contentType.includes('pdf')) {
            return {
                Icon: FileText,
                colorClass: 'text-red-500',
                bgClass: 'bg-red-50',
                label: 'PDF'
            };
        }

        if (contentType.includes('word') || contentType.includes('document')) {
            return {
                Icon: FileType,
                colorClass: 'text-blue-600',
                bgClass: 'bg-blue-50',
                label: 'DOCX'
            };
        }

        if (contentType.includes('text')) {
            return {
                Icon: FileCheck,
                colorClass: 'text-slate-600',
                bgClass: 'bg-slate-50',
                label: 'TXT'
            };
        }

        // Default fallback
        return {
            Icon: FileText,
            colorClass: 'text-slate-500',
            bgClass: 'bg-slate-50',
            label: 'File'
        };
    }
} as const;

export default BRAND;
