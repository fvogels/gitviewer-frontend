import React, { useEffect } from 'react';
import { Vector } from 'vector';
import { SelectionContext } from 'selection-context';
import styled, { ThemeContext } from 'styled-components';



function CommitPropertyView(props: { hash: string }): JSX.Element
{
    const [data, setData] = React.useState<any>(undefined);

    useEffect(() => {
        async function fetchData() {
            const url = `/api/v1/repository/commits/${props.hash}`;
            const rawData = await fetch(url);
            const data = await rawData.json();
            setData(data);
        }

        fetchData().catch(console.error);
    }, [props.hash]);

    if (data) {
        return (
            <table>
                <tbody>
                    {Object.keys(data).map(key => <tr key={key}><td>{key}</td><td>{data[key]}</td></tr>)}
                </tbody>
            </table>
        );
    }
    else {
        return <></>;
    }
}


type CommitProps = {
    hash: string,
    position: Vector,
};


export function CommitView({ position, hash }: CommitProps): JSX.Element
{
    const theme = React.useContext(ThemeContext);
    const { selectionId, setSelection } = React.useContext(SelectionContext);
    const mySelectionId = `commit:${hash}`;
    const selected = selectionId === mySelectionId;
    const fill = selected ? theme.selectedCommitColor : theme.unselectedCommitColor;
    const strokeWidth = selected ? 3 : 1;

    return (
        <>
            <circle id={hash} onClick={onClick} cx={position.x} cy={position.y} r={32} fill={fill} stroke='black' strokeWidth={strokeWidth} />
        </>
    );


    function onClick() {
        const viewer = (
            <CommitPropertyView hash={hash} />
        );

        setSelection(mySelectionId, viewer);
    }
}
