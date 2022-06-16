import styled from 'styled-components';


export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  flex-flow: column wrap;
`;

const FileContainer = styled.span`
  font-family: monospace;
  padding: 0.25em;
  margin: 0.25em;
  background: #448;
`;

type FileProps = {
  path: string,
  onClick ?: () => void,
}

export function File({path, onClick}: FileProps) : JSX.Element
{
  return (
    <FileContainer onClick={onClick}>
      {path}
    </FileContainer>
  );
}
