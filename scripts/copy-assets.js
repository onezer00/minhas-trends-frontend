const fs = require('fs');
const path = require('path');

// Função para copiar arquivos
function copyFile(source, target) {
  try {
    // Verificar se o diretório de destino existe
    const targetDir = path.dirname(target);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Copiar o arquivo
    fs.copyFileSync(source, target);
    console.log(`✅ Arquivo copiado: ${source} -> ${target}`);
  } catch (err) {
    console.error(`❌ Erro ao copiar arquivo: ${source} -> ${target}`);
    console.error(err);
  }
}

// Arquivos a serem copiados
const files = [
  { src: 'src/assets/logo.svg', dest: 'public/logo.svg' },
  { src: 'src/assets/logo192.png', dest: 'public/logo192.png' },
  { src: 'src/assets/logo512.png', dest: 'public/logo512.png' }
];

// Copiar cada arquivo
files.forEach(file => {
  copyFile(file.src, file.dest);
});

console.log('🎉 Todos os arquivos foram copiados com sucesso!'); 