#!/usr/bin/env node

/**
 * Script لتشغيل اختبارات SoundWave Backend
 * 
 * الاستخدام:
 * node scripts/test.js [options]
 * 
 * الخيارات:
 * --watch: تشغيل الاختبارات مع المراقبة
 * --coverage: تشغيل الاختبارات مع تقرير التغطية
 * --models: تشغيل اختبارات الموديلات فقط
 * --integration: تشغيل اختبارات التكامل فقط
 * --verbose: عرض تفاصيل أكثر
 */

const { spawn } = require('child_process');
const path = require('path');

// تحليل المعاملات
const args = process.argv.slice(2);
const options = {
  watch: args.includes('--watch'),
  coverage: args.includes('--coverage'),
  models: args.includes('--models'),
  integration: args.includes('--integration'),
  verbose: args.includes('--verbose')
};

// بناء أمر Jest
const jestArgs = ['jest'];

if (options.watch) {
  jestArgs.push('--watch');
}

if (options.coverage) {
  jestArgs.push('--coverage');
}

if (options.verbose) {
  jestArgs.push('--verbose');
}

// تحديد نوع الاختبارات
if (options.models) {
  jestArgs.push('tests/models/');
} else if (options.integration) {
  jestArgs.push('tests/integration/');
}

// إضافة إعدادات إضافية
jestArgs.push('--detectOpenHandles');
jestArgs.push('--forceExit');

console.log('🚀 تشغيل اختبارات SoundWave Backend...');
console.log('📋 الخيارات المحددة:', options);
console.log('⚙️  أمر Jest:', jestArgs.join(' '));
console.log('');

// تشغيل Jest
const jestProcess = spawn('npx', jestArgs, {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..'),
  shell: true
});

jestProcess.on('close', (code) => {
  if (code === 0) {
    console.log('');
    console.log('✅ تم تشغيل الاختبارات بنجاح!');
    
    if (options.coverage) {
      console.log('📊 تقرير التغطية متاح في: coverage/index.html');
    }
  } else {
    console.log('');
    console.log('❌ فشل في تشغيل الاختبارات');
    process.exit(code);
  }
});

jestProcess.on('error', (error) => {
  console.error('❌ خطأ في تشغيل Jest:', error.message);
  process.exit(1);
});

// معالجة إشارة الإيقاف
process.on('SIGINT', () => {
  console.log('\n🛑 إيقاف الاختبارات...');
  jestProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 إيقاف الاختبارات...');
  jestProcess.kill('SIGTERM');
});
