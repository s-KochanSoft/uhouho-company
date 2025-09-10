"use client";
import React from "react";

type Props = { children: React.ReactNode; fallback?: React.ReactNode };
type State = { hasError: boolean; message?: string };

export default class ClientErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }
  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error("ClientErrorBoundary catched:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="text-sm text-red-400 border border-red-500/40 p-3 bg-red-950/30 rounded">
          コンポーネントの読み込みでエラーが発生しました。
        </div>
      );
    }
    return this.props.children;
  }
}
