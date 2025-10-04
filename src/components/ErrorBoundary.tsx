import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-muted-foreground mb-4">
              We encountered an error while loading the application.
            </p>
            {this.state.error && (
              <details className="text-left mb-4 p-4 bg-muted rounded-lg">
                <summary className="cursor-pointer font-medium mb-2">
                  Error Details
                </summary>
                <pre className="text-xs overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
            >
              Reload Application
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
