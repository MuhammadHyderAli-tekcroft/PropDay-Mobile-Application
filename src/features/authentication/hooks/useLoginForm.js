import { useCallback, useState } from 'react';

export function useLoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);
    const [showPass, setShowPass] = useState(false);

    const toggleRemember = useCallback(() => setRemember((r) => !r), []);
    const toggleShowPass = useCallback(() => setShowPass((s) => !s), []);

    return {
        email,
        setEmail,
        password,
        setPassword,
        remember,
        toggleRemember,
        showPass,
        toggleShowPass,
    };
}
