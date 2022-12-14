import 'styled-components';



declare module 'styled-components'
{
  export interface DefaultTheme
  {
    selectedCommitColor: string;

    unselectedCommitColor: string;

    selectedFileColor: string;

    unselectedFileColor: string;

    commitRadius: number;

    labelWidth: number;

    labelHeight: number;

    branchLabelColor: string;

    propertyHeaderColor: string;

    propertyHeaderTextColor : string;
  }
}
