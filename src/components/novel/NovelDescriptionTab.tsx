
import React from 'react';

interface NovelDescriptionTabProps {
  fullDescription: string | null;
}

const NovelDescriptionTab = ({ fullDescription }: NovelDescriptionTabProps) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-heading font-bold text-mihrab mb-4 text-right">عن الرواية</h2>
      <div 
        className="prose prose-lg max-w-none text-mihrab-dark/80 leading-relaxed whitespace-pre-line text-right font-amiri"
        dir="rtl"
        lang="ar"
        style={{
          fontFeatureSettings: "'kern', 'liga', 'calt', 'rlig'",
          textRendering: "optimizeLegibility"
        }}
      >
        {fullDescription || "لا يوجد وصف مفصل متاح لهذه الرواية."}
      </div>
    </div>
  );
};

export default NovelDescriptionTab;
