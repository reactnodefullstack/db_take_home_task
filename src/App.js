import logo from './logo.svg';
import './App.css';
import Grid from './components/Grid/index.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import Dialog from './utils/Dialog/index.tsx'

function ErrorFallbackComponent({ error, resetErrorBoundary }) {
  console.log('**** Error = ', error)
  return <Dialog title="Error" content={error} action={resetErrorBoundary}/>
}

function App() {
  console.log('@@@ APP render')
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallbackComponent}
      onError={(err)=>{
        console.log('@@@@ Error boundry err = ', err)
      }}
    >
        <div className='app'> 
          <Grid />
        </div>
    </ErrorBoundary>
  );
}

export default App;
