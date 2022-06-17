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
  }
}