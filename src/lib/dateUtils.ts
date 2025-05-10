/**
 * Utility functions for date formatting with Arabic numerals and month names
 */

// Arabic months mapping
const arabicMonths: Record<string, string> = {
  'January': 'يناير',
  'February': 'فبراير',
  'March': 'مارس',
  'April': 'أبريل',
  'May': 'ماي',
  'June': 'يونيو',
  'July': 'يوليو',
  'August': 'أغسطس',
  'September': 'سبتمبر',
  'October': 'أكتوبر',
  'November': 'نوفمبر',
  'December': 'ديسمبر'
};

// Function to convert western numerals to Arabic numerals
export const toArabicNumerals = (num: number | string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, match => arabicNumerals[parseInt(match)]);
};

// Format date to Arabic style with Western numbers (e.g., 10 ماي 2025)
export const formatArabicDate = (date: Date | string | number): string => {
  if (!date) return '';
  
  const dateObject = typeof date === 'object' ? date : new Date(date);
  
  // Get English format first
  const day = dateObject.getDate();
  const month = dateObject.toLocaleDateString('en-US', { month: 'long' });
  const year = dateObject.getFullYear();
  
  // Convert month to Arabic name but keep Western numerals
  const arabicMonth = arabicMonths[month] || month;
  
  return `${day} ${arabicMonth} ${year}`;
};

// Format date with options and convert to Arabic
export const formatArabicDateWithOptions = (
  date: Date | string | number, 
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string => {
  if (!date) return '';
  
  try {
    const dateObject = typeof date === 'object' ? date : new Date(date);
    const englishFormatted = dateObject.toLocaleDateString('ar-EG', options);
    
    // Replace Western numerals with Arabic numerals if needed
    return englishFormatted.replace(/[0-9]/g, match => {
      const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return arabicNumerals[parseInt(match)];
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Format rating to Arabic numerals
export const formatArabicRating = (rating: number): string => {
  return `${toArabicNumerals(rating.toString())}/${toArabicNumerals('5')}`;
};
