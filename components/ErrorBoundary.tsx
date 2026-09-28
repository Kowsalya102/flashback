"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ComponentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Component Error Boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-xl bg-[#11111A] border border-red-800/40 text-xs font-mono text-gray-300 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>{this.props.fallbackTitle || "Component Render Error"}</span>
          </div>
          <p className="text-[11px] text-gray-400">
            {this.state.error?.message || "An error occurred in this section."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="px-3 py-1 rounded-lg bg-red-950/30 border border-red-800/50 text-red-300 hover:text-white text-[11px] flex items-center gap-1 font-bold"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
