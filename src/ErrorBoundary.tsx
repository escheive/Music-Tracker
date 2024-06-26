import { useRouteError } from "react-router-dom";

import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.errorMessage) {
      return <ErrorPage />;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;


const ErrorPage = ({ errorMessage }) => {
  const error: any = useRouteError();
  console.error(error);
  console.log(errorMessage)

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i></i>
      </p>
    </div>
  );
}