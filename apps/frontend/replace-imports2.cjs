const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('src');
const srcDir = path.resolve('src');

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    // Match import(...) or require(...)
    let newContent = content.replace(/(import|require)\s*\(\s*["'](\.\.\/[^"']+)["']\s*\)/g, (match, p1, p2) => {
        const fileDir = path.dirname(path.resolve(file));
        const absPath = path.resolve(fileDir, p2);
        
        if (absPath.startsWith(srcDir)) {
            const relativeToRoot = path.relative(path.dirname(srcDir), absPath);
            const aliasPath = relativeToRoot.split(path.sep).join('/');
            return `${p1}("${aliasPath}")`;
        }
        return match;
    });

    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
    }
}
console.log('Dynamic imports replaced');
