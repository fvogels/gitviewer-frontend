import { HeaderBox } from 'components/headerbox';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Vector } from 'vector';
import { CommitView } from 'components/commit-view';



export function RepositoryView() : JSX.Element
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
            masterCommits.map((commit, i) => <CommitView hash={commit} position={new Vector(100 * (i + 1), 100)} />)
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