const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Handle text-white -> text-gray-900
  content = content.replace(/text-white/g, 'text-gray-900');
  
  // 2. Handle text-charcoal-900 -> text-white (for buttons)
  content = content.replace(/text-charcoal-900/g, 'text-white');
  content = content.replace(/text-charcoal-800/g, 'text-gray-100');
  content = content.replace(/text-charcoal-700/g, 'text-gray-200');

  // 3. Handle backgrounds
  content = content.replace(/bg-charcoal-900/g, 'bg-white');
  content = content.replace(/bg-charcoal-800/g, 'bg-gray-50');
  content = content.replace(/bg-charcoal-700/g, 'bg-gray-100');

  // 4. Handle borders
  content = content.replace(/border-charcoal-800/g, 'border-gray-100');
  content = content.replace(/border-charcoal-700/g, 'border-gray-200');
  content = content.replace(/border-charcoal-600/g, 'border-gray-300');

  // 5. Handle divide
  content = content.replace(/divide-charcoal-800/g, 'divide-gray-100');
  content = content.replace(/divide-charcoal-700/g, 'divide-gray-200');

  // 6. Handle text grays
  content = content.replace(/text-gray-400/g, 'text-gray-600');
  content = content.replace(/text-gray-300/g, 'text-gray-700');

  // 7. Handle gold -> blue
  content = content.replace(/gold-400/g, 'blue-500');
  content = content.replace(/gold-500/g, 'blue-600');
  content = content.replace(/gold-600/g, 'blue-700');

  // 8. Handle specific gradients
  content = content.replace(/from-charcoal-900/g, 'from-white');
  content = content.replace(/via-charcoal-900/g, 'via-white');
  content = content.replace(/to-charcoal-900/g, 'to-white');
  
  content = content.replace(/from-charcoal-800/g, 'from-gray-50');
  content = content.replace(/via-charcoal-800/g, 'via-gray-50');
  content = content.replace(/to-charcoal-800/g, 'to-gray-50');

  fs.writeFileSync(file, content);
});
console.log('Theme replaced successfully.');
