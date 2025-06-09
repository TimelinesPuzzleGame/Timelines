import fs from 'fs';
import path from 'path';
import { Puzzle } from './types';


export function savePuzzleToDisk(puzzle: Puzzle, slug: string): string {
  const jsonPath = path.join(process.cwd(), 'lib', "puzzles", `${slug}.json`);
  if (fs.existsSync(jsonPath)) return "already-saved";

  fs.writeFileSync(jsonPath, JSON.stringify(puzzle, null, 2), 'utf8');

  const gameDataPath = path.join(process.cwd(), 'lib', 'gameData.ts');
  const importLine = `import ${slug.replace(/-/g, '_')} from './puzzles/${slug}.json';\n`;
const exportLine = `  ${slug.replace(/-/g, '_')} as Puzzle,\n`;

  const fileContent = fs.readFileSync(gameDataPath, 'utf8');
  const newContent = fileContent
    .replace('// END IMPORTS', `${importLine}// END IMPORTS`)
    .replace('// END EXPORTS', `${exportLine}  // END EXPORTS`);

  fs.writeFileSync(gameDataPath, newContent, 'utf8');
  return "saved";
}
