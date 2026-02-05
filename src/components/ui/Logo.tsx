import { Link } from 'react-router-dom';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    className?: string;
}

/**
 * Docura Logo Component
 * Professional branded logo with icon
 * Responsive: shows icon only on mobile, icon + text on desktop
 */
export function Logo({ size = 'md', showIcon = true, className = '' }: LogoProps) {
    const sizeClasses = {
        sm: { text: 'text-xl', icon: 'w-6 h-6' },
        md: { text: 'text-2xl', icon: 'w-8 h-8' },
        lg: { text: 'text-3xl', icon: 'w-10 h-10' },
    };

    return (
        <Link
            to="/"
            className={`group inline-flex items-center gap-2 ${className}`}
            aria-label="Docura Home"
        >
            {showIcon && (
                <img 
                    src="/favicon/favicon.svg" 
                    alt="Docura Logo" 
                    className={`${sizeClasses[size].icon} group-hover:scale-105 transition-transform`}
                />
            )}
            <span className={`${sizeClasses[size].text} font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity hidden sm:inline`}>
                Docura
            </span>
        </Link>
    );
}
