import styled from 'styled-components';


export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  flex-flow: column wrap;
`;

const FileContainer = styled.span<{isSelected: boolean}>`
  font-family: monospace;
  padding: 0.25em;
  margin: 0.25em;
  background: ${props => props.isSelected ? '#668' : '#448'};
`;

type FileProps = {
  path: string,
  onClick ?: () => void,
  isSelected ?: boolean,
}

export function File({path, onClick, isSelected = false}: FileProps) : JSX.Element
{
  return (
    <FileContainer onClick={onClick} isSelected={isSelected}>
      {path}
    </FileContainer>
  );
}
