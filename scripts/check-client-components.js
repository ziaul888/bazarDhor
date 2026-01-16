#!/usr/bin/env node

/**
 * Client Component Detection Script
 * Analyzes components to determine if they need "use client" directive
 * 
 * Usage: node scripts/check-client-components.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Patterns that indicate a component needs "use client"
const CLIENT_INDICATORS = {
  hooks: [
    /useState/,
    /useEffect/,
    /useReducer/,
    /useRef/,
    /useCallback/,
    /useMemo/,
    /useContext/,
    /useLayoutEffect/,
    /useImperativeHandle/,
    /useQuery/,
    /useMutation/,
    /useInfiniteQuery/,
    /useAppStore/,
    /useAuth/,
    /useCart/,
    /useSearch/,
    /useFavorites/,
    /useNotifications/,
    /usePWA/,
    /usePathname/,
    /useRouter/,
    /useSearchParams/,
  ],
  eventHandlers: [
    /onClick\s*=/,
    /onChange\s*=/,
    /onSubmit\s*=/,
    /onFocus\s*=/,
    /onBlur\s*=/,
    /onKeyDown\s*=/,
    /onKeyPress\s*=/,
    /onMouseEnter\s*=/,
    /onMouseLeave\s*=/,
  ],
  browserAPIs: [
    /window\./,
    /document\./,
    /localStorage/,
    /sessionStorage/,
    /navigator\./,
    /location\./,
  ],
  libraries: [
    /from ['"]swiper['"]/,
    /from ['"]framer-motion['"]/,
    /createContext/,
  ],
};

function hasUseClient(content) {
  return /['"]use client['"]/.test(content);
}

function needsUseClient(content) {
  // Check for any client indicators
  for (const [category, patterns] of Object.entries(CLIENT_INDICATORS)) {
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        return { needs: true, reason: category, pattern: pattern.source };
      }
    }
  }
  return { needs: false };
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const hasClient = hasUseClient(content);
  const clientCheck = needsUseClient(content);

  return {
    path: filePath,
    hasUseClient: hasClient,
    needsUseClient: clientCheck.needs,
    reason: clientCheck.reason,
    pattern: clientCheck.pattern,
    content: content,
  };
}

function findComponents(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(file)) {
        findComponents(filePath, fileList);
      }
    } else if (file.match(/\.(tsx|jsx)$/)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function categorizeComponents(results) {
  const categories = {
    correct: [],
    missing: [],
    unnecessary: [],
    serverComponent: [],
  };

  results.forEach(result => {
    if (result.needsUseClient && result.hasUseClient) {
      categories.correct.push(result);
    } else if (result.needsUseClient && !result.hasUseClient) {
      categories.missing.push(result);
    } else if (!result.needsUseClient && result.hasUseClient) {
      categories.unnecessary.push(result);
    } else {
      categories.serverComponent.push(result);
    }
  });

  return categories;
}

function main() {
  log('\n' + '='.repeat(70), 'blue');
  log('🔍 Client Component Analysis', 'cyan');
  log('='.repeat(70), 'blue');

  const srcDir = path.join(process.cwd(), 'src');
  
  if (!fs.existsSync(srcDir)) {
    log('\n❌ src directory not found', 'red');
    return;
  }

  log('\n📂 Scanning components...', 'cyan');
  const components = findComponents(srcDir);
  log(`   Found ${components.length} components\n`, 'blue');

  const results = components.map(analyzeFile);
  const categories = categorizeComponents(results);

  // Report: Correct
  if (categories.correct.length > 0) {
    log(`\n✅ Correctly Configured (${categories.correct.length}):`, 'green');
    log('   These components have "use client" and need it\n', 'green');
    categories.correct.slice(0, 10).forEach(r => {
      const relativePath = r.path.replace(process.cwd(), '.');
      log(`   ✓ ${relativePath}`, 'green');
      log(`     Reason: Uses ${r.reason} (${r.pattern})`, 'green');
    });
    if (categories.correct.length > 10) {
      log(`   ... and ${categories.correct.length - 10} more`, 'green');
    }
  }

  // Report: Missing "use client"
  if (categories.missing.length > 0) {
    log(`\n❌ Missing "use client" (${categories.missing.length}):`, 'red');
    log('   These components need "use client" but don\'t have it\n', 'red');
    categories.missing.forEach(r => {
      const relativePath = r.path.replace(process.cwd(), '.');
      log(`   ✗ ${relativePath}`, 'red');
      log(`     Reason: Uses ${r.reason} (${r.pattern})`, 'yellow');
    });
  }

  // Report: Unnecessary "use client"
  if (categories.unnecessary.length > 0) {
    log(`\n⚠️  Possibly Unnecessary "use client" (${categories.unnecessary.length}):`, 'yellow');
    log('   These components have "use client" but might not need it\n', 'yellow');
    categories.unnecessary.slice(0, 10).forEach(r => {
      const relativePath = r.path.replace(process.cwd(), '.');
      log(`   ? ${relativePath}`, 'yellow');
      log(`     Could be a Server Component (no client features detected)`, 'yellow');
    });
    if (categories.unnecessary.length > 10) {
      log(`   ... and ${categories.unnecessary.length - 10} more`, 'yellow');
    }
  }

  // Report: Server Components
  if (categories.serverComponent.length > 0) {
    log(`\n✅ Server Components (${categories.serverComponent.length}):`, 'green');
    log('   These components are correctly Server Components\n', 'green');
    categories.serverComponent.slice(0, 5).forEach(r => {
      const relativePath = r.path.replace(process.cwd(), '.');
      log(`   ✓ ${relativePath}`, 'green');
    });
    if (categories.serverComponent.length > 5) {
      log(`   ... and ${categories.serverComponent.length - 5} more`, 'green');
    }
  }

  // Summary
  log('\n' + '='.repeat(70), 'blue');
  log('📊 Summary:', 'cyan');
  log('='.repeat(70), 'blue');
  log(`   ✅ Correct: ${categories.correct.length}`, 'green');
  log(`   ❌ Missing "use client": ${categories.missing.length}`, 'red');
  log(`   ⚠️  Possibly unnecessary: ${categories.unnecessary.length}`, 'yellow');
  log(`   ✅ Server Components: ${categories.serverComponent.length}`, 'green');
  log('='.repeat(70), 'blue');

  // Recommendations
  if (categories.missing.length > 0) {
    log('\n💡 Recommendations:', 'cyan');
    log('   1. Add "use client" to the files listed above', 'yellow');
    log('   2. Or refactor to split Server/Client components', 'yellow');
    log('   3. See COMPONENT_ARCHITECTURE.md for detailed guide', 'yellow');
  }

  // Exit code
  if (categories.missing.length > 0) {
    log('\n⚠️  Action required: Some components need "use client"', 'yellow');
    process.exit(1);
  } else {
    log('\n✨ All components are correctly configured!', 'green');
    process.exit(0);
  }
}

main();