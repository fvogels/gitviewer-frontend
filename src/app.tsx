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


function WorkingAreaView() : JSX.Element
{
  return (
    <p>Working Area</p>
  );
}

function StagingAreaView() : JSX.Element
{
  return (
    <p>Staging Area</p>
  );
}

function RepositoryView() : JSX.Element
{
  return (
    <div>
      <svg width="100%">
        <Commit selected={false} position={new Vector(100, 100)} onClick={() => {}} />
        <Commit selected={false} position={new Vector(200, 100)} onClick={() => {}} />
        <Arrow from={new Vector(200, 100)} to={new Vector(100, 100)} />
      </svg>
    </div>
  );
}

function PropertiesView() : JSX.Element
{
  return (
    <p>Properties</p>
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
