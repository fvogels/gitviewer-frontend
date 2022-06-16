import { HeaderBox } from 'components/headerbox';
import React, { useEffect } from 'react';
import { Vector } from 'vector';
import { SelectionContext } from 'selection-context';



function CommitPropertyView(props: { hash: string }): JSX.Element
{
    const [data, setData] = React.useState<any>(undefined);

    useEffect(() => {
        async function fetchData() {
            const url = `/api/v1/repository/commits/${props.hash}`;
            console.log(url);
            const rawData = await fetch(url);
            const data = await rawData.json();
            setData(data);
        }

        fetchData().catch(console.error);
    }, []);

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
    const { selectionId, setSelection } = React.useContext(SelectionContext);
    const mySelectionId = `commit:${hash}`;
    const selected = selectionId === mySelectionId;
    const fill = selected ? '#FAA' : '#AAA';
    const strokeWidth = selected ? 3 : 1;

    return (
        <>
            <circle id={hash} cx={position.x} cy={position.y} r={20} fill={fill} stroke='black' strokeWidth={strokeWidth} onClick={onClick} />
        </>
    );


    function onClick() {
        const viewer = (
            <CommitPropertyView hash={hash} />
        );

        setSelection(mySelectionId, viewer);
    }
}
