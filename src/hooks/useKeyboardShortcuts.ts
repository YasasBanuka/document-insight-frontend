// import { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import toast from 'react-hot-toast';

// /**
//  * Global keyboard shortcuts hook
//  * Provides application-wide keyboard navigation
//  */
// export function useKeyboardShortcuts() {
//     const navigate = useNavigate();
//     const location = useLocation();

//     useEffect(() => {
//         const handleKeyDown = (e: KeyboardEvent) => {
//             const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
//             const modKey = isMac ? e.metaKey : e.ctrlKey;

//             // Ignore shortcuts when typing in inputs
//             const target = e.target as HTMLElement;
//             if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
//                 // Allow Escape to blur inputs
//                 if (e.key === 'Escape') {
//                     target.blur();
//                 }
//                 return;
//             }

//             // Global shortcuts
//             if (modKey) {
//                 switch (e.key.toLowerCase()) {
//                     case '1':
//                         e.preventDefault();
//                         navigate('/');
//                         toast.success('Home', { duration: 1500, icon: '🏠' });
//                         break;
//                     case '2':
//                         e.preventDefault();
//                         navigate('/documents');
//                         toast.success('Documents', { duration: 1500, icon: '📄' });
//                         break;
//                     case '3':
//                         e.preventDefault();
//                         navigate('/chat');
//                         toast.success('Chat', { duration: 1500, icon: '💬' });
//                         break;
//                     case '4':
//                         e.preventDefault();
//                         navigate('/search');
//                         toast.success('Search', { duration: 1500, icon: '🔍' });
//                         break;
//                     case '/':
//                     case '?':
//                         e.preventDefault();
//                         showKeyboardShortcuts();
//                         break;
//                 }
//             }

//             // Escape key - close modals/dialogs
//             if (e.key === 'Escape') {
//                 // Modals will handle this themselves
//             }
//         };

//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [navigate, location]);
// }

// function showKeyboardShortcuts() {
//     const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
//     const mod = isMac ? '⌘' : 'Ctrl';

//     toast.custom(
//         (t) => (
//             <div className= "bg-white border border-slate-200 rounded-lg shadow-xl p-6 max-w-md" >
//             <h3 className="font-semibold text-slate-900 mb-4" > Keyboard Shortcuts </h3>
//     < div className = "space-y-2 text-sm" >
//     <div className="flex justify-between" >
//     <span className="text-slate-600" > Home </span>
//     < kbd className = "px-2 py-1 bg-slate-100 rounded text-xs font-mono" > { mod } + 1 </kbd>
//     </div>
//     < div className = "flex justify-between" >
//     <span className="text-slate-600" > Documents </span>
//     < kbd className = "px-2 py-1 bg-slate-100 rounded text-xs font-mono" > { mod } + 2 </kbd>
//     </div>
//     < div className = "flex justify-between" >
//     <span className="text-slate-600" > Chat </span>
//     < kbd className = "px-2 py-1 bg-slate-100 rounded text-xs font-mono" > { mod } + 3 </kbd>
//     </div>
//     < div className = "flex justify-between" >
//     <span className="text-slate-600" > Search </span>
//     < kbd className = "px-2 py-1 bg-slate-100 rounded text-xs font-mono" > { mod } + 4 </kbd>
//     </div>
//     < div className = "flex justify-between" >
//     <span className="text-slate-600" > Focus Chat Input </span>
//     < kbd className = "px-2 py-1 bg-slate-100 rounded text-xs font-mono" > { mod } + K </kbd>
//     </div>
//     < div className = "flex justify-between" >
//     <span className="text-slate-600" > Show Shortcuts </span>
//     < kbd className = "px-2 py-1 bg-slate-100 rounded text-xs font-mono" > { mod } + /</kbd >
//     </div>
//     </div>
//     < button
//                     onClick = {() => toast.dismiss(t.id)}
// className = "mt-4 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
//     >
//     Got it
//         </button>
//         </div>
//         ),
// { duration: Infinity }
//     );
// }
