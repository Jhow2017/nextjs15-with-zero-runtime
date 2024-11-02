// styled.ts
import React, { FC } from 'react';

// Definimos um tipo básico para um componente com estilos
type StyledComponent<T extends keyof JSX.IntrinsicElements> = FC<JSX.IntrinsicElements[T] & { className?: string }>;

// Função principal `styled` que aceita um elemento HTML como argumento
export function styled<T extends keyof JSX.IntrinsicElements>(tag: T) {
    return (styles: TemplateStringsArray): StyledComponent<T> => {
        const className = generateClassName(styles.join(''));

        // Esta função processará os estilos em build-time, e aqui estamos tipando o componente final
        processStyles(styles.join(''), className);

        // Retornamos um componente funcional que aplica a classe CSS gerada
        return ({ children, ...props }) => React.createElement(tag, { ...props, className }, children);
    };
}

// Função para gerar um nome de classe exclusivo para cada conjunto de estilos
function generateClassName(styles: string): string {
    return 'zsc-' + styles.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}
