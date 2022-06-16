import React from 'react';


type SelectionSetter = (selection: string) => void;

export const SelectionContext = React.createContext<{setSelection: SelectionSetter, selection: string}>({setSelection: () => {}, selection: ''});
