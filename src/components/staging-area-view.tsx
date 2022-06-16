import { HeaderBox } from 'components/headerbox';
import React, { useEffect } from 'react';
import { FileList, File } from 'components/filelist';


export function StagingAreaView() : JSX.Element
{
    const [files, setFiles] = React.useState<string[][]>([]);

    useEffect(() => {
        async function fetchData()
        {
            const rawData = await fetch('/api/v1/staging-area');
            const data = await rawData.json();
            setFiles(data['files']);
        }

        fetchData().catch(console.error);
    }, []);


    return (
        <HeaderBox caption='Staging Area' captionLocation='west'>
            <FileList>
                {files.map(renderFile)}
            </FileList>
        </HeaderBox>
    );


    function renderFile(pathParts : string[]) : JSX.Element
    {
        const path = pathParts.join('/');

        return (
            <File key={path} path={path} />
        );
    }
}
