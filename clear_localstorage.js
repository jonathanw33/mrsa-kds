// Run this in your browser console to clear the localStorage analysis results
localStorage.removeItem('analysisResults');
console.log('Analysis results cleared from localStorage');

// You can also check what was stored:
console.log('Previous data was:', JSON.parse(localStorage.getItem('analysisResults') || '[]'));
