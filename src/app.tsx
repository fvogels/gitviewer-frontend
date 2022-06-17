import { HeaderBox } from 'components/headerbox';
import React from 'react';
import { createRoot } from 'react-dom/client';
import styled, { ThemeContext } from 'styled-components';
import { WorkingAreaView } from 'components/working-area-view';
import { StagingAreaView } from 'components/staging-area-view';
import { SelectionContext } from 'selection-context';
import { RepositoryView } from 'components/repository-view';
import { DefaultTheme } from 'styled-components';


const VerticalSplit = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: stretch;
`;

const HorizontalSplit = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: stretch;
`;

const HeightPanel = styled.div<{height: string}>`
  height: ${props => props.height};
  width: 100%;
`;

const WidthPanel = styled.div<{width: string}>`
  width: ${props => props.width};
  height: 100%;
`;


function PropertiesView() : JSX.Element
{
  const { propertyView } = React.useContext(SelectionContext);

  return (
    <HeaderBox caption='Properties' captionLocation='north'>
      {propertyView}
    </HeaderBox>
  );
}


class Theme implements DefaultTheme
{
    selectedColor = '#5A5';

    unselectedColor = '#555';

    get selectedCommitColor() { return this.selectedColor; }

    get unselectedCommitColor() { return this.unselectedColor; }

    get selectedFileColor() { return this.selectedColor; }

    get unselectedFileColor() { return this.unselectedColor; }

    commitRadius = 16;

    labelWidth = 95;

    labelHeight = 20;

    branchLabelColor = '#A44';
}


function App()
{
  const [selectionId, setSelectionId] = React.useState<string>('');
  const [propertyView, setPropertyView] = React.useState<JSX.Element>(<></>);

  return (
    <ThemeContext.Provider value={new Theme()}>
      <SelectionContext.Provider value={{selectionId, setSelection, propertyView}}>
        <HorizontalSplit>
          <WidthPanel width='70%'>
            <VerticalSplit>
              <HeightPanel height='50%'>
                <RepositoryView />
              </HeightPanel>
              <HeightPanel height='25%'>
                <StagingAreaView />
              </HeightPanel>
              <HeightPanel height='25%'>
                <WorkingAreaView />
              </HeightPanel>
            </VerticalSplit>
          </WidthPanel>
          <WidthPanel width='30%'>
            <PropertiesView />
          </WidthPanel>
        </HorizontalSplit>
      </SelectionContext.Provider>
    </ThemeContext.Provider>
  );


  function setSelection(selectionId: string, propertyView: JSX.Element)
  {
    setSelectionId(selectionId);
    setPropertyView(propertyView);
  }
}


const rootContainer = document.getElementById('root');

if ( rootContainer ) {
    const root = createRoot(rootContainer);

    root.render(
        <>
            <App />
        </>
    );
}
else
{
    throw Error("Could not find root container");
}
