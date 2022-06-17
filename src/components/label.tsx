import React from "react";
import styled, { ThemeContext } from "styled-components";
import { Vector } from "vector";


type LabelProps = {
    position: Vector,
    caption: string,
    dy: number
};

const LabelText = styled.text`
    fill: white;
    font-weight: bold;
    font-family: monospace;
    user-select: none;
`;

export function Label({position, caption, dy} : LabelProps) : JSX.Element
{
    const theme = React.useContext(ThemeContext);

    return (
        <>
            <rect x={position.x - theme.labelWidth / 2} y={position.y - theme.labelHeight - dy} width={theme.labelWidth} height={theme.labelHeight} fill={theme.branchLabelColor} />
            <LabelText x={position.x} y={position.y} dy={-dy - 6} textAnchor="middle">{caption}</LabelText>
        </>
    );
}
