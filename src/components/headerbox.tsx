import React from 'react';
import styled from 'styled-components';


const HeaderBoxContainer = styled.div<{orientation: 'horizontal' | 'vertical'}>`
  display: flex;
  flex-direction: ${props => props.orientation === 'horizontal' ? 'row' : 'column'};
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  height: 100%;
  border: 1px solid white;
`;

const HeaderBoxCaption = styled.div<{orientation: 'horizontal' | 'vertical'}>`
  ${props => props.orientation === 'vertical' ? 'writing-mode: vertical-lr; transform: rotate(180deg);' : ''}
  text-align: center;
  font-size: 1.5em;
  background: #222;
  font-variant: small-caps;
  padding: 0.5em;
`;


export function HeaderBox(props : { caption: string, children ?: React.ReactNode, captionLocation : 'north' | 'west' }) : JSX.Element
{
  const orientation = props.captionLocation === 'north' ? 'vertical' : 'horizontal';
  const captionOrientation = props.captionLocation === 'north' ? 'horizontal' : 'vertical';

  return (
    <HeaderBoxContainer orientation={orientation}>
      <HeaderBoxCaption orientation={captionOrientation}>{props.caption}</HeaderBoxCaption>
      {props.children}
    </HeaderBoxContainer>
  );
}
