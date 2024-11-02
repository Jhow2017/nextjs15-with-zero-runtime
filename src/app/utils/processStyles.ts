import fs from 'fs';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

// Esta função recebe os estilos e salva em um arquivo CSS estático
function processStyles(styles: string, className: string): void {
    const css = `.${className} { ${styles} }`;
    const result = postcss([autoprefixer]).process(css).css;
    fs.appendFileSync('./generatedStyles.css', result);
}
