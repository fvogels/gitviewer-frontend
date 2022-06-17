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


function* generateDeltas() : Iterable<Vector>
{
    let i = 0;
    while ( i < 100 )
    {
        yield new Vector(0, i);
        yield new Vector(0, -i);
        i++;
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

    let current : string | undefined;
    while ( current = todo.shift() ) {
        const parents = commits[current];

        const [ parent ] = parents;

        if ( gridPositions[parent] )
        {
            const position = findFirstFree(gridPositions[parent].add(new Vector(1, 0)));
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

    const positions :  { [key: string] : Vector } = {};

    for ( const [c, p] of Object.entries(gridPositions) )
    {
        positions[c] = new Vector(p.x * 100 + 100, p.y * 100 + 100);
    }

    return positions;


    function findFirstFree(position: Vector) : Vector
    {
        for ( const delta of generateDeltas() )
        {
            const p  = position.add(delta);

            if ( !gridUsage.get(p, false) )
            {
                return p;
            }
        }

        throw new Error(`Couldn't find free position for ${current}`);
    }
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

        if ( !childPosition )
        {
            console.log(commitPositions);
            throw new Error(`Couldn't find position for commit with hash ${childCommit}`);
        }

        return data.commits[childCommit].map(parentCommit => {
            const parentPosition = commitPositions[parentCommit];

            if ( !parentPosition )
            {
                throw new Error(`Couldn't find position for commit with hash ${parentCommit}`);
            }

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
    const [anchor, setAnchor] = React.useState<Vector | undefined>(undefined);
    const [offset, setOffset] = React.useState<Vector>(new Vector(0, 0));

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
                <svg width="100%" onMouseMove={onMouseMove} onMouseDown={onMouseDown}>
                    <g transform={`translate(${offset.x}, ${offset.y})`}>
                        {commitCircles}
                        {commitArrows}
                        {labels}
                    </g>
                </svg>
            </HeaderBox>
        );
    }
    else {
        return <></>;
    }


    function onMouseDown(e : React.MouseEvent<SVGSVGElement>)
    {
        const leftButtonDown = (e.button === 0);

        if ( leftButtonDown )
        {
            setAnchor(new Vector(e.clientX, e.clientY));
        }
    }

    function onMouseMove(e : React.MouseEvent<SVGSVGElement>)
    {
        const leftButtonDown = (e.buttons & 1) !== 0;

        if ( leftButtonDown && anchor )
        {
            const clickPosition = new Vector(e.clientX, e.clientY);
            const delta = clickPosition.sub(anchor);
            const newOffset = offset.add(delta);
            setOffset(newOffset);
            setAnchor(clickPosition);
        }
    }
}