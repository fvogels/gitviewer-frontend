import { HeaderBox } from 'components/headerbox';
import React, { useEffect } from 'react';
import { FileList, File } from 'components/filelist';
import { SelectionContext } from 'selection-context';



function WorkingAreaPropertyView(props: { pathParts: string[] }) : JSX.Element
{
    const [data, setData] = React.useState<any>(undefined);

    useEffect(() => {
        async function fetchData() {
            const url = `/api/v1/working-area/${props.pathParts.join('/')}`;
            console.log(url);
            const rawData = await fetch(url);
            const data = await rawData.json();
            setData(data);
        }

        fetchData().catch(console.error);
    }, [props.pathParts]);

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

export function WorkingAreaView(): JSX.Element
{
    const [files, setFiles] = React.useState<string[][]>([]);
    const { selectionId, setSelection } = React.useContext(SelectionContext);


    useEffect(() => {
        async function fetchData() {
            const rawData = await fetch('/api/v1/working-area');
            const data = await rawData.json();
            setFiles(data['files']);
        }

        fetchData().catch(console.error);
    }, []);

    return (
        <HeaderBox caption='Working Area' captionLocation='west'>
            <FileList>
                {files.map(renderFile)}
            </FileList>
        </HeaderBox>
    );


    function renderFile(pathParts: string[]): JSX.Element
    {
        const path = pathParts.join('/');
        const mySelectionId = `working-area:${path}`;
        const isSelected = selectionId === mySelectionId;

        return (
            <File key={path} path={path} onClick={onClick} isSelected={isSelected} />
        );


        function onClick()
        {
            setSelection(mySelectionId, <WorkingAreaPropertyView pathParts={pathParts} />);
        }
    }
}
