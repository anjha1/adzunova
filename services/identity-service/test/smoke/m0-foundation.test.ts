import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const WEB_SRC = join(__dirname, '..', '..', '..', '..', 'apps', 'web', 'src');

describe('Milestone 0: Clean Code Standards & Zero Mock Imports in Creator Routes', () => {
  it('asserts zero imports of lib/mock in creator app directory', () => {
    const creatorAppDir = join(WEB_SRC, 'app', 'creator');
    expect(existsSync(creatorAppDir)).toBe(true);

    const checkDir = (dir: string): string[] => {
      const fs = require('fs');
      let violations: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          violations = violations.concat(checkDir(fullPath));
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          const content = readFileSync(fullPath, 'utf-8');
          if (content.includes('@/lib/mock') || content.includes('/mock/creator')) {
            violations.push(fullPath);
          }
        }
      }
      return violations;
    };

    const violations = checkDir(creatorAppDir);
    expect(violations).toEqual([]);
  });

  it('asserts zero references to Phase 2 / Phase 3 / Coming soon in creator route placeholder views', () => {
    const placeholderPath = join(WEB_SRC, 'components', 'creator', 'module-placeholder.tsx');
    expect(existsSync(placeholderPath)).toBe(true);

    const content = readFileSync(placeholderPath, 'utf-8');
    expect(content).not.toContain('Coming soon');
    expect(content).not.toContain('Phase 2');
    expect(content).not.toContain('Phase 3');
  });

  it('verifies custom desk breakpoint @ 641px in globals.css', () => {
    const globalsCss = readFileSync(join(WEB_SRC, 'app', 'globals.css'), 'utf-8');
    expect(globalsCss).toContain('--breakpoint-desk: 40.0625rem');
    expect(globalsCss).toContain('@custom-variant dark');
  });
});
