declare module './AuthForm' {
    import { FC } from 'react';
    const AuthForm: FC<{ type: 'login' | 'register' }>;
    export default AuthForm;
} 