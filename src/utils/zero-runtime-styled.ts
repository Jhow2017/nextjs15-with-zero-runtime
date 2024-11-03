import React, { ReactNode } from 'react';
import crypto from 'crypto';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

type StyledProps<Props> = Props & { children?: ReactNode };

// Função `css` para reutilizar e compor estilos
export const css = (
    strings: TemplateStringsArray,
    ...args: (string | number | ((props: any) => string | number) | undefined)[]
) => {
    return (props: any) =>
        strings.reduce((acc, str, i) => {
            const value = args[i] !== undefined
                ? typeof args[i] === 'function'
                    ? args[i]!(props)
                    : args[i]
                : '';
            return acc + str + value;
        }, '');
};

// Função para processar o CSS com logs de depuração
function processCss(styles: string) {
    try {
        return postcss([autoprefixer]).process(styles).css;
    } catch (error) {
        console.error('Erro ao processar CSS:', error); // Log do erro se houver
        throw error;
    }
}

// Função `styled` com suporte a props tipadas e filtragem para não passar para o DOM
export const styled = <Props extends {}>(tag: keyof JSX.IntrinsicElements) => (
    styles: TemplateStringsArray | ((props: StyledProps<Props>) => TemplateStringsArray),
    ...args: ((props: StyledProps<Props>) => string | number | undefined)[]
) => {
    return (props: StyledProps<Props>) => {
        const { children, ...restProps } = props;

        // Gerar o CSS com base nas props
        const evaluatedStyles = (typeof styles === 'function' ? styles(props) : styles) as TemplateStringsArray;
        const className = generateUniqueClassName(evaluatedStyles, args, props);

        const processedStyles = processCss(css(evaluatedStyles, ...args.map((arg) => (typeof arg === 'function' ? arg(props) : arg)))(props));

        saveStylesForBuild(className, processedStyles);

        // Filtrar props para incluir apenas as que pertencem ao elemento HTML
        const domProps: JSX.IntrinsicElements[typeof tag] = {} as JSX.IntrinsicElements[typeof tag];
        Object.keys(restProps).forEach((key) => {
            if (key in domProps) {
                // Tipo seguro para excluir props personalizadas e não passar ao DOM
                (domProps as any)[key] = (restProps as any)[key];
            }
        });

        return React.createElement(tag, {
            ...domProps,
            className,
            children,
        });
    };
};

// Função para gerar hash exclusivo para o CSS
function generateUniqueClassName(styles: TemplateStringsArray, args: any[], props: any): string {
    const combinedStyles = css(styles, ...args.map((arg) => (typeof arg === 'function' ? arg(props) : arg)))(props);
    return `css-${crypto.createHash('md5').update(combinedStyles).digest('hex')}`;
}

// Função para salvar estilos no build final
import fs from 'fs';
import path from 'path';

let cssContent = '';

function saveStylesForBuild(className: string, css: string) {
    const publicDir = path.resolve(process.cwd(), 'public');
    const outputPath = path.join(publicDir, 'generated-styles.css');

    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    if (!fs.existsSync(outputPath)) {
        fs.writeFileSync(outputPath, '');
    }

    if (!cssContent.includes(className)) {
        cssContent += `.${className} { ${css} }\n`;
        fs.writeFileSync(outputPath, cssContent, 'utf-8');
        //console.log(`Estilos atualizados para ${className} em ${outputPath}`);
    }
}
