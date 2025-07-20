declare module './AuthContext' {
    import { ReactNode } from 'react';
    export const AuthProvider: ({ children }: { children: ReactNode }) => JSX.Element;
    export const AuthContext: React.Context<any>;
} 