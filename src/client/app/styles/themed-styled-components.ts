// themed-styled-component.ts
// tslint:disable:no-duplicate-imports
import * as styledComponents from 'styled-components';
import { ThemedStyledComponentsModule } from 'styled-components';
import { Theme } from '../themes';

const {
  default: styled,
  css,
  createGlobalStyle,
  ThemeProvider,
  ThemeConsumer,
  ThemeContext,
  keyframes,
} = (styledComponents as any) as ThemedStyledComponentsModule<Theme>;

export {
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
  ThemeConsumer,
  ThemeContext,
};
export default styled;
