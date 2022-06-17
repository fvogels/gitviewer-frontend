import { HeaderBox } from 'components/headerbox';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Vector } from 'vector';
import { CommitView } from 'components/commit-view';



type DetachedHead = { is_detached: true, commit: string };
type AttachedHead = { is_detached: false, commit: string, branch: string };
type Head = DetachedHead | AttachedHead;

type RawData = {
    branches: { [key: string]: string },
    commits: { [key: string]: [string] },
    head: Head,
}


class Grid<T>
{
    private readonly data: {[key: string] : T};

    constructor()
    {
        this.data = {};
    }

    public contains(v: Vector): boolean
    {
        return this.key(v) in this.data;
    }

    public get(v: Vector, ifMissing: T): T
    {
        return this.data[this.key(v)] || ifMissing;
    }

    public set(v: Vector, value: T): void
    {
        const key = this.key(v);
        this.data[key] = value;
    }

    private key(v : Vector) : string
    {
        return `${v.x},${v.y}`;
    }
}


function determinePositions(data: RawData): { [key: string]: Vector }
{
    const commits = data['commits'];
    const gridPositions : { [key: string] : Vector } = {};
    const masterCommits: string[] = [data['branches']['master']];
    const gridUsage = new Grid<boolean>();

    while (commits[masterCommits[0]].length > 0) {
        masterCommits.unshift(commits[masterCommits[0]][0]);
    }

    // Place commits in master branch
    masterCommits.forEach((c, i) => {
        const position = new Vector(i, 0);
        gridPositions[c] = position;
        gridUsage.set(position, true);
    });

    // Collect non-master commits
    const todo = Object.keys(commits).filter(c => !gridPositions[c]);
    let counter = 0;

    console.log(`todo: ${todo.join(' ')}`);

    let current : string | undefined;
    while ( current = todo.shift() ) {
        const parents = commits[current];

        if ( parents.length === 1 )
        {
            const [ parent ] = parents;

            if ( gridPositions[parent] )
            {
                let position = gridPositions[parent].add(new Vector(1, 0));

                while ( gridUsage.get(position, false) )
                {
                    position = position.add(new Vector(0, 1));
                }

                gridPositions[current] = position;
                gridUsage.set(position, true);
                counter = 0;
            }
            else
            {
                todo.push(current);
                counter++;

                if ( counter === todo.length )
                {
                    throw new Error(`Got stuck while placing commits`);
                }
            }
        }
    }

    const positions :  { [key: string] : Vector } = {};

    for ( const [c, p] of Object.entries(gridPositions) )
    {
        positions[c] = new Vector(p.x * 100 + 100, p.y * 100 + 100);
    }

    return positions;
}


export function RepositoryView(): JSX.Element
{
    const [data, setData] = React.useState<RawData | undefined>(undefined);

    useEffect(() => {
        async function fetchData() {
            const rawData = await fetch('/api/v1/repository');
            const data = await rawData.json();
            setData(data);
        }

        fetchData().catch(console.error);
    }, []);

    if (data) {

        const commitPositions: { [key: string]: Vector } = determinePositions(data);

        return (
            <HeaderBox caption='Repository' captionLocation='west'>
                <svg width="100%">
                    {
                        Object.keys(data.commits).map(commit => {
                            if ( commit in commitPositions ) {
                                return <CommitView key={commit} hash={commit} position={commitPositions[commit]} />
                            }
                            else
                            {
                                return <></>;
                            }
                        })
                    }
                </svg>
            </HeaderBox>
        );
    }
    else {
        return <></>;
    }
}