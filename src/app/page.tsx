import { css, styled } from 'ds/utils/zero-runtime-styled';

interface ButtonProps {
    primary?: boolean;
}

const buttonStyles = css`
    color: red;
    padding: 24px 32px;
    font-size: 24px;
    border-radius: 100px;
    line-height: 24px;
`;

const Button = styled<ButtonProps>('button')`
    background-color: ${(props) => (props.primary ? 'blue' : 'green')};
    color: white;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 8px;
    border: none;
    ${buttonStyles}
    cursor: pointer;

    &:hover {
        background-color: ${(props) =>
            props.primary ? 'darkblue' : 'darkgray'};
    }
`;

const DsFlex = styled('div')`
    display: flex;
    gap: 16px;
`;

export default function Home() {
    return (
        <DsFlex>
            <Button primary>Primary Button</Button>
            <Button>Default Button</Button>
        </DsFlex>
    );
}
