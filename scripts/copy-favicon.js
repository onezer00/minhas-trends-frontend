const fs = require('fs');
const path = require('path');

// Caminhos dos arquivos
const srcFaviconSvg = path.join(__dirname, '../src/assets/favicon.svg');
const destFaviconSvg = path.join(__dirname, '../public/favicon.svg');

// Verificar se o arquivo de origem existe
if (!fs.existsSync(srcFaviconSvg)) {
  console.error(`❌ Arquivo não encontrado: ${srcFaviconSvg}`);
  process.exit(1);
}

// Verificar se o diretório de destino existe
const destDir = path.dirname(destFaviconSvg);
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`✅ Diretório criado: ${destDir}`);
}

// Copiar o arquivo
try {
  fs.copyFileSync(srcFaviconSvg, destFaviconSvg);
  console.log(`✅ Arquivo copiado: ${srcFaviconSvg} -> ${destFaviconSvg}`);
} catch (err) {
  console.error(`❌ Erro ao copiar arquivo: ${srcFaviconSvg} -> ${destFaviconSvg}`);
  console.error(err);
  process.exit(1);
}

console.log('🎉 Favicon copiado com sucesso!'); 