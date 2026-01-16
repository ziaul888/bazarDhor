#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Run this script to validate your environment configuration
 * 
 * Usage:
 *   node scripts/validate-env.js
 *   npm run validate:env
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Required environment variables
const REQUIRED_VARS = {
  development: [
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_API_URL',
  ],
  production: [
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
    'DATABASE_URL',
    'JWT_SECRET',
  ],
};

// Optional but recommended variables
const RECOMMENDED_VARS = [
  'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'SENTRY_DSN',
];

function loadEnvFile(filename) {
  const filepath = path.join(process.cwd(), filename);
  
  if (!fs.existsSync(filepath)) {
    return null;
  }

  const content = fs.readFileSync(filepath, 'utf8');
  const vars = {};

  content.split('\n').forEach(line => {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || !line.trim()) {
      return;
    }

    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      vars[key] = value;
    }
  });

  return vars;
}

function validateEnv(envVars, environment) {
  log(`\n🔍 Validating ${environment} environment...`, 'cyan');
  
  const required = REQUIRED_VARS[environment] || REQUIRED_VARS.development;
  const missing = [];
  const empty = [];
  const present = [];

  // Check required variables
  required.forEach(varName => {
    if (!envVars[varName]) {
      missing.push(varName);
    } else if (envVars[varName] === '' || envVars[varName].includes('your_') || envVars[varName].includes('change_')) {
      empty.push(varName);
    } else {
      present.push(varName);
    }
  });

  // Check recommended variables
  const missingRecommended = [];
  RECOMMENDED_VARS.forEach(varName => {
    if (!envVars[varName] || envVars[varName] === '' || envVars[varName].includes('your_')) {
      missingRecommended.push(varName);
    }
  });

  // Report results
  if (present.length > 0) {
    log(`\n✅ Present (${present.length}):`, 'green');
    present.forEach(v => log(`   ${v}`, 'green'));
  }

  if (empty.length > 0) {
    log(`\n⚠️  Empty or placeholder values (${empty.length}):`, 'yellow');
    empty.forEach(v => log(`   ${v}`, 'yellow'));
  }

  if (missing.length > 0) {
    log(`\n❌ Missing required variables (${missing.length}):`, 'red');
    missing.forEach(v => log(`   ${v}`, 'red'));
  }

  if (missingRecommended.length > 0) {
    log(`\n💡 Missing recommended variables (${missingRecommended.length}):`, 'yellow');
    missingRecommended.forEach(v => log(`   ${v}`, 'yellow'));
  }

  // Summary
  const hasErrors = missing.length > 0;
  const hasWarnings = empty.length > 0 || missingRecommended.length > 0;

  log('\n' + '='.repeat(50), 'blue');
  if (hasErrors) {
    log('❌ Validation FAILED', 'red');
    log(`   ${missing.length} required variable(s) missing`, 'red');
  } else if (hasWarnings) {
    log('⚠️  Validation PASSED with warnings', 'yellow');
    log(`   ${empty.length} variable(s) need values`, 'yellow');
    log(`   ${missingRecommended.length} recommended variable(s) missing`, 'yellow');
  } else {
    log('✅ Validation PASSED', 'green');
    log('   All required variables are set', 'green');
  }
  log('='.repeat(50), 'blue');

  return !hasErrors;
}

function checkEnvFiles() {
  log('\n🔍 Checking environment files...', 'cyan');

  const files = {
    '.env.example': 'Template file',
    '.env.local': 'Development environment',
    '.env.production': 'Production environment',
  };

  Object.entries(files).forEach(([filename, description]) => {
    const filepath = path.join(process.cwd(), filename);
    if (fs.existsSync(filepath)) {
      log(`✅ ${filename} - ${description}`, 'green');
    } else {
      log(`❌ ${filename} - ${description} (missing)`, 'red');
    }
  });
}

function main() {
  log('\n' + '='.repeat(50), 'blue');
  log('🔐 Environment Variables Validation', 'cyan');
  log('='.repeat(50), 'blue');

  // Check if env files exist
  checkEnvFiles();

  // Validate development environment
  const devEnv = loadEnvFile('.env.local');
  if (devEnv) {
    const devValid = validateEnv(devEnv, 'development');
    if (!devValid) {
      log('\n💡 Tip: Copy .env.example to .env.local and fill in the values', 'yellow');
    }
  } else {
    log('\n❌ .env.local not found', 'red');
    log('💡 Run: cp .env.example .env.local', 'yellow');
  }

  // Validate production environment
  const prodEnv = loadEnvFile('.env.production');
  if (prodEnv) {
    const prodValid = validateEnv(prodEnv, 'production');
    if (!prodValid) {
      log('\n💡 Tip: Update .env.production with production values', 'yellow');
    }
  } else {
    log('\n⚠️  .env.production not found (optional for development)', 'yellow');
  }

  // Security checks
  log('\n🔒 Security Checks:', 'cyan');
  
  const checks = [
    {
      name: 'JWT_SECRET strength',
      check: (env) => {
        const secret = env.JWT_SECRET || '';
        return secret.length >= 32 && !secret.includes('your_') && !secret.includes('change_');
      },
      message: 'JWT_SECRET should be at least 32 characters and unique',
    },
    {
      name: 'Production API URL',
      check: (env) => {
        const url = env.NEXT_PUBLIC_API_URL || '';
        return !url.includes('localhost') && url.startsWith('https://');
      },
      message: 'Production API URL should use HTTPS and not localhost',
      prodOnly: true,
    },
    {
      name: 'DevTools disabled in production',
      check: (env) => {
        return env.NEXT_PUBLIC_ENABLE_DEVTOOLS !== 'true';
      },
      message: 'DevTools should be disabled in production',
      prodOnly: true,
    },
  ];

  if (devEnv) {
    log('\n  Development:', 'blue');
    checks.filter(c => !c.prodOnly).forEach(check => {
      if (check.check(devEnv)) {
        log(`  ✅ ${check.name}`, 'green');
      } else {
        log(`  ⚠️  ${check.name}: ${check.message}`, 'yellow');
      }
    });
  }

  if (prodEnv) {
    log('\n  Production:', 'blue');
    checks.forEach(check => {
      if (check.check(prodEnv)) {
        log(`  ✅ ${check.name}`, 'green');
      } else {
        log(`  ❌ ${check.name}: ${check.message}`, 'red');
      }
    });
  }

  log('\n✨ Validation complete!\n', 'cyan');
}

// Run validation
main();