const fs = require('fs');
const path = require('path');

// Base64 de um PNG roxo simples de 1x1 pixel
const purplePixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk+89QDwADvgGOSHzRgAAAAABJRU5ErkJggg==';

// Decodificar o base64 para um buffer
const purplePixelBuffer = Buffer.from(purplePixelBase64, 'base64');

// Caminhos dos arquivos
const paths = [
  path.join(__dirname, '../public/logo192.png'),
  path.join(__dirname, '../public/logo512.png'),
  path.join(__dirname, '../src/assets/logo192.png'),
  path.join(__dirname, '../src/assets/logo512.png')
];

// Criar os arquivos PNG
console.log('🔄 Criando ícones PNG temporários...');

paths.forEach(filePath => {
  try {
    // Garantir que o diretório existe
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Escrever o arquivo
    fs.writeFileSync(filePath, purplePixelBuffer);
    console.log(`✅ Ícone criado: ${filePath}`);
  } catch (err) {
    console.error(`❌ Erro ao criar o ícone: ${filePath}`);
    console.error(err);
  }
});

console.log('🎉 Todos os ícones temporários foram criados com sucesso!');
console.log('⚠️ Estes são apenas ícones temporários. Para ícones reais, você precisará gerar PNGs a partir do SVG.'); 