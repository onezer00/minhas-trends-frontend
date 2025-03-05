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
    return true;
  } catch (err) {
    console.error(`❌ Erro ao copiar arquivo: ${source} -> ${target}`);
    console.error(err);
    return false;
  }
}

// Criar favicon.svg a partir do logo.svg
console.log('🔄 Atualizando favicon.svg...');
if (copyFile('src/assets/logo.svg', 'public/favicon.svg')) {
  console.log('✅ favicon.svg atualizado com sucesso!');
}

// Copiar os arquivos de logo
console.log('🔄 Copiando arquivos de logo...');
const logoFiles = [
  { src: 'src/assets/logo.svg', dest: 'public/logo.svg' },
  { src: 'src/assets/logo192.png', dest: 'public/logo192.png' },
  { src: 'src/assets/logo512.png', dest: 'public/logo512.png' }
];

let allSuccess = true;
logoFiles.forEach(file => {
  if (!copyFile(file.src, file.dest)) {
    allSuccess = false;
  }
});

if (allSuccess) {
  console.log('🎉 Todos os arquivos foram copiados com sucesso!');
} else {
  console.log('⚠️ Alguns arquivos não puderam ser copiados. Verifique os erros acima.');
} 