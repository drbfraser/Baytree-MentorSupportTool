import { BAYTREE_PRIMARY_COLOR, BAYTREE_SECONDARY_COLOR } from '../constants/constants'

export interface ThemeState {
  colors: {
    primaryColor: string;
    secondaryColor: string;
    borderColor: string;
  };
  formatters: {
    dateTimeFormatter: (dateTime: Date) => string;
  };
}

const initialState: ThemeState = {
  colors: {
    primaryColor: BAYTREE_PRIMARY_COLOR,
    secondaryColor: BAYTREE_SECONDARY_COLOR,
    borderColor: '#303030',
  },
  formatters: {
    dateTimeFormatter: (dateTime: Date) => {
      return dateTime.toDateString()
    },
  },
}

const themeReducer = (
  state: ThemeState = initialState,
  action: any
): ThemeState => {
  const { type } = action
  switch (type) {
    default:
      return state
  }
}

export default themeReducer
