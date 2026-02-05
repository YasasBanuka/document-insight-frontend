import { Link } from 'react-router-dom';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    className?: string;
}

/**
 * Docura Logo Component
 * Professional branded logo with optional icon
 */
export function Logo({ size = 'md', className = '' }: LogoProps) {
    const sizeClasses = {
        sm: 'text-xl',
        md: 'text-2xl',
        lg: 'text-3xl',
    };

    return (
        <Link
            to="/"
            className={`group inline-flex items-center gap-2 ${className}`}
            aria-label="Docura Home"
        >
            <span className={`${sizeClasses[size]} font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity`}>
                Docura
            </span>
        </Link>
    );
}
