import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { keycloak } from '../api/keycloak';

type User = { email: string; fullname: string };

type AuthContextType = {
    loggedUser: User;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

const isE2E = import.meta.env.VITE_E2E === 'true';

const e2eMockContext: AuthContextType = {
    isAuthenticated: true,
    loggedUser: { email: 'andreytsuzuki@gmail.com', fullname: 'Andrey Tsuzuki' },
    login: () => {},
    logout: () => {},
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    if (isE2E) {
        return <AuthContext.Provider value={e2eMockContext}>{children}</AuthContext.Provider>;
    }

    return <AuthProviderReal>{children}</AuthProviderReal>;
}

function AuthProviderReal({ children }: { children: React.ReactNode }) {
    const initialized = useRef(false);
    const [ready, setReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loggedUser, setLoggedUser] = useState<User>({ email: '', fullname: '' });

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        keycloak
        .init({
            redirectUri: window.location.origin + '/',
            onLoad: 'login-required',
            checkLoginIframe: false,
            enableLogging: true,
        })
        .then((auth) => {
            const parsed = keycloak.tokenParsed;
            const email = parsed?.email;
            const fullname = parsed?.name;

            setIsAuthenticated(auth);
            setReady(true);
            setLoggedUser({ email, fullname });
        })
        .catch(console.error);

        keycloak.onAuthSuccess = () => setIsAuthenticated(true);
        keycloak.onAuthLogout = () => setIsAuthenticated(false);

        keycloak.onTokenExpired = () => {
            keycloak.updateToken(30).catch(() => {
                setIsAuthenticated(false);
                keycloak.logout({
                    redirectUri: window.location.origin,
                });
            });
        };
    }, []);

    if (!ready) return <div>Loading session…</div>;

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                loggedUser,
                login: () =>
                    keycloak.login({
                        prompt: 'login',
                        redirectUri: window.location.href,
                    }),
                logout: () =>
                    keycloak.logout({
                        redirectUri: window.location.origin,
                    }),
            }}
        >
        {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
