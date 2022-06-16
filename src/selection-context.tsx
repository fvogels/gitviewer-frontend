import React from 'react';


type SelectionSetter = (selectionId: string, propertyView: JSX.Element) => void;

export const SelectionContext = React.createContext<{setSelection: SelectionSetter, selectionId: string, propertyView: JSX.Element}>({
    setSelection: () => {},
    selectionId: '',
    propertyView: <></>,
});
