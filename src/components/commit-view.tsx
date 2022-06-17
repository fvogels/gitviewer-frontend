import React, { useEffect } from 'react';
import { Vector } from 'vector';
import { SelectionContext } from 'selection-context';
import styled, { ThemeContext } from 'styled-components';



type RawData = {
    author: string,
    message: string,
    parents: string[],
    date: string,
};


const PropertyTableContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: stretch;
`;

function PropertyTable(props : {children: React.ReactNode}) : JSX.Element
{
    return (
        <PropertyTableContainer>
            {props.children}
        </PropertyTableContainer>
    );
}


const PropertyEntry = styled.div`
    display: flex;
    flex-direction: column;
`;

const PropertyKey = styled.div`
    background: ${props => props.theme.propertyHeaderColor};
    color: ${props => props.theme.propertyHeaderTextColor};
    padding: 0.1em 0.5em;
    font-variant: small-caps;
    user-select: none;
`;

const PropertyValue = styled.div`
    padding: 0.1em 0.2em;
    margin-bottom: 0.5em;
`;


function CommitPropertyView(props: { hash: string }): JSX.Element
{
    const [data, setData] = React.useState<RawData | undefined>(undefined);

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
            <PropertyTable>
                <PropertyEntry>
                    <PropertyKey>Author</PropertyKey>
                    <PropertyValue>{data.author}</PropertyValue>
                </PropertyEntry>
                <PropertyEntry>
                    <PropertyKey>Date</PropertyKey>
                    <PropertyValue>{data.date}</PropertyValue>
                </PropertyEntry>
                <PropertyEntry>
                    <PropertyKey>Message</PropertyKey>
                    <PropertyValue>{data.message}</PropertyValue>
                </PropertyEntry>
                <PropertyEntry>
                    <PropertyKey>#Parents</PropertyKey>
                    <PropertyValue>{data.parents.length}</PropertyValue>
                </PropertyEntry>
            </PropertyTable>
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
            <circle id={hash} onClick={onClick} cx={position.x} cy={position.y} r={theme.commitRadius} fill={fill} stroke='black' strokeWidth={strokeWidth} />
        </>
    );


    function onClick() {
        const viewer = (
            <CommitPropertyView hash={hash} />
        );

        setSelection(mySelectionId, viewer);
    }
}
