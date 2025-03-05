// Este script requer o módulo sharp para ser instalado:
// npm install sharp --save-dev

const fs = require('fs');
const path = require('path');

console.log('🔄 Para gerar favicons a partir do SVG, siga estas etapas:');
console.log('');
console.log('1. Instale o módulo sharp:');
console.log('   npm install sharp --save-dev');
console.log('');
console.log('2. Descomente o código abaixo e execute este script novamente');
console.log('');
console.log('Instruções manuais:');
console.log('1. Copie o arquivo src/assets/favicon.svg para public/favicon.svg');
console.log('2. Use uma ferramenta online como https://realfavicongenerator.net/');
console.log('   para converter o SVG em favicon.ico e outros formatos');
console.log('3. Coloque os arquivos gerados na pasta public/');
console.log('');

/*
const sharp = require('sharp');

// Tamanhos para o favicon.ico (16x16, 32x32, 48x48)
const sizes = [16, 32, 48];

// Função para gerar PNG a partir de SVG
async function generatePNG(svgPath, outputPath, size) {
  try {
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✅ Gerado: ${outputPath}`);
    return true;
  } catch (err) {
    console.error(`❌ Erro ao gerar ${outputPath}:`);
    console.error(err);
    return false;
  }
}

// Função principal
async function main() {
  const svgPath = path.join(__dirname, '../src/assets/favicon.svg');
  const outputDir = path.join(__dirname, '../public');
  
  // Verificar se o diretório de saída existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Copiar o SVG original
  fs.copyFileSync(svgPath, path.join(outputDir, 'favicon.svg'));
  console.log(`✅ Copiado: favicon.svg`);
  
  // Gerar PNGs para diferentes tamanhos
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `favicon-${size}x${size}.png`);
    await generatePNG(svgPath, outputPath, size);
  }
  
  // Gerar logo192.png e logo512.png
  await generatePNG(svgPath, path.join(outputDir, 'logo192.png'), 192);
  await generatePNG(svgPath, path.join(outputDir, 'logo512.png'), 512);
  
  console.log('🎉 Geração de favicons concluída!');
}

main().catch(err => {
  console.error('❌ Erro durante a execução:');
  console.error(err);
});
*/ 