import { Provider } from 'react-redux';
import { ReactNode } from 'react'
import {persistor, store} from "@/app/store";
import {PersistGate} from "redux-persist/integration/react";
import {CheckTokenProvider} from "@/app/providers/CheckTokenProvider.tsx";

interface AppProviderProps {
    children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
    // redux 저장소 어디에서도 사용 가능하게 설정.
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <CheckTokenProvider>
                    {children}
                </CheckTokenProvider>
            </PersistGate>
        </Provider>
    );
}
