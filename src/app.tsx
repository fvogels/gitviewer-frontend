import { Arrow } from 'arrow';
import React from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import { Vector } from 'vector';


const VerticalSplit = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: stretch;
`;

const HorizontalSplit = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: stretch;
`;

const HeightPanel = styled.div<{height: string}>`
  height: ${props => props.height};
  width: 100%;
`;

const WidthPanel = styled.div<{width: string}>`
  width: ${props => props.width};
  height: 100%;
`;


type CommitProps = {
  selected: boolean,
  position: Vector,
  onClick: () => void,
};

function Commit({selected, position, onClick} : CommitProps) : JSX.Element
{
  const fill = selected ? '#FAA' : '#AAA';
  const strokeWidth = selected ? 3 : 1;

  return (
    <>
      <circle cx={position.x} cy={position.y} r={20} fill={fill} stroke='black' strokeWidth={strokeWidth} onClick={onClick} />
    </>
  );
}


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


function HeaderBox(props : { caption: string, children ?: React.ReactNode, captionLocation : 'north' | 'west' }) : JSX.Element
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


function WorkingAreaView() : JSX.Element
{
  return (
    <HeaderBox caption='Working Area' captionLocation='west'>
      <p>Hello world</p>
    </HeaderBox>
  );
}

function StagingAreaView() : JSX.Element
{
  return (
    <HeaderBox caption='Staging Area' captionLocation='west'>
      <p>Hello world</p>
    </HeaderBox>
  );
}

function RepositoryView() : JSX.Element
{
  return (
    <HeaderBox caption='Repository' captionLocation='west'>
      <svg width="100%">
        <Commit selected={false} position={new Vector(100, 100)} onClick={() => {}} />
        <Commit selected={false} position={new Vector(200, 100)} onClick={() => {}} />
        <Arrow from={new Vector(200, 100)} to={new Vector(100, 100)} />
      </svg>
    </HeaderBox>
  );
}

function PropertiesView() : JSX.Element
{
  return (
    <HeaderBox caption='Properties' captionLocation='north'>
      <p>Properties</p>
    </HeaderBox>
  );
}


function App()
{
  const [selectedCommit, setSelectedCommit] = React.useState<number>(0);

  return (
    <HorizontalSplit>
      <WidthPanel width='70%'>
        <VerticalSplit>
          <HeightPanel height='50%'>
            <RepositoryView />
          </HeightPanel>
          <HeightPanel height='25%'>
            <StagingAreaView />
          </HeightPanel>
          <HeightPanel height='25%'>
            <WorkingAreaView />
          </HeightPanel>
        </VerticalSplit>
      </WidthPanel>
      <WidthPanel width='30%'>
        <PropertiesView />
      </WidthPanel>
    </HorizontalSplit>
  );
}


const rootContainer = document.getElementById('root');

if ( rootContainer ) {
    const root = createRoot(rootContainer);

    root.render(
        <>
            <App />
        </>
    );
}
else
{
    throw Error("Could not find root container");
}
