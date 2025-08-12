#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DIST_DIR = 'dist';
const ASSETS_DIR = join(DIST_DIR, 'assets');

function analyzeBundle() {
  console.log('🔍 Анализ бандла для проверки tree shaking...\n');

  // Проверяем, существует ли папка dist
  if (!existsSync(DIST_DIR)) {
    console.log('❌ Папка dist не найдена. Сначала выполните сборку:');
    console.log('   npm run build\n');
    return;
  }

  // Анализируем размер папки dist
  try {
    const distSize = execSync(`du -sh ${DIST_DIR}`, { encoding: 'utf8' }).trim();
    console.log(`📦 Общий размер бандла: ${distSize}`);
  } catch (error) {
    console.log('⚠️  Не удалось получить размер папки dist');
  }

  // Анализируем JavaScript файлы
  if (existsSync(join(ASSETS_DIR, 'js'))) {
    console.log('\n📊 JavaScript файлы:');
    try {
      const jsFiles = execSync(`ls -lah ${join(ASSETS_DIR, 'js')}`, { encoding: 'utf8' });
      console.log(jsFiles);
    } catch (error) {
      console.log('⚠️  Не удалось прочитать JavaScript файлы');
    }
  }

  // Анализируем CSS файлы
  if (existsSync(join(ASSETS_DIR, 'css'))) {
    console.log('\n🎨 CSS файлы:');
    try {
      const cssFiles = execSync(`ls -lah ${join(ASSETS_DIR, 'css')}`, { encoding: 'utf8' });
      console.log(cssFiles);
    } catch (error) {
      console.log('⚠️  Не удалось прочитать CSS файлы');
    }
  }

  // Проверяем package.json на side effects
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    if (packageJson.sideEffects !== false) {
      console.log('\n⚠️  В package.json не указан sideEffects: false');
      console.log('   Это может помешать tree shaking');
    } else {
      console.log('\n✅ sideEffects: false установлен в package.json');
    }
  } catch (error) {
    console.log('⚠️  Не удалось прочитать package.json');
  }

  // Рекомендации по tree shaking
  console.log('\n💡 Рекомендации для улучшения tree shaking:');
  console.log('   1. Используйте именованные импорты вместо * as');
  console.log('   2. Избегайте default экспортов');
  console.log('   3. Импортируйте только нужные функции из библиотек');
  console.log('   4. Следуйте FSD архитектуре');
  console.log('   5. Используйте vite-bundle-analyzer для детального анализа');

  // Проверяем наличие vite-bundle-analyzer
  try {
    const analyzerPath = join('node_modules', 'vite-bundle-analyzer');
    if (existsSync(analyzerPath)) {
      console.log('\n🚀 Для детального анализа запустите:');
      console.log('   npx vite-bundle-analyzer dist');
    } else {
      console.log('\n📦 Для детального анализа установите:');
      console.log('   npm install --save-dev vite-bundle-analyzer');
      console.log('   npx vite-bundle-analyzer dist');
    }
  } catch (error) {
    console.log('⚠️  Не удалось проверить наличие vite-bundle-analyzer');
  }

  console.log('\n✨ Анализ завершен!');
}

// Запускаем анализ
analyzeBundle(); 