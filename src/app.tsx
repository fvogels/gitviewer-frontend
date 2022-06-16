import { Arrow } from 'arrow';
import { HeaderBox } from 'components/headerbox';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import { Vector } from 'vector';
import { WorkingAreaView } from 'components/working-area-view';
import { StagingAreaView } from 'components/staging-area-view';
import { SelectionContext } from 'selection-context';


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
  hash: string,
  position: Vector,
};

function Commit({position, hash} : CommitProps) : JSX.Element
{
  const {selection, setSelection} = React.useContext(SelectionContext);
  const selectionId = `commit:${hash}`;
  const selected = selection === selectionId;
  const fill = selected ? '#FAA' : '#AAA';
  const strokeWidth = selected ? 3 : 1;

  return (
    <>
      <circle id={hash} cx={position.x} cy={position.y} r={20} fill={fill} stroke='black' strokeWidth={strokeWidth} onClick={onClick} />
    </>
  );


  function onClick()
  {
    setSelection(selectionId);
  }
}


function RepositoryView() : JSX.Element
{
  const [data, setData] = React.useState<any>(undefined);

  useEffect(() => {
    async function fetchData()
    {
      const rawData = await fetch('/api/v1/repository');
      const data = await rawData.json();
      setData(data);
    }

    fetchData().catch(console.error);
  }, []);

  if ( data )
  {
    const commits = data['commits'];
    const masterCommits: string[] = [ data['branches']['master'] ];
    while ( commits[masterCommits[0]].length > 0 )
    {
      masterCommits.unshift(commits[masterCommits[0]][0]);
    }

    return (
      <HeaderBox caption='Repository' captionLocation='west'>
        <svg width="100%">
          {
            masterCommits.map((commit, i) => <Commit hash={commit} position={new Vector(100 * (i + 1), 100)} />)
          }
        </svg>
      </HeaderBox>
    );
  }
  else
  {
    return <></>;
  }
}

function PropertiesView(props: {selectionId: string}) : JSX.Element
{
  const [data, setData] = React.useState<any>(undefined);

  useEffect(() => {
    async function fetchData()
    {
        const commitPrefix = 'commit:';

        if ( props.selectionId.startsWith(commitPrefix) )
        {
            const url = `/api/v1/repository/commits/${props.selectionId.substring(commitPrefix.length)}`;
            console.log(url);
            const rawData = await fetch(url);
            const data = await rawData.json();
            setData(data);
        }
    }

    fetchData().catch(console.error);
  }, [props.selectionId]);

  if (data)
  {
    return (
      <HeaderBox caption='Properties' captionLocation='north'>
        <table>
          <tbody>
            {Object.keys(data).map(key => <tr key={key}><td>{key}</td><td>{data[key]}</td></tr>)}
          </tbody>
        </table>
      </HeaderBox>
    );
  }
  else
  {
    return <></>;
  }
}


function App()
{
  const [selection, setSelection] = React.useState<string>('');

  return (
    <SelectionContext.Provider value={{selection, setSelection}}>
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
          <PropertiesView selectionId={selection} />
        </WidthPanel>
      </HorizontalSplit>
    </SelectionContext.Provider>
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
