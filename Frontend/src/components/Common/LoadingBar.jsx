// e:\K23DX Project\Frontend\src\components\Common\LoadingBar.jsx
import { useEffect, useState } from 'react';

const LoadingBar = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 300);
      return () => clearTimeout(timer);
    }

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90; // Don't go to 100% until loading is complete
        const diff = Math.random() * 20;
        return Math.min(prev + diff, 90);
      });
    }, 200);

    return () => clearInterval(timer);
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;
return (
  <div className="fixed top-0 left-0 right-0 h-[2px] z-[9999] bg-transparent">
    <div 
      className="h-full transition-all duration-300 ease-out"
      style={{ 
        width: `${progress}%`,
        backgroundColor: '#2563eb', // ✅ clean blue
        transition: isLoading ? 'width 200ms linear' : 'width 300ms ease-out'
      }}
    />
  </div>
);

};

export default LoadingBar;