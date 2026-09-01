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
    let newContent = content.replace(/from\s+["'](\.\.\/[^"']+)["']/g, (match, p1) => {
        const fileDir = path.dirname(path.resolve(file));
        const absPath = path.resolve(fileDir, p1);
        
        if (absPath.startsWith(srcDir)) {
            // e.g. /path/to/src/components/Button -> src/components/Button
            const relativeToRoot = path.relative(path.dirname(srcDir), absPath);
            // Replace backslashes on windows
            const aliasPath = relativeToRoot.split(path.sep).join('/');
            return `from "${aliasPath}"`;
        }
        return match;
    });

    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
    }
}
console.log('Imports replaced');
