
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import NovelReader from './NovelReader';

interface NovelSampleTabProps {
  title: string;
  sample: string | null;
  onStartReading: () => void;
  onOpenEpubReader?: () => void;
  hasEpub?: boolean;
}

const NovelSampleTab = ({ 
  title, 
  sample, 
  onStartReading, 
  onOpenEpubReader,
  hasEpub = false
}: NovelSampleTabProps) => {
  const [readerSettings, setReaderSettings] = useState({
    fontSize: 16,
    lineHeight: 1.6,
    theme: 'light',
  });
  
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button 
            onClick={() => setReaderSettings({...readerSettings, fontSize: readerSettings.fontSize - 1})}
            className="p-1 rounded hover:bg-mihrab-cream text-mihrab"
            disabled={readerSettings.fontSize <= 12}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
            </svg>
          </button>
          <span className="text-sm text-mihrab-dark">
            حجم الخط: {readerSettings.fontSize}
          </span>
          <button 
            onClick={() => setReaderSettings({...readerSettings, fontSize: readerSettings.fontSize + 1})}
            className="p-1 rounded hover:bg-mihrab-cream text-mihrab"
            disabled={readerSettings.fontSize >= 24}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
          <button 
            onClick={() => setReaderSettings({
              ...readerSettings, 
              theme: readerSettings.theme === 'light' ? 'dark' : 'light'
            })}
            className="p-1 rounded hover:bg-mihrab-cream text-mihrab"
          >
            {readerSettings.theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            )}
          </button>
        </div>
        <h2 className="text-xl font-heading font-bold text-mihrab text-right">نموذج القراءة</h2>
      </div>
      
      <div 
        className={`p-6 rounded-lg ${
          readerSettings.theme === 'light' 
            ? 'bg-mihrab-cream text-mihrab-dark' 
            : 'bg-mihrab-dark text-mihrab-cream'
        }`}
        style={{
          fontSize: `${readerSettings.fontSize}px`,
          lineHeight: readerSettings.lineHeight,
          textAlign: 'right',
          direction: 'rtl'
        }}
      >
        <p className="mb-4 font-heading font-bold text-center text-2xl">{title}</p>
        <p className="mb-8 text-center">الفصل الأول</p>
        <div className="whitespace-pre-line leading-relaxed">
          {sample || 'لا يوجد نموذج قراءة متاح لهذه الرواية.'}
        </div>
        <div className="text-center mt-8 flex justify-center gap-4">
          <Button 
            onClick={onStartReading}
            className="bg-mihrab hover:bg-mihrab-dark"
          >
            متابعة القراءة
          </Button>
        
          {hasEpub && onOpenEpubReader && (
            <Button
              onClick={onOpenEpubReader}
              className="bg-mihrab-gold hover:bg-mihrab-gold/80"
            >
              قراءة بتنسيق EPUB
            </Button>
          )}
        </div>
      </div>
      
      {/* Novel Flip Book Reader */}
      <NovelReader 
        title={title}
        content={sample || ''}
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
      />
    </div>
  );
};

export default NovelSampleTab;
