import type { NavigatorScreenParams } from '@react-navigation/native';


export type FindVineBarStackParamList = {
  FindVineBarMain: undefined;
  LoadingScreen: { categoryId: string };
  RandomChoice: { categoryId: string };
};


export type SurpriseStackParamList = {
  SurpriseMeMain: undefined;
  SurpriseWebView: undefined;
  FinalResult: { categoryId: string };
};


export type TabParamList = {
  FindVineBar: NavigatorScreenParams<FindVineBarStackParamList>;
  SurpriseMe: NavigatorScreenParams<SurpriseStackParamList>;
  DummyHomeTab: undefined;
  VineBarMap: {
    title?: string;
    coordinates?: string;
    autoFocus?: boolean;
    selectedId?: string;
  };
  SavedBars: undefined;
};



export type RootStackParamList = {
  Loader: { categoryId: string };
  Onboarding: undefined;
  Home: undefined;
  Main: NavigatorScreenParams<TabParamList>;


  VineBarMapScreen: {
    coordinates: string;
    title: string;
    autoFocus?: boolean;
    selectedId?: string;
  };
};
