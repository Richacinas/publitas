import { ThemeProvider } from 'styled-components'
import { Header, Slider, Footer } from '@components';

import theme from './theme';
import { SCWrapper } from './styles';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <SCWrapper>
        <Header title="Publitas Frontend Code Challenge" />
        <Slider />
        <Footer />
      </SCWrapper>
    </ThemeProvider>
  );
}

export default App;
