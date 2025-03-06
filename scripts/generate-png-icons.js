const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Função para verificar se o comando existe
function commandExists(command) {
  try {
    execSync(`where ${command}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Verificar se o ImageMagick está instalado
if (!commandExists('magick')) {
  console.error('❌ ImageMagick não está instalado. Por favor, instale-o para gerar os ícones PNG.');
  console.error('   Você pode baixá-lo em: https://imagemagick.org/script/download.php');
  console.error('   Ou usar o comando: npm install -g imagemagick');
  
  // Criar arquivos PNG vazios com mensagem de erro
  const errorMessage = 'Este é um arquivo de espaço reservado. Execute "npm install -g imagemagick" e depois "node scripts/generate-png-icons.js" para gerar os ícones PNG reais.';
  
  fs.writeFileSync(path.join(__dirname, '../public/logo192.png'), errorMessage);
  fs.writeFileSync(path.join(__dirname, '../public/logo512.png'), errorMessage);
  fs.writeFileSync(path.join(__dirname, '../src/assets/logo192.png'), errorMessage);
  fs.writeFileSync(path.join(__dirname, '../src/assets/logo512.png'), errorMessage);
  
  process.exit(1);
}

// Caminhos dos arquivos
const svgPath = path.join(__dirname, '../src/assets/logo.svg');
const png192Path = path.join(__dirname, '../src/assets/logo192.png');
const png512Path = path.join(__dirname, '../src/assets/logo512.png');

// Gerar os ícones PNG
console.log('🔄 Gerando ícones PNG a partir do SVG...');

try {
  // Gerar o ícone de 192x192
  execSync(`magick convert -background none -size 192x192 ${svgPath} ${png192Path}`);
  console.log(`✅ Ícone gerado: ${png192Path}`);
  
  // Gerar o ícone de 512x512
  execSync(`magick convert -background none -size 512x512 ${svgPath} ${png512Path}`);
  console.log(`✅ Ícone gerado: ${png512Path}`);
  
  // Copiar para a pasta public
  fs.copyFileSync(png192Path, path.join(__dirname, '../public/logo192.png'));
  fs.copyFileSync(png512Path, path.join(__dirname, '../public/logo512.png'));
  console.log('✅ Ícones copiados para a pasta public');
  
  console.log('🎉 Todos os ícones foram gerados com sucesso!');
} catch (err) {
  console.error('❌ Erro ao gerar os ícones PNG:');
  console.error(err);
  
  // Criar arquivos PNG vazios com mensagem de erro
  const errorMessage = 'Ocorreu um erro ao gerar este ícone. Verifique o console para mais detalhes.';
  
  fs.writeFileSync(path.join(__dirname, '../public/logo192.png'), errorMessage);
  fs.writeFileSync(path.join(__dirname, '../public/logo512.png'), errorMessage);
  fs.writeFileSync(path.join(__dirname, '../src/assets/logo192.png'), errorMessage);
  fs.writeFileSync(path.join(__dirname, '../src/assets/logo512.png'), errorMessage);
  
  process.exit(1);
} 