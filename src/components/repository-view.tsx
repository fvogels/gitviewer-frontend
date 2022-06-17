import { HeaderBox } from 'components/headerbox';
import React, { useEffect } from 'react';
import styled, { DefaultTheme, ThemeContext } from 'styled-components';
import { Vector } from 'vector';
import { CommitView } from 'components/commit-view';
import { Arrow } from 'components/arrow';
import { Label } from './label';



type DetachedHead = { is_detached: true, commit: string };
type AttachedHead = { is_detached: false, commit: string, branch: string };
type Head = DetachedHead | AttachedHead;

type RawData = {
    branches: { [key: string]: string },
    commits: { [key: string]: [string] },
    HEAD: Head,
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


function determineCommitPositions(data: RawData): { [key: string]: Vector }
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


function createCommitCircles(data: RawData, commitPositions: { [key: string]: Vector }): JSX.Element[]
{
    return Object.keys(data.commits).map(commit => {
        if ( commit in commitPositions ) {
            return <CommitView key={commit} hash={commit} position={commitPositions[commit]} />
        }
        else
        {
            return <></>;
        }
    });
}


function createCommitArrows(data: RawData, commitPositions: { [key: string]: Vector }, theme: DefaultTheme): JSX.Element[]
{
    return Object.keys(data.commits).flatMap(childCommit => {
        const childPosition = commitPositions[childCommit];

        return data.commits[childCommit].map(parentCommit => {
            const parentPosition = commitPositions[parentCommit];
            const key=`${childCommit}:${parentCommit}`;

            return (
                <React.Fragment key={key}>
                    {connect(childPosition, parentPosition, theme.commitRadius)}
                </React.Fragment>
            );
        });
    });


    function connect(from: Vector, to: Vector, radius: number) : JSX.Element
        {
            const correction = from.to(to).normalize().mul(radius);
            const correctedFrom = from.add(correction);
            const correctedTo = to.sub(correction);

            return (
                <Arrow from={correctedFrom} to={correctedTo} />
            );
        }
}


function createLabels(data: RawData, commitPositions: { [key: string]: Vector }, theme: DefaultTheme): JSX.Element[]
{
    console.log(data);

    const branchLabels = Object.entries(data.branches).map(([branch, hash]) => {
        return (
            <Label key={branch} position={commitPositions[hash]} caption={branch} dy={theme.commitRadius + 5} />
        );
    });

    return [createHeadLabel(), ...branchLabels];


    function createHeadLabel()
    {
        if ( data.HEAD.is_detached )
        {
            return (
                <Label key="HEAD" position={commitPositions[data.HEAD.commit]} caption="HEAD" dy={theme.commitRadius + 5} />
            );
        }
        else
        {
            return (
                <Label key="HEAD" position={commitPositions[data.HEAD.commit]} caption="HEAD" dy={theme.commitRadius + 5 + theme.labelHeight + 5} />
            );
        }
    }
}


export function RepositoryView(): JSX.Element
{
    const theme = React.useContext(ThemeContext);
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
        const commitPositions: { [key: string]: Vector } = determineCommitPositions(data);
        const commitCircles = createCommitCircles(data, commitPositions);
        const commitArrows = createCommitArrows(data, commitPositions, theme);
        const labels = createLabels(data, commitPositions, theme);

        return (
            <HeaderBox caption='Repository' captionLocation='west'>
                <svg width="100%">
                    {commitCircles}
                    {commitArrows}
                    {labels}
                </svg>
            </HeaderBox>
        );
    }
    else {
        return <></>;
    }
}